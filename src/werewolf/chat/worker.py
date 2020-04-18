# chat/consumers.py
from channels.consumer import AsyncConsumer

from .game import Game

WEREWOLF_CHANNEL = 'werewolf-channel'


# This probably doesn't work with multiple rooms atm
class BackgroundConsumer(AsyncConsumer):
    num_players = 0
    player_list = {}
    game = Game()

    async def player_join(self, data):
        channel = data['channel_name']
        room = data['room_name']

        await self.channel_send(
            channel,
            {
                'type': 'player_list_change',
                'player_list': self.player_list.setdefault(room, []),
            }
        )

    async def player_leave(self, data):
        name = data['name']
        room = data['room_group_name']
        self.player_list[room].remove(name)

        await self.group_send(
            data['room_group_name'],
            {
                'type': 'player_list_change',
                'player_list': self.player_list[room],
            }
        )

    async def name_select(self, data):
        room = data['room_group_name']
        name = data['name']
        self.num_players += 1
        self.player_list.setdefault(room, []).append(name)

        # Send message to room group
        await self.group_send(
            room,
            {
                'type': 'player_list_change',
                'player_list': self.player_list[room]
            })

    async def vote(self, data):
        name = data['name']
        vote = data['vote']

        print("%s voted %s" % (name, vote))
        self.game.vote(name, vote)

    async def start(self, data):
        name = data['name']
        room_group_name = data['room_group_name']
        print("%s started the game" % name)

        roles = self.game.start_game()
        msg = {
            'type': 'start',
            'roles': roles
        }
        await self.group_send(room_group_name, msg)

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
