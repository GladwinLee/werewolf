# chat/consumers.py

from channels.generic.websocket import AsyncJsonWebsocketConsumer
from .consumer_role_manager import ConsumerRoleManager

from .worker import WEREWOLF_CHANNEL


class ChatConsumer(AsyncJsonWebsocketConsumer):
    player_name = ""
    player_list = []
    player_role = ""
    role_manager = ConsumerRoleManager()

    async def connect(self):
        self.room_name = self.scope['url_route']['kwargs']['room_name']
        self.room_group_name = 'werewolf_%s' % self.room_name

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
            })
        elif msg_type == "action":
            await self.send_to_worker({
                'type': msg_type,
                'action_type': content['action_type'],
                'choice': content['choice'],
            })
        elif msg_type == "start":
            await self.send_to_worker({
                'type': msg_type,
            })
        elif msg_type == "role_special":
            await self.send_to_worker({
                'type': msg_type,
                'role_special': content['role_special'],
                'player1': content['player1'],
            })
        elif msg_type == "reset":
            await self.send_to_worker({
                'type': msg_type,
            })

    # Receive message from room group
    async def chat_message(self, event):
        await self.send_json({
            'message': event['message']
        })

    async def worker_player_list_change(self, data):
        self.player_list = data['player_list']
        await self.send_json(data)

    async def worker_start(self, data):
        print("Starting for %s" % self.player_name)
        msg = self.role_manager.handle_start(data, self.player_name)
        await self.send_json(msg)

    async def worker_players_not_voted_list_change(self, data):
        await self.send_json(data)

    async def worker_reset(self, data):
        await self.send_json(data)

    async def worker_action(self, content):
        action = content['action']
        if action == 'vote':
            choices = self.player_list.copy()
            choices.remove(self.player_name)
            content['choices'] = choices
            await self.send_json(content)
        elif self.role_manager.is_player_role(action):
            msg = self.role_manager.handle_action(content, self.player_name, self.player_list)
            if msg:
                await self.send_json(msg)
        else:
            msg = {
                "type": content['type'],
                "action": "wait",
                "waiting_on": action
            }
            await self.send_json(msg)

    async def worker_winner(self, data):
        msg = {
            'type': data['type'],
            'winner': data['winner'],
            'vote_results': data['vote_results'],
            'known_roles': data['roles'],
            'player_role': data['roles'][self.player_name],
        }
        await self.send_json(msg)

    # Private helpers
    async def send_to_worker(self, msg):
        print("To worker name:%s :%s" % (self.player_name, msg))
        msg['_name'] = self.player_name
        msg['_channel_name'] = self.channel_name
        msg['_room_group_name'] = self.room_group_name

        await self.channel_layer.send(
            WEREWOLF_CHANNEL,
            msg
        )

    # Send message to WebSocket
    async def send_json(self, msg, close=False):
        print("To client name:%s :%s" % (self.player_name, msg))
        await super().send_json(msg, close)
