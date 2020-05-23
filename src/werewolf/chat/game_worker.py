import logging
from asyncio import run
from logging.handlers import RotatingFileHandler
from threading import Timer
from time import sleep

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
ch.setLevel(logging.INFO)

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
        "start": 2,
        "role": 5,
        "vote": 300,
    }

    def __init__(self, *args, **kwargs):
        super().__init__(*args, **kwargs)
        self.game = Game()
        self.action_log = []
        self.action_timer = None  # Timer object

    async def player_join(self, data):
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

        await self.group_send(
            data[ROOM_GROUP_NAME_FIELD],
            {
                'type': 'worker.player_list_change',
                'player_list': player_list,
            }
        )

    async def name_select(self, data):
        player_list = self.game.add_player(data['name'])
        configurable_roles = self.game.get_configurable_roles()

        # first player to join is the game master
        if len(player_list) == 1:
            await self.channel_send(
                data[CHANNEL_NAME_FIELD],
                {
                    'type': 'worker.game_master',
                    'configurable_roles': configurable_roles,
                }
            )

        await self.group_send(
            data[ROOM_GROUP_NAME_FIELD],
            {
                'type': 'worker.player_list_change',
                'player_list': player_list
            })

    async def action(self, data):
        name = data[NAME_FIELD]
        action_type = data['action_type']
        choice = data['choice']

        logger.info("%s %s: %s" % (name, action_type, choice))
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

        winner, vote_results = self.game.get_winner()
        roles = self.game.get_full_roles_map()
        action_log = self.game.get_action_log()
        await self.group_send(
            room_group_name,
            {
                'type': 'worker.winner',
                'winner': winner,
                'vote_results': vote_results,
                'known_roles': roles,
                'action_log': action_log,
            })

    async def start(self, data):
        name = data[NAME_FIELD]
        room_group_name = data[ROOM_GROUP_NAME_FIELD]
        logger.info("%s started the game" % name)

        self.configure_settings(data)
        self.game.start_game()

        player_roles = self.game.get_players_to_roles()

        await self.group_send(
            room_group_name,
            {
                'type': 'worker.start',
                'roles': player_roles,
                'role_info': self.game.get_role_info(),
            })

        sleep(self.get_wait_time("start"))
        await self.send_next_action(room_group_name)

    def configure_settings(self, data):
        self.game.configure_roles(data['settings']['selected_roles'])
        self.wait_times['role'] = int(data['settings']['role_wait_time'])
        self.wait_times['vote'] = int(data['settings']['vote_wait_time']) * 60

    async def role_action(self, data):
        channel_name = data[CHANNEL_NAME_FIELD]
        player_name = data[NAME_FIELD]
        action_type = data['action_type']
        choice = data['choice']

        response = self.game.handle_role_action(
            action_type, player_name, choice)

        if response:
            result_type, result = response
            await self.channel_send(channel_name, {
                'type': 'worker.role_special',
                'result_type': result_type,
                'result': result,
            })

    async def handle_action_timeout(self, action, room_group_name):
        self.game.handle_action_timeout(action)
        await self.send_next_action(room_group_name)

    async def send_next_action(self, room_group_name):
        next_action = self.game.get_next_action()
        if next_action == 'end':
            return

        await self.start_next_action_timer(next_action, room_group_name)
        await self.group_send(room_group_name, {
            'type': 'worker.action',
            'action': next_action,
            'wait_time': self.get_wait_time(next_action),
        })

    def get_wait_time(self, action):
        if action in self.wait_times:
            return self.wait_times[action]
        return self.wait_times["role"]

    async def start_next_action_timer(self, next_action, room_group_name):
        def current_action_timeout():
            run(self.handle_action_timeout(next_action, room_group_name))

        # Allow an extra second for better experience
        self.action_timer = Timer(
            self.get_wait_time(next_action) + 1,
            current_action_timeout
        )
        self.action_timer.start()

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
