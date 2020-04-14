from django.urls import re_path

from . import worker, consumers

websocket_urlpatterns = [
    re_path(r'ws/chat/(?P<room_name>\w+)/$', consumers.ChatConsumer),
]

worker_channels = {
    worker.WEREWOLF_CHANNEL: worker.BackgroundConsumer,
}
