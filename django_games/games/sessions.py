from games.models import Player

def get_player_id(session):
    # designed to fail loudly so that I can catch bugs during development
    player_id = session['player_id']
    return player_id

def get_or_create_player_id(session):
    player_id = session.get('player_id', None)
    if player_id is None:
        player = Player()
        player.save()
        player.player_id = Player.get_player_id(player.id)
        player_id = player.player_id
        player.save()

    session['player_id'] = player_id
    return player_id
