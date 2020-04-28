# chat/consumers.py

from channels.generic.websocket import AsyncJsonWebsocketConsumer

from .worker import WEREWOLF_CHANNEL


class ChatConsumer(AsyncJsonWebsocketConsumer):
    player_name = ""
    player_list = []
    player_role = ""

    async def connect(self):
        self.room_name = self.scope['url_route']['kwargs']['room_name']
        self.room_group_name = 'chat_%s' % self.room_name

        # Join room group
        await self.channel_layer.group_add(
            self.room_group_name,
            self.channel_name
        )

        await self.accept()

        await self.send_to_worker({
            'type': 'player_join',
            'channel_name': self.channel_name,
            'room_name': self.room_group_name,
        })

    async def disconnect(self, close_code):
        if self.player_name == "":
            return
        await self.send_to_worker({
            'type': 'player_leave',
            'name': self.player_name,
            'room_group_name': self.room_group_name,
        })

        # Leave room group
        await self.channel_layer.group_discard(
            self.room_group_name,
            self.channel_name
        )

    # Receive message from WebSocket
    async def receive_json(self, content, **kwargs):
        print("client sent: %s" % content)

        msg_type = content['type']
        if msg_type == "name_select":
            if self.player_name != "":
                # send error to client
                return

            self.player_name = content['message']

            await self.send_to_worker({
                'type': 'name_select',
                'name': content['message'],
                'room_group_name': self.room_group_name,
            })
        elif msg_type == "vote":
            vote = content['vote']
            if vote not in self.player_list or vote == self.player_name:
                # send error to client
                return

            await self.send_to_worker({
                'type': 'vote',
                'name': self.player_name,
                'vote': vote,
                'room_group_name': self.room_group_name,
            })
        elif msg_type == "start":
            await self.send_to_worker({
                'type': 'start',
                'name': self.player_name,
                'room_group_name': self.room_group_name,
            })
    # Receive message from room group
    async def chat_message(self, event):
        await self.send_json({
            'message': event['message']
        })

    # Receive message from room group
    async def player_list_change(self, data):
        self.player_list = data['player_list']
        await self.send_json({
            'type': 'player_list_change',
            'message': self.player_list,
        })

    # Receive message from room group
    async def worker_start(self, data):
        roles = data['roles']
        werewolves = data['werewolves']
        print("Starting for %s" % self.player_name)
        self.player_role = roles[self.player_name]

        msg = {
            'type': 'start',
            'player_role': self.player_role,
        }

        if self.player_name in werewolves:
            msg['werewolves'] = werewolves

        # Send message to WebSocket
        await self.send_json(msg)

    # Receive message from room group
    async def players_not_voted_list_change(self, data):
        await self.send_json(data)

    async def winner(self, data):
        await self.send_json(data)

    async def send_to_worker(self, msg):
        print("To worker name:%s :%s" % (self.player_name, msg))
        await self.channel_layer.send(
            WEREWOLF_CHANNEL,
            msg
        )

    # Send message to WebSocket
    async def send_json(self, msg, close=False):
        print("To client name:%s :%s" % (self.player_name, msg))
        await super().send_json(msg, close)
