# chat/consumers.py
from channels.consumer import AsyncConsumer

from .game import Game

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

    async def vote(self, data):
        name = data['name']
        vote = data['vote']
        room = data['room_group_name']

        print("%s voted %s" % (name, vote))
        players_not_voted = self.game.vote(name, vote)

        await self.group_send(
            room,
            {
                'type': 'worker.players_not_voted_list_change',
                'players_not_voted': players_not_voted
            })

        if len(players_not_voted) == 0:
            winner, vote_results, roles = self.game.get_winner()
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
        roles = self.game.get_roles()
        werewolves = self.game.get_werewolves()

        msg = {
            'type': 'worker.start',
            'roles': roles,
            'werewolves': werewolves,
        }
        await self.group_send(room_group_name, msg)
        await self.send_next_action(room_group_name)

    async def role_special(self, data):
        name = data['name']
        room_group_name = data['room_group_name']
        channel_name = data['channel_name']
        role_special = data['role_special']
        player1 = data['player1']
        player2 = data.setdefault('player2', None)

        print("%s used special: %s" % (name, role_special))

        result_type, result = self.game.handle_special(role_special, player1, player2)

        msg = {
            'type': 'worker.role_special',
            'result_type': result_type,
            'result': result,
        }
        await self.channel_send(channel_name, msg)
        await self.send_next_action(room_group_name)

    async def send_next_action(self, room_group_name):
        next_action = self.game.get_next_action()

        msg = {
            'type': 'worker.action',
            'action': next_action
        }
        await self.group_send(room_group_name, msg)

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
