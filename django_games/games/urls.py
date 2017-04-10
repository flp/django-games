from django.conf.urls import url

from . import views

app_name = 'games'
urlpatterns = [
    # e.g.: /games/
    url(r'^$', views.index, name='index'),

    # e.g.: /games/current_player/
    url(r'^current_player/$', views.current_player),

    # e.g.: /games/new/
    url(r'^new/$', views.new_game, name='new_game'),

    # e.g.: /games/game_32/
    url(r'^game_(?P<game_id>[0-9]+)/$', views.game, name='game'),

    # e.g: /games/game_32/game_creator/
    url(r'^game_(?P<game_id>[0-9]+)/game_creator/$', views.game_creator),
]
