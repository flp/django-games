import json

from channels import Group
from channels.generic.websockets import JsonWebsocketConsumer
from django.utils.timezone import now

from games import sessions
from games.models import ChatEntry, Game, GameLogEntry, Player

class LobbyConsumer(JsonWebsocketConsumer):

    # Need this to get the http_session in messages
    http_user = True

    def connection_groups(self, **kwargs):
        return ['lobby']

    def connect(self, message, **kwargs):
        player_id = sessions.get_player_id(message.http_session)
        message.channel_session['player_id'] = player_id
        print('Player %s connected to lobby' % player_id)
        player = Player.get_by_id(Player.get_model_id(player_id))
        data = Game.get_all_games_list()
        Group('lobby').send({'text': json.dumps(data)})

    def receive(self, content, **kwargs):
        pass

    def disconnect(self, message, **kwargs):
        pass

class GameConsumer(JsonWebsocketConsumer):

    # Need this to get the http_session in messages
    http_user = True

    # Need this to save the player_id to the channel_session
    channel_session_user = True
    
    def connection_groups(self, **kwargs):
        game_id = kwargs['game_id']
        return ['game-%s' % game_id]

    def connect(self, message, **kwargs):
        game_id = kwargs['game_id']
        game = Game.get_by_id(game_id)
        player_id = sessions.get_player_id(message.http_session)
        message.channel_session['player_id'] = player_id

        latest_gle = GameLogEntry.get_latest_gle_for_game(game) 
        
        # Send the full game log to the everyone in the game.
        text = '%s joined the game' % player_id
        entry = GameLogEntry(game=game, text=text)
        entry.save()
        game_log = GameLogEntry.get_game_log_entries_for_game(game)
        serialized_data = GameLogEntry.serialize_entries(game_log)
        opponent = (Player.get_player_id(game.opponent.id) 
                    if (game.opponent is not None) else '')

        player_joined_data = {
            'message_type': 'player_joined',
            'game_log': serialized_data,
            'opponent': opponent,
            'current_turn': Player.get_player_id(game.current_turn.id),
        }
        Group('game-%s' % game_id).send({'text': json.dumps(player_joined_data)})

        # Send the full game data to the client who just connected.
        chat_entries = ChatEntry.get_chat_entries_for_game(game)
        board = json.loads(game.board) if game.board else ''
        extra_state = json.loads(game.extra_state) if game.extra_state else ''
        extra_state
        all_game_data = {
            'message_type': 'full_game',
            'board': board,
            'extra_state': extra_state,
            'opponent': opponent,
            'current_turn': Player.get_player_id(game.current_turn.id),
            'chat': ChatEntry.serialize_entries(chat_entries),
            'completed': Game.serialize_games([game])[0]['completed']
        }
        message.reply_channel.send({'text': json.dumps(all_game_data)})

    def receive(self, content, **kwargs):
        """
        Handle web socket message.

        Can be:
        1) New, valid move received. Add game log entry and update clients.
        or 2) Chat message.
        """
        game_id = kwargs['game_id']
        print('game-%s content: %s' % (game_id, content))
        game = Game.get_by_id(game_id)
        if content['message_type'] == 'new_move':
            # content contains keys 'move', 'board', and 'game_over', 'next_player'
            board_text = json.dumps(content['board'])
            game.board = board_text
            if 'extra_state' in content:
                game.extra_state = json.dumps(content['extra_state'])
            next_player = Player.get_by_id(
                Player.get_model_id(content['next_player']))
            game.current_turn = next_player
            if content['game_over']:
                game.completed = now()
            game.save()

            text = content['move']
            entry = GameLogEntry(game=game, text=text)
            entry.save()
            game_log = GameLogEntry.get_game_log_entries_for_game(game)
            serialized_data = GameLogEntry.serialize_entries(game_log)
            extra_state = json.loads(game.extra_state) if game.extra_state else ''
            data = {
                'message_type': 'new_move',
                'board': json.loads(game.board),
                'extra_state': extra_state,
                'move_text': content['move'],
                'current_turn': Player.get_player_id(game.current_turn.id),
                'game_log': serialized_data,
                'completed': Game.serialize_games([game])[0]['completed'],
            }
            Group('game-%s' % game_id).send({'text': json.dumps(data)})
        elif content['message_type'] == 'chat':
            player_id = content['player']
            player = Player.get_by_id(Player.get_model_id(player_id))
            new_chat_entry = ChatEntry(game=game,
                                       player=player,
                                       text=content['text'])
            new_chat_entry.save()
            chat_entries = ChatEntry.get_chat_entries_for_game(game)
            data = {
                'message_type': 'new_chat',
                'chat': ChatEntry.serialize_entries(chat_entries)
            }
            Group('game-%s' % game_id).send({'text': json.dumps(data)})
        else:
            print('Unknown message_type for %s' % game_id)

    def disconnect(self, message, **kwargs):
        game_id = kwargs['game_id']
        game = Game.get_by_id(game_id)
        player_id = sessions.get_player_id(message.channel_session)
        print('Player %s disconnected from game' % player_id)

        text = '%s disconnected' % player_id
        entry = GameLogEntry(game=game, text=text)
        entry.save()
        game_log = GameLogEntry.get_game_log_entries_for_game(game)
        serialized_data = GameLogEntry.serialize_entries(game_log)

        data = {
            'message_type': 'game_log',
            'game_log': serialized_data
        }
        Group('game-%s' % game_id).send({'text': json.dumps(data)})
