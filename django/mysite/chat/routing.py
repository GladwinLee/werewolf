from django.urls import re_path

from . import bg_consumer, consumers

websocket_urlpatterns = [
    re_path(r'ws/chat/(?P<room_name>\w+)/$', consumers.ChatConsumer),
]

bg_consumer_channels = {
    bg_consumer.WEREWOLF_CHANNEL: bg_consumer.BackgroundConsumer,
}