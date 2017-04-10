import React from 'react'

import GameList from './GameList.jsx'

class GameLobby extends React.Component {

    constructor(props) {
        super(props);
        this.state = {isPrivate: false};

        this.handleInputChange = this.handleInputChange.bind(this);
        this.handleNewGame = this.handleNewGame.bind(this);
    }

    getTitle() {
        switch (this.props.game_type) {
            case 'ttt':
                return 'Tic-Tac-Toe';
            case 'reversi':
                return 'Reversi';
            default:
                return 'Chess';
        }
    }

    handleInputChange(event) {
        const target = event.target;
        const name = target.name;
        this.setState({[name]: target.checked});
    }

    handleNewGame(event) {
        return;
    }

    getCSRFToken() {
        if (document.cookie && document.cookie != '') {
            var cookies = document.cookie.split(';');
            for (var i = 0; i < cookies.length; i++) {
                var cookie = cookies[i].trim();
                var name = 'csrftoken';
                if (cookie.substring(0, name.length + 1) == (name + '=')) {
                    return cookie.split('=')[1];
                }
            }
        }

        alert('Missing CSRF token.');
    }

    render() {
        const listsContainerStyle = {
            display: 'flex',
            justifyContent: 'space-around',
        };

        const gameListContainerStyle = {
            width: '40%',
        };

        return (
            <div style={this.props.style}>
                <h2 className='subtitle'>{this.getTitle()}</h2>
                <div style={listsContainerStyle}>
                    <div style={gameListContainerStyle}>
                        <h3>My Games</h3>
                        <GameList games={this.props.games.my_games} />
                    </div>
                    <div style={gameListContainerStyle}>
                        <h3>Open Games</h3>
                        <GameList games={this.props.games.open_games} />
                    </div>
                </div>
                <form 
                    action='/games/new/' 
                    method='post' 
                    onSubmit={this.handleNewGame} 
                    target='_blank'>
                    <input
                        type='hidden'
                        name='csrfmiddlewaretoken'
                        value={this.getCSRFToken()} />
                    <input 
                        type='hidden' 
                        name='gameType' 
                        value={this.props.game_type} />
                    <div style={{marginLeft: '20px'}}>
                        <input
                            type='checkbox'
                            name='isPrivate'
                            checked={this.state.isPrivate}
                            onChange={this.handleInputChange} />
                        <span>private</span>
                        <br />
                        <button 
                            className='my-button new-game-button'
                            type='submit' >
                            Create New Game
                        </button>
                    </div>
                </form>
            </div>
        )
    }

}

export default GameLobby;
