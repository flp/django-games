import React from 'react'
import Websocket from 'react-websocket'

import GameLobby from './GameLobby.jsx'

class MainLobby extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            'ttt': {
                'my_games': [],
                'open_games': []
            },
            'reversi': {
                'my_games': [],
                'open_games': []
            },
            'chess': {
                'my_games': [],
                'open_games': []
            },
        };

        this.handleMessage = this.handleMessage.bind(this);
    }

    handleMessage(data) {
        const jsonData = JSON.parse(data);
        var data = {
            'ttt': {
                'my_games': [],
                'open_games': []
            },
            'reversi': {
                'my_games': [],
                'open_games': []
            },
            'chess': {
                'my_games': [],
                'open_games': []
            },
        };
        for (var i=0; i < jsonData.length; i++) {
            var game = jsonData[i];
            var gameType = game.game_type;
            var isMyGame = ('player-' + game.creator == this.props.current_player) || ('player-' + game.opponent == this.props.current_player);
            var isOpenGame = !isMyGame && !game.private && !game.completed && game.opponent == null;
            if (isMyGame) {
                data[gameType]['my_games'].push(game);
            } else if (isOpenGame) {
                data[gameType]['open_games'].push(game);
            }
        }

        this.setState({
            'ttt': data['ttt'],
            'reversi': data['reversi'],
            'chess': data['chess']
        });
    }

    render() {
        const lobbyContainerStyle = {
            display: 'flex',
            flexWrap: 'wrap',
            justifyContent: 'center',
        };
        const lobbyStyle = {
            width: '352px',
            marginLeft: '10px',
            marginRight: '10px',
            marginBottom: '20px',
            border: '2px solid black',
        };

        return (
            <div>
                <h1 className='title'>DJANGO GAMES</h1>
                <p className='subtitle'>Your ID: {this.props.current_player}</p>
                <Websocket 
                    url={this.props.ws_url}
                    onMessage={this.handleMessage} />
                <div style={lobbyContainerStyle}>
                    <GameLobby 
                        style={lobbyStyle}
                        game_type='ttt'
                        current_player={this.props.current_player} 
                        games={this.state.ttt} />
                    <GameLobby 
                        style={lobbyStyle}
                        game_type='reversi' 
                        current_player={this.props.current_player} 
                        games={this.state.reversi} />
                    <GameLobby 
                        style={lobbyStyle}
                        game_type='chess' 
                        current_player={this.props.current_player} 
                        games={this.state.chess} />
                </div>
            </div>
        )
    }
}

export default MainLobby;
