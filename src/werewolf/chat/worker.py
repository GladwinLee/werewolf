# chat/consumers.py
from channels.consumer import AsyncConsumer
from threading import Timer
from asyncio import run
from time import sleep

from .game import Game

start_wait_time = 2
role_wait_time = 4.0

WEREWOLF_CHANNEL = 'werewolf-channel'


# This probably doesn't work with multiple rooms atm
class BackgroundConsumer(AsyncConsumer):
    num_players = 0
    game = Game()

    async def player_join(self, data):
        channel = data['channel_name']
        room = data['room_name']
        player_list = self.game.get_player_names()

        await self.channel_send(
            channel,
            {
                'type': 'worker.player_list_change',
                'player_list': player_list,
            }
        )

    async def player_leave(self, data):
        name = data['name']
        room = data['room_group_name']
        player_list = self.game.remove_player(name)

        await self.group_send(
            data['room_group_name'],
            {
                'type': 'worker.player_list_change',
                'player_list': player_list,
            }
        )

    async def name_select(self, data):
        room = data['room_group_name']
        name = data['name']
        self.num_players += 1
        player_list = self.game.add_player(name)

        # Send message to room group
        await self.group_send(
            room,
            {
                'type': 'worker.player_list_change',
                'player_list': player_list
            })

    async def action(self, content):
        name = content['name']
        action_type = content['action_type']
        choice = content['choice']

        print("%s %s: %s" % (name, action_type, choice))
        if action_type == 'vote':
            await self.vote(content)
        elif self.is_role_action(action_type):
            await self.role_action(content)
        else:
            print(action_type, " not supported")

    async def vote(self, content):
        name = content['name']
        room = content['room_group_name']
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
        name = data['name']
        room_group_name = data['room_group_name']
        print("%s started the game" % name)

        self.game.start_game()
        roles = self.game.get_roles().copy()
        roles.pop("Middle 1")
        roles.pop("Middle 2")
        roles.pop("Middle 3")
        werewolves = self.game.get_werewolves()

        msg = {
            'type': 'worker.start',
            'roles': roles,
            'werewolves': werewolves,
        }
        await self.group_send(room_group_name, msg)

        sleep(start_wait_time)
        await self.send_next_action(room_group_name)

    def is_role_action(self, action_type):
        return action_type in {'seer'}

    async def role_action(self, content):
        room_group_name = content['room_group_name']
        channel_name = content['channel_name']
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
        await self.group_send(room_group_name, {
            'type': 'worker.action',
            'action': next_action,
            'role_wait_time': role_wait_time
        })

        if next_action != 'vote':
            def current_action_timeout():
                run(self.action_timeout(next_action, room_group_name))

            action_timer = Timer(role_wait_time, current_action_timeout)
            action_timer.start()

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
