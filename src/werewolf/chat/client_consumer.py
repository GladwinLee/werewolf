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
ch.setLevel(logging.DEBUG)  # todo set back to INFO

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

        await self.channel_layer.group_discard(
            self.room_group_name,
            self.channel_name
        )

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
              or msg_type == "configure_settings"
              or msg_type == "reset"):
            await self.send_to_worker(data)
        else:
            logger.error(f"Invalid msg_type {msg_type}")

    async def worker_info(self, data):
        await self.send_json(data)

    async def worker_player_list_change(self, data):
        self.player_list = data['player_list']
        await self.send_json(data)

    async def worker_page_change(self, data):
        page = data['page']
        if page == "PreNightPage":
            self.role_manager.player_name = self.player_name
            known_roles = self.role_manager.get_known_roles(data['roles'])
            msg = {
                'page': page,
                'known_roles': known_roles,
                'wait_time': data['wait_time']
            }
        elif page == "NightPage":
            msg = {
                'page': page,
                'wait_time': data['wait_time']
            }
            msg.update(self.get_action_msg(data['action']))
        else:
            msg = data
        await self.send_json(msg)

    def get_action_msg(self, action):
        if action == 'vote':
            player_after_self = self.player_list[
                (self.player_list.index(self.player_name) + 1) % len(
                    self.player_list)
                ]
            choices = self.player_list.copy()
            choices.remove(self.player_name)
            return {
                "action": "vote",
                "choices": choices,
                "default": player_after_self,
                "choice_type": "pick1",
            }
        elif self.role_manager.is_player_role(action):
            return self.role_manager.get_role_action_data(
                action,
                player_name=self.player_name,
                player_list=self.player_list
            )
        else:
            return {
                "action": "wait",
                "waiting_on": action,
            }

    async def worker_start(self, data):
        logger.debug(f"{self.player_name} Starting for %s" % self.player_name)
        msg = self.role_manager.get_initial_role_info(data, self.player_name)
        await self.send_json(msg)

    async def worker_players_not_voted_list_change(self, data):
        await self.send_json(data)

    async def worker_reset(self, data):
        self.reset()
        await self.send_json(data)

    async def worker_game_master(self, data):
        await self.send_json(data)

    async def worker_role_special(self, data):
        result_type = data['result_type']
        if result_type == "witch":
            target, target_role = list(data['result'].items())[0]
            msg = {
                'page': 'NightPage',
                # will continue wait_time where witch part1 ended
            }
            msg.update(self.role_manager.get_role_action_data(
                WITCH_PART_TWO,
                player_list=self.player_list,
                target=target,
                role_to_swap=target_role
            ))
            await self.send_json(msg)
        elif result_type == "sentinel":
            self.role_manager.set_sentinel_target(data['result'])
        else:
            await self.send_json(data)

    async def worker_winner(self, data):
        await self.send_json(data)

    async def worker_start_day(self, data):
        result_type, result = self.role_manager.start_day(data)
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
