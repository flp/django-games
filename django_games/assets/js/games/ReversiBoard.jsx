import React from 'react'

function Square(props) {
    var colorClass = '';
    if (props.value == 'W') {
        colorClass = 'white-tile';
    } else if (props.value == 'B') {
        colorClass = 'black-tile';
    }

    const className = 'reversi-img-box' + ' ' + colorClass;
    return (
        <div
            className='reversi-square'
            onClick={() => props.onClick() }>
            {/* will be an image eventually*/}
            <div className={className}>
            </div>
        </div>
    );
}

class ReversiBoard extends React.Component {

    constructor(props) {
        super(props);
    }

    getCurrentTurnStatus() {
        if (this.isGameOver()) {
            return 'N/A';
        }

        return (this.props.current_turn == this.props.creator) ? 'Black' : 'White';
    }

    renderSquare(i) {
        return (
            <Square
                key={i}
                value={this.props.board[i]}
                onClick={() => this.handleClick(i)} />
        );
    }

    renderRow(row) {
        var squares = [];
        for (var i = 0; i < 8; i++) {
            squares.push(this.renderSquare(row*8 + i));
        }
        return (
            <div key={row} className='board-row'>
                {squares}
            </div>
        );
    }

    renderRows() {
        var rows = [];
        for (var i = 0; i < 8; i++) {
            rows.push(this.renderRow(i));
        }
        return rows;
    }

    getValue() {
        return (this.props.creator == this.props.current_player) ? 'B' : 'W';
    }

    getOppositeValue() {
        return (this.getValue() == 'W') ? 'B' : 'W';
    }

    getStandardNotation(i) {
        const rows = ['1', '2', '3', '4', '5', '6', '7', '8'];
        const columns = ['a', 'b', 'c', 'd', 'e', 'f', 'g', 'h'];
        const row = rows[Math.floor(i/8)]; 
        const column = columns[i%8];
        return column + row;
    }

    getOppositePlayer() {
        return (this.props.current_player == this.props.creator) ? this.props.opponent : this.props.creator;
    }

    getTilesToFlip(board, i, value) {
        /**
         * For a click on a given square index, get the tiles to flip, if any.
         * 
         */
        var tiles = [];
        var tempTiles = [];
        if (board[i] != '') {
            return tiles;
        }

        function scan(scanIndex) {
            if (scanIndex != i && board[scanIndex] == value) {
                tiles = tiles.concat(tempTiles);
            }
            tempTiles = [];
        }

        const opposite = (value == 'W') ? 'B' : 'W';

        // Check row, going left
        const rowStart = Math.floor(i/8) * 8;
        const rowEnd = rowStart + 7;
        var rowIndex = i - 1;
        while (rowIndex > rowStart && board[rowIndex] == opposite) {
            tempTiles.push(rowIndex);
            rowIndex = rowIndex - 1;
        }
        scan(rowIndex);

        // Check row, going right
        rowIndex = i+1;
        while (rowIndex < rowEnd && board[rowIndex] == opposite) {
            tempTiles.push(rowIndex);
            rowIndex = rowIndex + 1;
        }
        scan(rowIndex);
        
        // Check column, going up
        const colStart = i % 8;
        const colEnd = 56 + colStart;
        var colIndex = i - 8;
        while (colIndex > colStart && board[colIndex] == opposite) {
            tempTiles.push(colIndex);
            colIndex = colIndex - 8;
        }
        scan(colIndex);

        // Check column, going down
        colIndex = i + 8;
        while (colIndex < colEnd && board[colIndex] == opposite) {
            tempTiles.push(colIndex);
            colIndex = colIndex + 8;
        }
        scan(colIndex);

        // Check diagonal, going from top left to bottom right
        const topIndices = [0, 1, 2, 3, 4, 5, 6, 7];
        const leftIndices = [0, 8, 16, 24, 32, 40, 48, 56];
        const bottomIndices = [56, 57, 58, 59, 60, 61, 62, 63];
        const rightIndices = [7, 15, 23, 31, 39, 47, 63];
        const topRightBoundaries = topIndices.concat(rightIndices);
        const topLeftBoundaries = topIndices.concat(leftIndices);
        const bottomRightBoundaries = bottomIndices.concat(rightIndices);
        const bottomLeftBoundaries = bottomIndices.concat(leftIndices);
        var index = i + 9;
        if (!bottomRightBoundaries.includes(i)) {
            while (!bottomRightBoundaries.includes(index) && board[index] == opposite) {
                tempTiles.push(index);
                index = index + 9;
            }
        }
        scan(index);

        // Check diagonal, going from top right to bottom left
        index = i + 7;
        if (!bottomLeftBoundaries.includes(i)) {
            while (!bottomLeftBoundaries.includes(index) && board[index] == opposite) {
                tempTiles.push(index);
                index = index + 7;
            }
        }
        scan(index);

        // Check diagonal, going from bottom left to top right
        index = i - 7;
        if (!topRightBoundaries.includes(i)) {
            while (!topRightBoundaries.includes(index) && board[index] == opposite) {
                tempTiles.push(index);
                index = index - 7;
            }
        }
        scan(index);

        // Check diagonal, going from bottom right to top left
        index = i - 9;
        if (!topLeftBoundaries.includes(i)) {
            while (!topLeftBoundaries.includes(index) && board[index] == opposite) {
                tempTiles.push(index);
                index = index - 9;
            }
        }
        scan(index);

        return tiles;
    }

    hasLegalMove(board, value) {
        /**
         * Does player with given value have any legal moves left?
         */
        if (!board.includes('')) {
            return false;
        }

        for (var i = 0; i < board.length; i++) {
            if (this.getTilesToFlip(board, i, value).length > 0) {
                return true;
            }
        }

        return false;
    }

    isMyTurn() {
        return this.props.current_turn == this.props.current_player;
    }

    otherPlayerIsReady() {
        return this.props.opponent != '';
    }

    getScore(value) {
        return this.props.board.filter(x => x == value).length
    }

    getGameStatus() {
        const BScore = this.getScore('B');
        const WScore = this.getScore('W');
        var str = 'B: ' + BScore + ' W: ' + WScore;
        if (this.isGameOver()) {
            var winningValue = null;
            if (BScore > WScore) {
                winningValue = 'B';
            } else if (WScore > BScore) {
                winningValue = 'W';
            }

            var winner = null;
            if (winningValue == this.getValue()) {
                winner = this.props.current_player;
            } else if (winningValue == this.getOppositeValue()) {
                winner = this.getOppositePlayer();
            }

            const winnerStr = (winner != null) ? ('Player ' + winner + ' wins!') : 'Tie game!';
            str = str + ' ' + winnerStr;
        }

        return str;
    }

    isGameOver() {
        return this.props.completed != null;
    }

    handleClick(i) {
        if (this.otherPlayerIsReady() && this.isMyTurn() && !this.isGameOver()) {
            const tiles = this.getTilesToFlip(this.props.board, i, this.getValue());
            if (tiles.length == 0) {
                return;
            }

            var newBoard = this.props.board.slice();
            for (let i = 0; i < tiles.length; i++) {
                newBoard[tiles[i]] = this.getValue();
            }
            newBoard[i] = this.getValue();

            var nextPlayer = this.props.current_player;
            var gameOver = false;
            if (this.hasLegalMove(newBoard, this.getOppositeValue())) {
                nextPlayer = this.getOppositePlayer();
            } else if (this.hasLegalMove(newBoard, this.getValue())) {
                nextPlayer = this.props.current_player;
            } else {
                gameOver = true;
            }

            const moveText = this.props.current_player + ' placed ' + this.getValue() + ' at ' + this.getStandardNotation(i);
            var data = {
                'message_type': 'new_move',
                'move': moveText,
                'board': newBoard,
                'next_player': nextPlayer,
                'game_over': gameOver
            }
            this.props.ws.state.ws.send(JSON.stringify(data));
        }
    }

    render() {
        const turnClassName = (this.isMyTurn() && !this.isGameOver()) ? 'current-turn-indicator' : '';
        return (
            <div className='board-area'>
                <div className='player-turn-status-area'>
                    <div>
                        Black: {this.props.creator}<br />
                        White: {(this.props.opponent == '') ? 'N/A' : this.props.opponent}<br />
                    </div>
                    <div className='current-turn-area'>
                        Current turn: <span className={turnClassName}>{this.getCurrentTurnStatus()}</span>
                    </div>
                </div>
                <div className='reversi-board'>
                    {this.renderRows()}
                </div>
                <div>
                    {this.getGameStatus()}
                </div>
            </div>
        );
    }

}

// add proptypes?

export default ReversiBoard;
