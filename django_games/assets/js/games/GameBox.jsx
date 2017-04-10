import React from 'react'
import Websocket from 'react-websocket'

import ChatArea from './ChatArea.jsx'
import ChessBoard from './ChessBoard.jsx'
import GameLogArea from './GameLogArea.jsx'
import ReversiBoard from './ReversiBoard.jsx'
import TTTBoard from './TTTBoard.jsx'

class GameBox extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            'board': this.getEmptyBoard(),
            'chat': [],
            'log': [],
            'creator': this.props.game_creator,
            'current_turn': this.props.game_creator,
            'opponent': '',
            'completed': null,
            'extra_state': this.getEmptyExtraState()
        };

        this.handleMessage = this.handleMessage.bind(this);
    }

    getEmptyBoard() {
        switch (this.props.gameType) {
            case 'ttt':
                var board = [];
                for (var i = 0; i < 9; i++) {
                    board.push('');
                }
                return board;
            case 'reversi':
                var board = [];
                for (var i = 0; i < 64; i++) {
                    board.push('');
                }
                board[27] = 'W';
                board[28] = 'B';
                board[35] = 'B';
                board[36] = 'W';

                return board; 
            default:
                // chess
                var board = [
                    'BR', 'BN', 'BB', 'BQ', 'BK', 'BB', 'BN', 'BR',
                    'BP', 'BP', 'BP', 'BP', 'BP', 'BP', 'BP', 'BP',
                    '', '', '', '', '', '', '', '',
                    '', '', '', '', '', '', '', '',
                    '', '', '', '', '', '', '', '',
                    '', '', '', '', '', '', '', '',
                    'WP', 'WP', 'WP', 'WP', 'WP', 'WP', 'WP', 'WP',
                    'WR', 'WN', 'WB', 'WQ', 'WK', 'WB', 'WN', 'WR',
                ];

                return board;
        }
    }

    getEmptyExtraState() {
        // this is only used for chess currently
        if (this.props.gameType == 'chess') {
            return {
                blackQueenRookHasMoved: false,
                blackKingRookHasMoved: false,
                blackKingHasMoved: false,
                whiteQueenRookHasMoved: false,
                whiteKingRookHasMoved: false,
                whiteKingHasMoved: false,
                enPassantVictim: -1
            }
        } else {
            return {}
        }
    }

    getTitle() {
        switch (this.props.gameType) {
            case 'ttt':
                return 'Tic-Tac-Toe';
            case 'reversi':
                return 'Reversi';
            default:
                return 'Chess';

        }
    }

    renderGameBoard() {
        switch (this.props.gameType) {
            case 'ttt':
                return (
                    <TTTBoard
                        ws={this.refs.ws}
                        board={this.state.board} 
                        creator={this.state.creator}
                        current_turn={this.state.current_turn} 
                        current_player={this.props.current_player} 
                        opponent={this.state.opponent} 
                        gameStatus={this.state.gameStatus} />
                );
            case 'reversi':
                return (
                    <ReversiBoard
                        ws={this.refs.ws}
                        board={this.state.board}
                        creator={this.state.creator}
                        current_turn={this.state.current_turn} 
                        current_player={this.props.current_player} 
                        opponent={this.state.opponent} 
                        gameStatus={this.state.gameStatus} 
                        completed={this.state.completed} />
                );
            default:
                return (
                    <ChessBoard
                        ws={this.refs.ws}
                        board={this.state.board} 
                        white={this.state.creator}
                        black={this.state.opponent}
                        current_player={this.props.current_player}
                        current_turn={this.state.current_turn}
                        completed={this.state.completed} 
                        extra_state={this.state.extra_state} />
                );
        }
    }

    handleMessage(message) {
        const data = JSON.parse(message);
        if (data['message_type'] == 'game_log') {
            this.setState({
                'log': data['game_log']
            });
        } else if (data['message_type'] == 'new_move') {
            this.setState({
                'board': data['board'],
                'extra_state': data['extra_state'],
                'current_turn': data['current_turn'],
                'log': data['game_log'],
                'completed': data['completed']
            });
        } else if (data['message_type'] == 'full_game') {
            // We could get an empty board and extra_state from the server
            var board = (data['board'] == '') ? this.getEmptyBoard() : data['board'];
            var extraState = (data['extra_state'] == '') ? this.getEmptyExtraState() : data['extra_state'];
            this.setState({
                'board': board,
                'extra_state': extraState,
                'opponent': data['opponent'],
                'current_turn': data['current_turn'],
                'chat': data['chat'],
                'completed': data['completed']
            });
        } else if (data['message_type'] == 'player_joined') {
            this.setState({
                'opponent': data['opponent'],
                'current_turn': data['current_turn'],
                'log': data['game_log']
            });
        } else if (data['message_type'] == 'new_chat') {
            // New chat message
            this.setState({
                'chat': data['chat']
            });
        } else {
            return;
        }
    }

    render() {
        return (
            <div>
                <h1 className='title'>{this.getTitle()}</h1>
                <h3 className='subtitle'>Your ID: <span className='your-id'>{this.props.current_player}</span></h3>
                <div className='game-area'>
                    {this.renderGameBoard()}
                    <ChatArea 
                        ws={this.refs.ws}
                        chat={this.state.chat}
                        current_player={this.props.current_player} />
                    <GameLogArea log={this.state.log} />
                </div>
                <Websocket 
                    ref='ws'
                    url={this.props.ws_url}
                    onMessage={this.handleMessage} />
            </div>
        );
    }

}

export default GameBox;
