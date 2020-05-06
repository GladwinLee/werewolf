# chat/consumers.py

from channels.generic.websocket import AsyncJsonWebsocketConsumer

from .worker import WEREWOLF_CHANNEL


class ChatConsumer(AsyncJsonWebsocketConsumer):
    player_name = ""
    player_list = []
    player_role = ""

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
                'room_group_name': self.room_group_name,
            })
        elif msg_type == "action":
            await self.send_to_worker({
                'type': msg_type,
                'action_type': content['action_type'],
                'choice': content['choice'],
                'name': self.player_name,
                'room_group_name': self.room_group_name,
                'channel_name': self.channel_name,
            })
        elif msg_type == "start":
            await self.send_to_worker({
                'type': msg_type,
                'name': self.player_name,
                'room_group_name': self.room_group_name,
            })
        elif msg_type == "role_special":
            await self.send_to_worker({
                'type': msg_type,
                'name': self.player_name,
                'channel_name': self.channel_name,
                'role_special': content['role_special'],
                'player1': content['player1'],
                'room_group_name': self.room_group_name,
            })
    # Receive message from room group
    async def chat_message(self, event):
        await self.send_json({
            'message': event['message']
        })

    # Receive message from room group
    async def worker_player_list_change(self, data):
        self.player_list = data['player_list']
        await self.send_json(data)

    # Receive message from room group
    async def worker_start(self, data):
        roles = data['roles']
        werewolves = data['werewolves']
        print("Starting for %s" % self.player_name)
        self.player_role = roles[self.player_name]

        msg = {
            'type': data['type'],
            'player_role': self.player_role,
            'known_roles': {self.player_name: self.player_role},
        }

        if self.player_name in werewolves:
            msg['known_roles'] = {name: role for name, role in roles.items() if name in werewolves}

        # Send message to WebSocket
        await self.send_json(msg)

    # Receive message from room group
    async def worker_players_not_voted_list_change(self, data):
        await self.send_json(data)

    async def worker_action(self, content):
        action = content['action']
        if action == 'vote':
            choices = self.player_list.copy()
            choices.remove(self.player_name)
            content['choices'] = choices
            await self.send_json(content)
        elif self.player_role == action:
            # move to role_manager_actions.py
            if action == 'seer':
                choices = self.player_list.copy()
                choices.remove(self.player_name)
                choices += ["Middle 1,2", "Middle 1,3", "Middle 2,3"]
                content['choices'] = choices
                await self.send_json(content)
        else:
            msg = {
                "type": content['type'],
                "action": "wait",
                "waiting_on": action
            }
            await self.send_json(msg)

    async def worker_role_special(self, data):
        result_type = data['result_type']
        if result_type == "role":
            await self.send_json(data)

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
        await self.channel_layer.send(
            WEREWOLF_CHANNEL,
            msg
        )

    # Send message to WebSocket
    async def send_json(self, msg, close=False):
        print("To client name:%s :%s" % (self.player_name, msg))
        await super().send_json(msg, close)
