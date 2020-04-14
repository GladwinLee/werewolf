# chat/consumers.py
import json

from channels.generic.websocket import AsyncWebsocketConsumer

from .worker import WEREWOLF_CHANNEL


class ChatConsumer(AsyncWebsocketConsumer):
    player_name = ""
    async def connect(self):
        self.room_name = self.scope['url_route']['kwargs']['room_name']
        self.room_group_name = 'chat_%s' % self.room_name

        # Join room group
        await self.channel_layer.group_add(
            self.room_group_name,
            self.channel_name
        )

        await self.accept()

        await self.channel_layer.send(
            WEREWOLF_CHANNEL,
            {
                'type': 'player_join',
                'channel_name': self.channel_name
            }
        )

    async def disconnect(self, close_code):
        await self.channel_layer.send(
            WEREWOLF_CHANNEL,
            {
                'type': 'player_leave',
                'name': self.player_name,
                'room_group_name': self.room_group_name,
            }
        )

        # Leave room group
        await self.channel_layer.group_discard(
            self.room_group_name,
            self.channel_name
        )

    # Receive message from WebSocket
    async def receive(self, text_data=None, byte_data=None):
        text_data_json = json.loads(text_data)
        message = text_data_json['message']

        print("client sent: %s" % text_data)

        type = text_data_json['type']
        if type == "name_select":
            if self.player_name != "":
                # send error to client
                return

            self.player_name = message
            # Send message to room group
            await self.channel_layer.send(
                WEREWOLF_CHANNEL,
                {
                    'type': 'name_select',
                    'name': message,
                    'room_group_name': self.room_group_name,
                }
            )

    # Receive message from room group
    async def chat_message(self, event):
        message = event['message']

        # Send message to WebSocket
        await self.send(text_data=json.dumps({
            'message': message
        }))

    # Receive message from room group
    async def player_list_change(self, event):
        player_list = event['player_list']

        msg = {
            'type': 'player_list_change',
            'message': player_list,
        }

        # Send message to WebSocket
        await self.send(text_data=json.dumps(msg))
        print("Sent %s" % msg)
