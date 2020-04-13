# chat/consumers.py
from channels.consumer import AsyncConsumer

WEREWOLF_CHANNEL = 'werewolf-channel'

# This probably doesn't work with multiple rooms atm
class BackgroundConsumer(AsyncConsumer):
    num_players = 1

    async def player_join(self, message):
        room_group_name = message['message']
        player = self.num_players
        self.num_players += 1

        out_msg = {
            'type': 'chat_message',
            'message': "Player %s has joined" % player
        }

        # Send message to room group
        await self.channel_layer.group_send(
            room_group_name,
            out_msg
        )

        print("sent %s %s" % (room_group_name, out_msg))
