from channels.routing import route_class 
from games.consumers import GameConsumer, LobbyConsumer

channel_routing = [
    route_class(LobbyConsumer,
                path=r'^/games/$'),
    route_class(GameConsumer,
                path=r'^/games/game_(?P<game_id>[0-9]+)/$'),
]
