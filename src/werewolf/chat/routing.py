from django.urls import re_path

from . import game_worker, client_consumer

websocket_urlpatterns = [
    re_path(r'ws/werewolf/(?P<room_name>\w+)/$', client_consumer.ClientConsumer),
]

worker_channels = {
    game_worker.WEREWOLF_CHANNEL: game_worker.GameWorker,
}
