from asyncio import run
from threading import Timer
from time import sleep

from channels.consumer import AsyncConsumer

from .game import Game

NAME_FIELD = '_name'
ROOM_GROUP_NAME_FIELD = '_room_group_name'
CHANNEL_NAME_FIELD = '_channel_name'

START_WAIT_TIME = 2
ROLE_WAIT_TIME = 5

WEREWOLF_CHANNEL = 'werewolf-channel'


# This doesn't work with multiple rooms atm
class GameWorker(AsyncConsumer):
    def __init__(self, *args, **kwargs):
        super().__init__(*args, **kwargs)
        self.game = Game()
        self.action_log = []

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
        if len(player_list) == 1:
            await self.channel_send(
                data[CHANNEL_NAME_FIELD],
                {
                    'type': 'worker.game_master',
                    'configurable_roles': configurable_roles,
                }
            )

        # Send message to room group
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

        print("%s %s: %s" % (name, action_type, choice))
        if action_type == 'vote':
            await self.vote(data)
        elif self.game.is_role_action(action_type):
            await self.role_action(data)
        else:
            print(action_type, " not supported")

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

    async def send_winner(self, room):
        winner, vote_results = self.game.get_winner()
        roles = self.game.get_roles()
        action_log = self.game.get_action_log()
        await self.group_send(
            room,
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
        print("%s started the game" % name)

        self.game.configure_roles(data['roles'])
        self.game.start_game()

        player_roles = self.game.get_roles().copy()
        player_roles.pop("Middle 1")
        player_roles.pop("Middle 2")
        player_roles.pop("Middle 3")

        role_info = self.game.get_role_info()

        msg = {
            'type': 'worker.start',
            'roles': player_roles,
            'role_info': role_info,
        }
        await self.group_send(room_group_name, msg)

        sleep(START_WAIT_TIME)
        await self.send_next_action(room_group_name)

    async def role_action(self, data):
        channel_name = data[CHANNEL_NAME_FIELD]
        action_type = data['action_type']
        choice = data['choice']
        player_name = data[NAME_FIELD]

        response = self.game.handle_special(action_type, player_name, choice)
        if response:
            result_type, result = response
            await self.channel_send(channel_name, {
                'type': 'worker.role_special',
                'result_type': result_type,
                'result': result,
            })

    async def action_timeout(self, action, room_group_name):
        timed_out = self.game.handle_special_timeout(action)
        if timed_out:
            print("%s timed out" % action)
        await self.send_next_action(room_group_name)

    async def send_next_action(self, room_group_name):
        next_action = self.game.get_next_action()
        msg = {
            'type': 'worker.action',
            'action': next_action,
        }

        if next_action != 'vote':
            msg['role_wait_time'] = ROLE_WAIT_TIME
            await self.start_next_action_timer(next_action, room_group_name)

        await self.group_send(room_group_name, msg)

    async def start_next_action_timer(self, next_action, room_group_name):
        def current_action_timeout():
            run(self.action_timeout(next_action, room_group_name))

        action_timer = Timer(ROLE_WAIT_TIME + 1, current_action_timeout)
        action_timer.start()

    async def reset(self, data):
        print("%s reset the game" % data[NAME_FIELD])
        await self.group_send(
            data[ROOM_GROUP_NAME_FIELD],
            {
                'type': 'worker.reset',
            })
        self.game.reset()

    # Private helpers
    async def group_send(self, room, msg):
        print("send room:%s" % room)
        print(msg)
        await self.channel_layer.group_send(
            room,
            msg
        )

    async def channel_send(self, channel, msg):
        print("Send channel:%s, %s" % (channel, msg))
        await self.channel_layer.send(
            channel,
            msg
        )

    async def dispatch(self, message):
        print("Received ", message)
        await super().dispatch(message)
