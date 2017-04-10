import json

from channels import Group
from django.http import HttpResponse, HttpResponseRedirect
from django.shortcuts import get_object_or_404, render
from django.urls import reverse
from django.views.decorators.http import require_http_methods

from games import sessions
from games.models import Game, GameLogEntry, Player

def index(request):
    """
    Renders the main lobby page.

    Cookie might not have player_id yet.
    """
    player_id = sessions.get_or_create_player_id(request.session)
    print('player_id: ', player_id)
    return render(request, 'games/index.html')

def current_player(request):
    """
    Respond with the player_id in the request session - this is very strange.

    It's necessary because Django defaults to HttpOnly cookies for security
    reasons, meaning the cookie data cannot be accessed by JavaScript.
    """
    player_id = sessions.get_player_id(request.session)
    return HttpResponse(player_id)

def game_creator(request, game_id):
    """
    Respond with the game creator's player_id.
    """
    game = get_object_or_404(Game, pk=int(game_id))
    player_id = Player.get_player_id(game.creator.id)
    return HttpResponse(player_id)

@require_http_methods(['POST'])
def new_game(request):
    """
    Creates a new game.

    player_id should already be stored inside cookie.
    """
    private = (request.POST['isPrivate'] == 'on' if 'isPrivate' in request.POST
               else False)
    game_type = request.POST['gameType']
    player_id = sessions.get_player_id(request.session)
    player = Player.get_by_id(Player.get_model_id(player_id))
    game = Game(game_type=game_type,
                creator=player,
                private=private,
                current_turn=player)
    game.save()
    game_id = Game.get_game_id(game.id)
    game.game_id = game_id
    game.save()
    text = 'Game created'
    entry = GameLogEntry(game=game, text=text)
    entry.save()

    # Send a ws message to the lobby group
    Group('lobby').send({'text': json.dumps(Game.get_all_games_list())})

    return HttpResponseRedirect(reverse('games:game', args=(game.id,)))

def game(request, game_id):
    """
    Tries to send the user to a game.

    Cookie might not have player_id yet.
    """
    bots = ['facebookexternal', 'whatsapp']
    for bot in bots:
        if bot in request.META['HTTP_USER_AGENT'].lower():
            return HttpResponse('Hello bot')

    game = get_object_or_404(Game, pk=int(game_id))
    player_id = sessions.get_or_create_player_id(request.session)
    player = Player.get_by_id(Player.get_model_id(player_id))

    if game.game_type == 'ttt':
        template = 'games/ttt.html'
    elif game.game_type == 'reversi':
        template = 'games/reversi.html'
    else:
        template = 'games/chess.html'

    if game.creator == player or game.opponent == player:
        print('Game creator or opponent is (re)joining game.')
        return render(request,
                      template,
                      {'player_id': player_id, 'game_id': game_id})
    elif game.opponent is None:
        print('New player is joining game')
        game.opponent = player
        game.save()

        # Send a ws message to the lobby group
        Group('lobby').send({'text': json.dumps(Game.get_all_games_list())})

        return render(request,
                      template,
                      {'player_id': player_id, 'game_id': game_id})
    else:
        return HttpResponse('Sorry, player %s, but game %s is full'
                            % (player_id, game_id))
