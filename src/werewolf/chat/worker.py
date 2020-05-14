# chat/consumers.py
from channels.consumer import AsyncConsumer
from threading import Timer
from asyncio import run
from time import sleep

from .game import Game

NAME_FIELD = '_name'
ROOM_GROUP_NAME_FIELD = '_room_group_name'
CHANNEL_NAME_FIELD = '_channel_name'

start_wait_time = 2
role_wait_time = 4.0

WEREWOLF_CHANNEL = 'werewolf-channel'


# This probably doesn't work with multiple rooms atm
class BackgroundConsumer(AsyncConsumer):
    game = Game()

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
        if len(player_list) == 1:
            await self.channel_send(
                data[CHANNEL_NAME_FIELD],
                {
                    'type': 'worker.game_master',
                }
            )

        # Send message to room group
        await self.group_send(
            data[ROOM_GROUP_NAME_FIELD],
            {
                'type': 'worker.player_list_change',
                'player_list': player_list
            })

    async def action(self, content):
        name = content[NAME_FIELD]
        action_type = content['action_type']
        choice = content['choice']

        print("%s %s: %s" % (name, action_type, choice))
        if action_type == 'vote':
            await self.vote(content)
        elif self.game.is_role_action(action_type):
            await self.role_action(content)
        else:
            print(action_type, " not supported")

    async def vote(self, content):
        name = content[NAME_FIELD]
        room = content[ROOM_GROUP_NAME_FIELD]
        vote = content['choice']

        players_not_voted = self.game.vote(name, vote)
        await self.group_send(
            room,
            {
                'type': 'worker.players_not_voted_list_change',
                'players_not_voted': players_not_voted
            })

        if len(players_not_voted) == 0:
            winner, vote_results = self.game.get_winner()
            roles = self.game.get_roles()
            await self.group_send(
                room,
                {
                    'type': 'worker.winner',
                    'winner': winner,
                    'vote_results': vote_results,
                    'roles': roles,
                })

    async def start(self, data):
        name = data[NAME_FIELD]
        room_group_name = data[ROOM_GROUP_NAME_FIELD]
        print("%s started the game" % name)

        self.game.configure_roles(data['roles'])
        self.game.start_game()

        player_roles = self.game.get_roles().copy()
        role_count = {}
        for role in player_roles.values():
            role_count[role] = role_count.setdefault(role, 0) + 1

        player_roles.pop("Middle 1")
        player_roles.pop("Middle 2")
        player_roles.pop("Middle 3")

        msg = {
            'type': 'worker.start',
            'roles': player_roles,
            'role_count': role_count,
        }
        await self.group_send(room_group_name, msg)

        sleep(start_wait_time)
        await self.send_next_action(room_group_name)

    async def role_action(self, content):
        room_group_name = content[ROOM_GROUP_NAME_FIELD]
        channel_name = content[CHANNEL_NAME_FIELD]
        action_type = content['action_type']
        choice = content['choice']

        result_type, result = self.game.handle_special(action_type, choice)

        await self.channel_send(channel_name, {
            'type': 'worker.role_special',
            'result_type': result_type,
            'result': result,
        })
        await self.send_next_action(room_group_name)

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
            msg['role_wait_time'] = role_wait_time

            def current_action_timeout():
                run(self.action_timeout(next_action, room_group_name))

            action_timer = Timer(role_wait_time + 1, current_action_timeout)
            action_timer.start()

        await self.group_send(room_group_name, msg)

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
