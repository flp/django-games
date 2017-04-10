import React from 'react'

class GameList extends React.Component {

    constructor(props) {
        super(props);
    }

    renderGameLink(game) {
        return (
            <li key={game.game_id}>
                <a href={'game_' + game.game_id.slice(5)} target='_blank'>{game.game_id}</a>
            </li>
        )

    }

    compareGames(game1, game2) {
        const d1 = new Date(game1.created);
        const d2 = new Date(game2.created);
        return d2 - d1;
    }

    render() {
        const style = {
            height: '250px',
            overflowY: 'scroll',
            marginBottom: '10px',
            border: '1px solid black',
        };

        const listStyle = {
        };

        var games = this.props.games.slice();
        games.sort(this.compareGames);
        return (
            <div style={style}>
                <ul style={listStyle}>
                    {games.map(game => (
                        this.renderGameLink(game)
                    ))}
                </ul>
            </div>
        )
    }

}

export default GameList;
