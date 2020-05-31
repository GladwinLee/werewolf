import logging
from asyncio import run
from logging.handlers import RotatingFileHandler
from threading import Timer

from channels.consumer import AsyncConsumer

from .game import Game

NAME_FIELD = '_name'
ROOM_GROUP_NAME_FIELD = '_room_group_name'
CHANNEL_NAME_FIELD = '_channel_name'

WEREWOLF_CHANNEL = 'werewolf-channel'

logger = logging.getLogger("worker")
logger.setLevel(logging.DEBUG)
MAX_MB = 10 * 1000000

fh = RotatingFileHandler("/logs/worker.log", maxBytes=MAX_MB, backupCount=5)
fh.setLevel(logging.DEBUG)
ch = logging.StreamHandler()
ch.setLevel(logging.DEBUG)  # todo set back to INFO

formatter = logging.Formatter(
    fmt='%(asctime)s - %(levelname)s - %(message)s',
    datefmt="%m-%d %H:%M:%S"
)

fh.setFormatter(formatter)
ch.setFormatter(formatter)

logger.addHandler(fh)
logger.addHandler(ch)


# This doesn't work with multiple rooms atm
class GameWorker(AsyncConsumer):
    wait_times = {
        "pre_night": 10,
        "role": 5,
        "vote": 300,
    }

    def __init__(self, *args, **kwargs):
        super().__init__(*args, **kwargs)
        self.game = Game()
        self.action_log = []
        self.action_timer = None  # Timer object

    async def player_join(self, data):
        if self.game.started:
            await self.channel_send(
                data[CHANNEL_NAME_FIELD],
                {
                    'type': 'worker.info',
                    'block_join': True,
                }
            )

        player_list = self.game.get_player_names()

        await self.channel_send(
            data[CHANNEL_NAME_FIELD],
            {
                'type': 'worker.player_list_change',
                'player_list': player_list,
            }
        )

    async def player_leave(self, data):
        player_list = self.game.remove_player(data[NAME_FIELD])
        logger.info(f"{data[NAME_FIELD]} leaves")
        await self.group_send(
            data[ROOM_GROUP_NAME_FIELD],
            {
                'type': 'worker.player_list_change',
                'player_list': player_list,
            }
        )
        await self.reset(data)

    async def name_select(self, data):
        if self.game.started:
            return

        player_list = self.game.add_player(data['name'])
        configurable_roles = self.game.get_configurable_roles()
        logger.info(f"{data['name']} joins")
        msg = {
            'type': 'worker.page_change',
            'page': 'LobbyPage',
            'settings': self.game.get_settings(),
        }
        # first player to join is the game master
        if len(player_list) == 1:
            msg['master'] = True
            msg['configurable_roles'] = configurable_roles

        await self.channel_send(data[CHANNEL_NAME_FIELD], msg)
        await self.group_send(
            data[ROOM_GROUP_NAME_FIELD],
            {
                'type': 'worker.player_list_change',
                'player_list': player_list
            })

    async def configure_settings(self, data):
        self.game.configure_settings(data['settings'])
        self.wait_times['pre_night'] = int(
            data['settings']['pre_night_wait_time'])
        self.wait_times['role'] = int(data['settings']['role_wait_time'])
        self.wait_times['vote'] = int(
            float(data['settings']['vote_wait_time']) * 60)

        await self.group_send(
            data[ROOM_GROUP_NAME_FIELD],
            {
                'type': "worker.info",
                'settings': self.game.get_settings(),
            },
        )

    async def start(self, data):
        name = data[NAME_FIELD]
        room_group_name = data[ROOM_GROUP_NAME_FIELD]
        logger.info("%s started the game" % name)

        self.game.start_game()
        await self.send_next_state(room_group_name)

    async def send_next_state(self, room_group_name):
        next_action = self.game.get_next_action()
        if next_action == 'vote':
            # final action, do not start next action timer
            await self.group_send(room_group_name, {
                'type': 'worker.page_change',
                'page': 'DayPage',
                'action': next_action,
                'wait_time': self.get_wait_time(next_action),
                'roles': self.game.get_full_roles_map(),  # for insomniac
            })
            return

        if next_action == 'pre_night':
            await self.group_send(
                room_group_name,
                {
                    'type': 'worker.page_change',
                    'page': "PreNightPage",
                    'roles': self.game.get_full_roles_map(),
                    'wait_time': self.get_wait_time("pre_night")
                })
        else:
            await self.group_send(room_group_name, {
                'type': 'worker.page_change',
                'page': 'NightPage',
                'action': next_action,
                'wait_time': self.get_wait_time(next_action),
            })
        await self.start_next_action_timer(next_action, room_group_name)

    async def start_next_action_timer(self, next_action, room_group_name):
        def current_action_timeout():
            run(self.handle_action_timeout(next_action, room_group_name))

        # Allow an extra second for better experience
        self.action_timer = Timer(
            self.get_wait_time(next_action) + 1,
            current_action_timeout
        )
        self.action_timer.start()

    async def action(self, data):
        name = data[NAME_FIELD]
        action_type = data['action_type']
        choice = data['choice']

        logger.debug("%s %s: %s" % (name, action_type, choice))
        if action_type == 'vote':
            await self.vote(data)
        else:
            await self.role_action(data)

    async def vote(self, data):
        name = data[NAME_FIELD]
        room = data[ROOM_GROUP_NAME_FIELD]
        vote = data['choice']

        players_not_voted = self.game.vote(name, vote)
        await self.group_send(
            room,
            {
                'type': 'worker.players_not_voted_list_change',
                'players_not_voted': players_not_voted
            })

        if len(players_not_voted) == 0:
            await self.send_winner(room)

    async def send_winner(self, room_group_name):
        try:
            self.action_timer.cancel()
        except AttributeError:
            pass

        winners = self.game.get_winners()
        roles = self.game.get_full_roles_map()
        action_log = self.game.get_action_log()
        await self.group_send(
            room_group_name,
            {
                'type': 'worker.page_change',
                'page': 'EndPage',
                'winners': winners,
                'roles': roles,
                'action_log': action_log,
            })

    async def role_action(self, data):
        player_name = data[NAME_FIELD]
        role_action = data['action_type']
        choice = data['choice']

        response = self.game.handle_role_action(
            role_action, player_name, choice)

        if not response:
            return
        send_to, result = response
        msg = {
            'type': 'worker.role_special',
            'role_action': role_action,
            'result': result,
        }
        if send_to == "all":
            await self.group_send(data[ROOM_GROUP_NAME_FIELD], msg)
        elif send_to == "sender":
            await self.channel_send(data[CHANNEL_NAME_FIELD], msg)

    async def handle_action_timeout(self, action, room_group_name):
        self.game.handle_action_timeout(action)
        await self.send_next_state(room_group_name)

    def get_wait_time(self, action):
        if action in self.wait_times:
            return self.wait_times[action]
        return self.wait_times["role"]

    async def reset(self, data):
        logger.info("%s reset the game" % data[NAME_FIELD])
        await self.group_send(
            data[ROOM_GROUP_NAME_FIELD],
            {
                'type': 'worker.reset',
            })
        self.game.reset()
        try:
            self.action_timer.cancel()
        except AttributeError:
            pass

    # Private helpers
    async def group_send(self, room, msg):
        logger.debug("send room:%s" % room)
        logger.debug(msg)
        await self.channel_layer.group_send(
            room,
            msg
        )

    async def channel_send(self, channel, msg):
        logger.debug("Send channel:%s, %s" % (channel, msg))
        await self.channel_layer.send(
            channel,
            msg
        )

    async def dispatch(self, message):
        logger.debug("Received ", message)
        await super().dispatch(message)
