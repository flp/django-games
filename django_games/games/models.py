import json

from django.core import serializers
from django.db import models

class Player(models.Model):
    player_id = models.CharField(max_length=100, null=True, blank=True)
    created = models.DateTimeField(auto_now_add=True)

    @staticmethod
    def get_player_id(model_id):
        player_id = 'player-%s' % model_id
        return player_id

    @staticmethod
    def get_model_id(player_id):
        model_id = player_id[7:]
        return model_id

    @staticmethod
    def get_by_id(id):
        return Player.objects.get(pk=id)

class Game(models.Model):
    game_id = models.CharField(max_length=100, null=True, blank=True)
    game_type = models.CharField(max_length=10)
    creator = models.ForeignKey(Player, related_name='creator')
    opponent = models.ForeignKey(
        Player, related_name='opponent', null=True, blank=True)
    private = models.BooleanField()
    created = models.DateTimeField(auto_now_add=True)
    completed = models.DateTimeField(null=True, blank=True)
    board = models.CharField(max_length=1000, blank=True)
    extra_state = models.CharField(max_length=1000, blank=True)
    current_turn = models.ForeignKey(Player, related_name='current_turn')

    @staticmethod
    def get_by_id(id):
        return Game.objects.get(pk=id)

    @staticmethod
    def get_game_id(model_id):
        game_id = 'game-%s' % model_id
        return game_id

    @staticmethod
    def get_model_id(game_id):
        model_id = game_id[5:]
        return model_id

    @staticmethod
    def get_all_games_list():
        return Game.serialize_games(Game.objects.all())

    @staticmethod
    def get_games_for_player(player):
        # why is this import here?
        from django.db.models import Q
        return Game.objects.filter(Q(opponent=player) | Q(creator=player))

    @staticmethod
    def get_open_games():
        return Game.objects.filter(opponent=None, completed=None)

    @staticmethod
    def get_open_games_dict():
        data = {
            'ttt': {
                'my_games': [],
                'open_games': [],
            },
            'reversi': {
                'my_games': [],
                'open_games': [],
            },
            'chess': {
                'my_games': [],
                'open_games': [],
            },
        }

        for game in Game.serialize_games(Game.get_open_games()):
            if game['game_type'] == 'ttt':
                data['ttt']['open_games'].append(game)
            elif game['game_type'] == 'reversi':
                data['reversi']['open_games'].append(game)
            else:
                data['chess']['open_games'].append(game)

        return data

    @staticmethod
    def get_player_and_open_games_dict(player):
        data = {
            'ttt': {
                'my_games': [],
                'open_games': [],
            },
            'reversi': {
                'my_games': [],
                'open_games': [],
            },
            'chess': {
                'my_games': [],
                'open_games': [],
            },
        }

        for game in Game.serialize_games(Game.get_games_for_player(player)):
            if game['game_type'] == 'ttt':
                data['ttt']['my_games'].append(game)
            elif game['game_type'] == 'reversi':
                data['reversi']['my_games'].append(game)
            else:
                data['chess']['my_games'].append(game)
        for game in Game.serialize_games(Game.get_open_games()):
            if game['game_type'] == 'ttt':
                data['ttt']['open_games'].append(game)
            elif game['game_type'] == 'reversi':
                data['reversi']['open_games'].append(game)
            else:
                data['chess']['open_games'].append(game)

        return data

    @staticmethod
    def serialize_games(games):
        """
        Serialize games into JSON-ready dicts.
        """
        fields = ('game_id', 'game_type', 'private', 'created', 'completed',
                  'creator', 'opponent', 'board', 'extra_state', 'current_turn')
        data = json.loads(serializers.serialize('json', games, fields=fields))
        output = list(map(lambda x: x['fields'], data))
        return output

class ChatEntry(models.Model):
    game = models.ForeignKey(Game)
    player = models.ForeignKey(Player)
    text = models.CharField(max_length=400)
    created = models.DateTimeField(auto_now_add=True)

    @staticmethod
    def get_chat_entries_for_game(game):
        return ChatEntry.objects.filter(game=game)

    @staticmethod
    def serialize_entries(entries):
        """
        Serialize chat entries into JSON-ready dicts.
        """
        fields = ('player', 'text', 'created')
        data = json.loads(serializers.serialize('json', entries, fields=fields))
        output = []
        for d in data:
            x = d['fields']
            x['id'] = d['pk']
            output.append(x)
        return output

class GameLogEntry(models.Model):
    game = models.ForeignKey(Game)
    text = models.CharField(max_length=200)
    created = models.DateTimeField(auto_now_add=True)

    @staticmethod
    def get_game_log_entries_for_game(game):
        return GameLogEntry.objects.filter(game=game)

    @staticmethod
    def get_latest_gle_for_game(game):
        gles = sorted(GameLogEntry.objects.filter(game=game),
                      key=lambda gle: -1 * gle.id)
        return gles[:1]

    @staticmethod
    def serialize_entries(entries):
        """
        Serialize game log entries into JSON-ready dicts.
        """
        fields = ('text', 'created')
        data = json.loads(serializers.serialize('json', entries, fields=fields))
        output = []
        for d in data:
            x = d['fields']
            x['id'] = d['pk']
            output.append(x)
        return output
