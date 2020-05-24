import logging
from logging.handlers import RotatingFileHandler

from channels.generic.websocket import AsyncJsonWebsocketConsumer

from .consumer_role_manager import ConsumerRoleManager
from .game_worker import WEREWOLF_CHANNEL
from .role_constants import WITCH_PART_TWO

logger = logging.getLogger("consumer")
logger.setLevel(logging.DEBUG)
MAX_MB = 10 * 1000000

fh = RotatingFileHandler("/logs/consumer.log", maxBytes=MAX_MB, backupCount=5)
fh.setLevel(logging.DEBUG)
ch = logging.StreamHandler()
ch.setLevel(logging.INFO)

formatter = logging.Formatter(
    fmt='%(asctime)s - %(levelname)s - %(thread)d - %(message)s',
    datefmt="%m-%d %H:%M:%S"
)

fh.setFormatter(formatter)
ch.setFormatter(formatter)

logger.addHandler(fh)
logger.addHandler(ch)


class ClientConsumer(AsyncJsonWebsocketConsumer):
    def __init__(self, *args, **kwargs):
        super().__init__(*args, **kwargs)
        self.reset()

    def reset(self):
        self.player_name = ""
        self.player_list = []
        self.player_role = ""
        self.role_manager = ConsumerRoleManager()

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
    async def receive_json(self, data, **kwargs):
        logger.debug(f"{self.player_name} client sent: {data}")

        msg_type = data['type']
        if msg_type == "name_select":
            if self.player_name != "":
                # send error to client
                return
            self.player_name = data['name']
            await self.send_to_worker(data)
        elif (msg_type == "action"
              or msg_type == "start"
              or msg_type == "reset"):
            await self.send_to_worker(data)

    # Receive message from room group
    async def chat_message(self, event):
        await self.send_json({
            'message': event['message']
        })

    async def worker_player_list_change(self, data):
        self.player_list = data['player_list']
        await self.send_json(data)

    async def worker_start(self, data):
        logger.debug(f"{self.player_name} Starting for %s" % self.player_name)
        msg = self.role_manager.handle_start(data, self.player_name)
        await self.send_json(msg)

    async def worker_players_not_voted_list_change(self, data):
        await self.send_json(data)

    async def worker_reset(self, data):
        self.reset()
        await self.send_json(data)

    async def worker_game_master(self, data):
        await self.send_json(data)

    async def worker_action(self, data):
        action = data['action']
        wait_time = data['wait_time']

        if action == 'vote':
            player_after_self = self.player_list[
                (self.player_list.index(self.player_name) + 1) % len(
                    self.player_list)
                ]
            choices = self.player_list.copy()
            choices.remove(self.player_name)
            await self.send_json({
                "type": "action",
                "action": "vote",
                "choices": choices,
                "default": player_after_self,
                "choice_type": "pick1",
                "wait_time": wait_time,
            })
        elif self.role_manager.is_player_role(action):
            await self.send_json(self.role_manager.get_role_action_data(
                data,
                player_name=self.player_name,
                player_list=self.player_list
            ))
        else:
            await self.send_json({
                "type": "action",
                "action": "wait",
                "waiting_on": action,
                'wait_time': wait_time,
            })

    async def worker_role_special(self, data):
        data['type'] = "role_special"
        result_type = data['result_type']
        await self.send_json(data)

        if result_type == "witch":
            result_role = list(data['result'].values())[0]
            await self.send_json(self.role_manager.get_role_action_data(
                {
                    "action": WITCH_PART_TWO,
                    "wait_time": "continue",
                },
                player_name=self.player_name,
                player_list=self.player_list,
                role_to_swap=result_role
            ))
        elif result_type == "sentinel":
            self.role_manager.set_sentinel_target(data['result'])

    async def worker_winner(self, data):
        await self.send_json(data)

    async def worker_start_day(self, data):
        result_type, result = self.role_manager.start_day(data,
                                                          self.player_name)
        if result:
            await self.send_json({
                'type': 'role_special',
                'result_type': result_type,
                'result': result,
            })

    # Private helpers
    async def send_to_worker(self, msg):
        logger.debug(f"{self.player_name} To worker name:%s :%s" % (
            self.player_name, msg))
        msg['_name'] = self.player_name
        msg['_channel_name'] = self.channel_name
        msg['_room_group_name'] = self.room_group_name

        await self.channel_layer.send(
            WEREWOLF_CHANNEL,
            msg
        )

    # Send message to WebSocket
    async def send_json(self, msg, close=False):
        logger.debug(f"{self.player_name} To client name:%s :%s" % (
        self.player_name, msg))
        await super().send_json(msg, close)
