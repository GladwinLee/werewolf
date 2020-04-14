# chat/consumers.py
from channels.consumer import AsyncConsumer

WEREWOLF_CHANNEL = 'werewolf-channel'


# This probably doesn't work with multiple rooms atm
class BackgroundConsumer(AsyncConsumer):
    num_players = 0
    player_list = []

    async def player_join(self, data):
        channel_name = data['channel_name']

        print(self.player_list)

        await self.channel_layer.send(
            channel_name,
            {
                'type': 'player_list_change',
                'player_list': self.player_list,
            }
        )

    async def player_leave(self, data):
        name = data['name']
        self.player_list.remove(name)

        await self.channel_layer.group_send(
            data['room_group_name'],
            {
                'type': 'player_list_change',
                'player_list': self.player_list,
            }
        )

    async def name_select(self, data):
        room_group_name = data['room_group_name']
        name = data['name']
        self.num_players += 1
        self.player_list.append(name)

        out_msg = {
            'type': 'player_list_change',
            'player_list': self.player_list
        }

        # Send message to room group
        await self.channel_layer.group_send(
            room_group_name,
            out_msg
        )

        print("ALL: %s" % out_msg)
