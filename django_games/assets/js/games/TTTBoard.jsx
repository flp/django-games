import React from 'react'

function Square(props) {
    return (
        <button 
            className='ttt-square' 
            onClick={() => props.onClick() }>
            {props.value}
        </button>
    );
}

class TTTBoard extends React.Component {

    constructor(props) {
        super(props);
    }

    renderSquare(i) {
        return (
            <Square
                value={this.props.board[i]}
                onClick={() => this.handleClick(i)} />
        );
    }

    getCurrentTurnStatus() {
        const winner = this.winner(this.props.board);
        if (winner != null || this.isTieGame(this.props.board)) {
            // Game is over.
            return 'N/A';
        }

        return (this.props.current_turn == this.props.creator) ? 'X' : 'O';
    }

    getValue() {
        return (this.props.creator == this.props.current_turn) ? 'X' : 'O';
    }

    isMyTurn() {
        return this.props.current_turn == this.props.current_player;
    }

    isLegalMove(i) {
        return this.props.board[i] == '';
    }

    otherPlayerIsReady() {
        return this.props.opponent != '';
    }

    isGameOver(board) {
        return this.winner(board) != null;
    }

    isTieGame(board) {
        for (const value of board) {
            if (value == "") {
                return false;
            }
        }
        return true;
    }

    winner(board) {
        // Check rows
        if (board[0] != '' && board[0] == board[1] && board[1] == board[2]) {
            return board[0];
        } else if (board[3] != '' && board[3] == board[4] && board[4] == board[5]) {
            return board[3];
        } else if (board[6] != '' && board[6] == board[7] && board[7] == board[8]) {
            return board[6];
        }

        // Check columns
        if (board[0] != '' && board[0] == board[3] && board[3] == board[6]) {
            return board[0];
        } else if (board[1] != '' && board[1] == board[4] && board[4] == board[7]) {
            return board[1]
        } else if (board[2] != '' && board[2] == board[5] && board[5] == board[8]) {
            return board[2];
        }

        // Check diagonals
        if (board[0] != '' && board[0] == board[4] && board[4] == board[8]) {
            return board[0];
        } else if (board[2] != '' && board[2] == board[4] && board[4] == board[6]) {
            return board[2];
        }

        return null;
    }

    getGameStatus() {
        const winner = this.winner(this.props.board);
        if (winner != null) {
            return 'Player ' + winner + ' wins!';
        } else if (this.isTieGame(this.props.board)) {
            return 'Tie game!';
        }

        return '';
    }

    handleClick(i) {
        if (this.otherPlayerIsReady() && this.isMyTurn() && !this.isGameOver(this.props.board) && this.isLegalMove(i)) {
            var newBoard = this.props.board.slice();
            newBoard[i] = this.getValue();
            var nextPlayer = (this.props.current_player == this.props.creator) ? this.props.opponent : this.props.creator;
            const moveText = this.props.current_player + ' placed ' + this.getValue() + ' at ' + i;
            var data = {
                'message_type': 'new_move',
                'move': moveText,
                'board': newBoard,
                'next_player': nextPlayer,
                'game_over': this.isGameOver(newBoard) 
            }
            this.props.ws.state.ws.send(JSON.stringify(data));
        }
    }

    render() {
        const turnClassName = (this.isMyTurn() && !this.isGameOver(this.props.board) && !this.isTieGame(this.props.board)) ? 'current-turn-indicator' : '';
        return (
            <div className='board-area'>
                <div className='player-turn-status-area'>
                    <div>
                        X: {this.props.creator}<br />
                        O: {(this.props.opponent == '') ? 'N/A' : this.props.opponent}<br />
                    </div>
                    <div className='current-turn-area'>
                        Current turn: <span className={turnClassName}>{this.getCurrentTurnStatus()}</span>
                    </div>
                </div>
                <div className='ttt-board'>
                    <div className='board-row'>
                        {this.renderSquare(0)}
                        {this.renderSquare(1)}
                        {this.renderSquare(2)}
                    </div>
                    <div className='board-row'>
                        {this.renderSquare(3)}
                        {this.renderSquare(4)}
                        {this.renderSquare(5)}
                    </div>
                    <div className='board-row'>
                        {this.renderSquare(6)}
                        {this.renderSquare(7)}
                        {this.renderSquare(8)}
                    </div>
                </div>
                <div>
                    {this.getGameStatus()}
                </div>
            </div>
        );
    }

}

export default TTTBoard;
