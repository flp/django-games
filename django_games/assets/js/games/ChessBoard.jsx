import React from 'react'
import ReactModal from 'react-modal';

const BLACK = 100
const WHITE = 200

class Piece {

    constructor(color, position, isKing, isRook, isPawn) {
        this.color = color;
        this.position = position;
        this.isKing = isKing;
        this.isRook = isRook;
        this.isPawn = isPawn;
    }

    static checkBoardPositions(position, board, color, increment, boundary) {
        var index = position + increment;
        var result = [];

        if (increment > 0) {
            while (index <= boundary && board[index] == null) {
                result.push(index);
                index = index + increment;
            }
            if (index <= boundary && board[index] != null && board[index].color != this.color) {
                result.push(index);
            }
        } else {
            while (index >= boundary && board[index] == null) {
                result.push(index);
                index = index + increment;
            }
            if (index >= boundary && board[index] != null && board[index].color != this.color) {
                result.push(index);
            }
        }

        return result;
    }

}

class Pawn extends Piece {
    getPossibleMoves(board) {
        var moves = [];
        if (this.color == BLACK) {
            if (board[this.position + 8] == null) {
                moves.push(this.position + 8);
            }

            if (this.position >= 8 && this.position <= 15 && board[this.position + 8] == null && board[this.position + 16] == null) {
                moves.push(this.position + 16);
            }

            var diagonals = [];
            if ([8, 16, 24, 32, 40, 48].includes(this.position)) {
                diagonals.push(this.position + 9);
            } else if ([15, 23, 31, 39, 47, 55].includes(this.position)) {
                diagonals.push(this.position + 7);
            } else {
                diagonals.push(this.position + 9);
                diagonals.push(this.position + 7);
            }
            diagonals = diagonals.filter((i) => board[i] != null && board[i].color == WHITE);
            moves = moves.concat(diagonals);

        } else {
            if (board[this.position - 8] == null) {
                moves.push(this.position - 8);
            }

            if (this.position >= 48 && this.position <= 55 && board[this.position - 8] == null && board[this.position - 16] == null) {
                moves.push(this.position - 16);
            }

            var diagonals = [];
            if ([8, 16, 24, 32, 40, 48].includes(this.position)) {
                diagonals.push(this.position - 7);
            } else if ([15, 23, 31, 39, 47, 55].includes(this.position)) {
                diagonals.push(this.position - 9);
            } else {
                diagonals.push(this.position - 7);
                diagonals.push(this.position - 9);
            }
            diagonals = diagonals.filter((i) => board[i] != null && board[i].color == BLACK);
            moves = moves.concat(diagonals);
        }
        return moves;
    }

    toString() {
        return '';
    }
}

class Rook extends Piece {
    getPossibleMoves(board) {
        // every position to the right, to the left, above, and below
        var moves = [];

        // check right
        var boundary = this.position - this.position % 8 + 7;
        moves = moves.concat(Piece.checkBoardPositions(this.position, board, this.color, 1, boundary));

        // check left
        boundary = this.position - this.position % 8;
        moves = moves.concat(Piece.checkBoardPositions(this.position, board, this.color, -1, boundary)); 

        // check above
        boundary = this.position % 8;
        moves = moves.concat(Piece.checkBoardPositions(this.position, board, this.color, -8, boundary));

        // check below
        boundary = this.position % 8 + 56;
        moves = moves.concat(Piece.checkBoardPositions(this.position, board, this.color, 8, boundary));

        return moves;
    }

    toString() {
        return 'R';
    }
}

class Knight extends Piece {
    getPossibleMoves(board) {
        /**
         * The different moves for a knight are:
         * - up 2 right 1
         * - up 1 right 2
         * - right 2 down 1
         * - right 1 down 2
         * - down 2 left 1
         * - down 1 left 2
         * - left 2 up 1
         * - left 1 up 2
         */
        const U2R1 = -15;
        const U1R2 = -6;
        const R2D1 = 10;
        const R1D2 = 17;
        const D2L1 = 15;
        const D1L2 = 6;
        const L2U1 = -10;
        const L1U2 = -17;
        const allDirections = [U2R1, U1R2, R2D1, R1D2, D2L1, D1L2, L2U1, L1U2];
        const middleTopDirections = [R2D1, R1D2, D2L1, D1L2];
        const middleTopMinusOneDirections = middleTopDirections.concat([U1R2, L2U1]);
        const middleBottomDirections = [U2R1, U1R2, L2U1, L1U2];
        const middleBottomPlusOneDirections = middleBottomDirections.concat([R2D1, D1L2]);
        const noRestrictionPositions = [
            18, 19, 20, 21,
            26, 27, 28, 29,
            34, 35, 36, 37,
            42, 43, 44, 45
        ];
        const middleTopPositions = [2, 3, 4, 5];
        const middleTopMinusOnePositions = [10, 11, 12, 13];
        const middleBottomPositions = [58, 59, 60, 61];
        const middleBottomPlusOnePositions = [50, 51, 52, 53];

        const moveDirectionMap = {
            0: [R2D1, R1D2],
            1: [R2D1, R1D2, D2L1],
            8: [U1R2, R2D1, R1D2],
            9: [U1R2, R2D1, R1D2, D2L1],
            16: [U1R2, U2R1, R2D1, R1D2],
            17: [U1R2, U2R1, R2D1, R1D2, D2L1, L1U2],
            24: [U1R2, U2R1, R2D1, R1D2],
            25: [U1R2, U2R1, R2D1, R1D2, D2L1, L1U2],
            32: [U1R2, U2R1, R2D1, R1D2],
            33: [U1R2, U2R1, R2D1, R1D2, D2L1, L1U2],
            40: [U1R2, U2R1, R2D1, R1D2],
            41: [U1R2, U2R1, R2D1, R1D2, D2L1, L1U2],
            48: [U1R2, U2R1, R2D1],
            49: [U1R2, U2R1, R2D1, L1U2],
            56: [U1R2, U2R1],
            57: [U1R2, U2R1, L1U2],
            6: [D2L1, D1L2, R1D2],
            7: [D2L1, D1L2],
            14: [D2L1, D1L2, R1D2, L2U1],
            15: [D2L1, D1L2, L2U1],
            22: [D2L1, D1L2, R1D2, L2U1, L1U2, U2R1],
            23: [D2L1, D1L2, L2U1, L1U2],
            30: [D2L1, D1L2, R1D2, L2U1, L1U2, U2R1],
            31: [D2L1, D1L2, L2U1, L1U2],
            38: [D2L1, D1L2, R1D2, L2U1, L1U2, U2R1],
            39: [D2L1, D1L2, L2U1, L1U2],
            46: [D2L1, D1L2, R1D2, L2U1, L1U2, U2R1],
            47: [D2L1, D1L2, L2U1, L1U2],
            54: [D1L2, L2U1, L1U2, U2R1],
            55: [D1L2, L2U1, L1U2],
            62: [L2U1, L1U2, U2R1],
            63: [L2U1, L1U2]
        }
        
        if (noRestrictionPositions.includes(this.position)) {
            return allDirections.map((direction) => this.position + direction);
        } else if (middleTopPositions.includes(this.position)) {
            return middleTopDirections.map((direction) => this.position + direction);
        } else if (middleTopMinusOnePositions.includes(this.position)) {
            return middleTopMinusOneDirections.map((direction) => this.position + direction);
        } else if (middleBottomPositions.includes(this.position)) {
            return middleBottomDirections.map((direction) => this.position + direction);
        } else if (middleBottomPlusOnePositions.includes(this.position)) {
            return middleBottomPlusOneDirections.map((direction) => this.position + direction);
        } else {
            return moveDirectionMap[this.position].map((direction) => this.position + direction);
        }
    }

    toString() {
        return 'N';
    }
}

class Bishop extends Piece {
    getPossibleMoves(board) {
        var moves = [];

        // check top-right direction
        const topRightBoundaries = [0, 1, 2, 3, 4, 5, 6, 7, 15, 23, 31, 39, 47, 55, 63];
        var boundary = this.position;
        while (!topRightBoundaries.includes(boundary)) {
            boundary = boundary - 7;
        }
        moves = moves.concat(Piece.checkBoardPositions(this.position, board, this.color, -7, boundary)); 

        // check top-left direction
        const topLeftBoundaries = [56, 48, 40, 32, 24, 16, 8, 0, 1, 2, 3, 4, 5, 6, 7];
        boundary = this.position;
        while (!topLeftBoundaries.includes(boundary)) {
            boundary = boundary - 9;
        }
        moves = moves.concat(Piece.checkBoardPositions(this.position, board, this.color, -9, boundary)); 

        // check bottom-right direction
        const bottomRightBoundaries = [56, 57, 58, 59, 60, 61, 62, 63, 55, 47, 39, 31, 23, 15 ,7];
        boundary = this.position;
        while (!bottomRightBoundaries.includes(boundary)) {
            boundary = boundary + 9;
        }
        moves = moves.concat(Piece.checkBoardPositions(this.position, board, this.color, 9, boundary)); 

        // check bottom-left direction
        const bottomLeftBoundaries = [0, 8, 16, 24, 32, 40, 48, 56, 57, 58, 59, 60, 61, 62, 63];
        boundary = this.position;
        while (!bottomLeftBoundaries.includes(boundary)) {
            boundary = boundary + 7;
        }
        moves = moves.concat(Piece.checkBoardPositions(this.position, board, this.color, 7, boundary)); 

        return moves;
    }

    toString() {
        return 'B';
    }
}

class Queen extends Piece {
    getPossibleMoves(board) {
        // combination of a bishop and a rook
        const rook = new Rook(this.color, this.position, false, true, false);
        const bishop = new Bishop(this.color, this.position, false, false, false);
        return rook.getPossibleMoves(board).concat(bishop.getPossibleMoves(board));
    }

    toString() {
        return 'Q';
    }
}

class King extends Piece {
    getPossibleMoves(board) {
        var getMiddleMoves = function (n) { return [n-8, n-7, n+1, n+9, n+8, n+7, n-1, n-9]; };
        var getTopMoves = function(n) { return [n-1, n+7, n+8, n+9, n+1] };
        var getRightMoves = function(n) { return [n-8, n-9, n-1, n+7, n+8] };
        var getBottomMoves = function(n) { return [n-1, n-9, n-8, n-7, n+1] };
        var getLeftMoves = function(n) { return [n-8, n-7, n+1, n+9, n+8] };
        const moveMap = {
            0: [1, 8, 9],
            1: getTopMoves(1),
            2: getTopMoves(2),
            3: getTopMoves(3),
            4: getTopMoves(4),
            5: getTopMoves(5),
            6: getTopMoves(6),
            7: [6, 14, 15],
            15: getRightMoves(15),
            23: getRightMoves(23),
            31: getRightMoves(31),
            39: getRightMoves(39),
            47: getRightMoves(47),
            55: getRightMoves(55),
            63: [62, 54, 55],
            62: getBottomMoves(62),
            61: getBottomMoves(61),
            60: getBottomMoves(60),
            59: getBottomMoves(59),
            58: getBottomMoves(58),
            57: getBottomMoves(57),
            56: [48, 49, 57],
            48: getLeftMoves(48),
            40: getLeftMoves(40),
            32: getLeftMoves(32),
            24: getLeftMoves(24),
            16: getLeftMoves(16),
            8: getLeftMoves(8)
        }

        if (moveMap[this.position] != undefined) {
            return moveMap[this.position];
        } else {
            return getMiddleMoves(this.position);
        }
    }

    toString() {
        return 'K';
    }
}

class ChessGame {
    constructor(
        strsBoard, blackQueenRookHasMoved, blackKingRookHasMoved, blackKingHasMoved,
        whiteQueenRookHasMoved, whiteKingRookHasMoved, whiteKingHasMoved, enPassantVictim
    ) {
        // strsBoard is a 64 element array of strings
        // WP is a white pawn
        // BR is a black rook
        // empty string is an empty square
        // this.board is comprised of objects
        // an empty square gets null
        this.board = [];
        this.blackQueenRookHasMoved = blackQueenRookHasMoved;
        this.blackKingRookHasMoved = blackKingRookHasMoved;
        this.blackKingHasMoved = blackKingHasMoved;
        this.whiteQueenRookHasMoved = whiteQueenRookHasMoved;
        this.whiteKingRookHasMoved = whiteKingRookHasMoved;
        this.whiteKingHasMoved = whiteKingHasMoved;
        this.enPassantVictim = enPassantVictim;
        for (var i = 0; i < strsBoard.length; i++) {
            if (strsBoard[i] == '') {
                this.board.push(null);
            } else {
                this.board.push(ChessGame.getPieceForString(strsBoard[i], i));
            }
        }
    }

    getPieceAtSquare(i) {
        return this.board[i];
    }

    getPossibleMovesForPiece(piece) {
        var moves = piece.getPossibleMoves(this.board);

        // filter for moves that are into empty space or into a square occupied by an enemy piece
        moves = moves.filter((i) => this.board[i] == null || this.board[i].color != piece.color);

        const originalBoard = this.board.slice();
        // filter out moves that would put the king in check
        moves = moves.filter((i) => {
            var newBoard = this.board.slice();
            newBoard[piece.position] = null;
            newBoard[i] = piece;
            this.board = newBoard;
            const allowed = !this.isKingInCheck(piece.color);
            this.board = originalBoard;
            return allowed;
        });

        if (piece.isKing) {
            moves = moves.concat(this.getKingCastleMoves(piece.color));
        } else if (piece.isPawn) {
            moves = moves.concat(this.getEnPassantMove(piece));
        }

        return moves;
    }

    getEnPassantMove(pawn) {
        var moves = [];
        var positionToVictimsMap = {};
        if (pawn.color == WHITE) {
            positionToVictimsMap = {
                24: [25],
                25: [24, 26],
                26: [25, 27],
                27: [26, 28],
                28: [27, 29],
                29: [28, 30],
                30: [29, 31],
                31: [30]
            };
        } else {
            positionToVictimsMap = {
                32: [33],
                33: [32, 34],
                34: [33, 35],
                35: [34, 36],
                36: [35, 37],
                37: [36, 38],
                38: [37, 39],
                39: [38]
            }
        }
        const potentialVictims = positionToVictimsMap[pawn.position];
        if (potentialVictims != undefined && potentialVictims.includes(this.enPassantVictim)) {
            moves.push(this.enPassantVictim + ((pawn.color == WHITE) ? -8 : 8));
        }
        return moves;
    }

    canCastleKingSide(color) {
        const kingHasMoved = (color == WHITE) ? this.whiteKingHasMoved : this.blackKingHasMoved;
        const rookHasMoved = (color == WHITE) ? this.whiteKingRookHasMoved : this.blackKingRookHasMoved;
        if (kingHasMoved || rookHasMoved || this.isKingInCheck(color)) {
            return false;
        }
        const king = (color == WHITE) ? this.board[60] : this.board[4];
        const positions = (color == WHITE) ? [61, 62] : [5, 6];
        const originalBoard = this.board.slice();
        for (var i = 0; i < positions.length; i++) {
            const flag1 = this.board[positions[i]] != null;
            this.board[king.position] = null;
            this.board[positions[i]] = king;
            const flag2 = this.isKingInCheck(color);
            this.board = originalBoard.slice();
            if (flag1 || flag2) {
                return false;
            }
        }

        return true;
    }

    canCastleQueenSide(color) {
        const kingHasMoved = (color == WHITE) ? this.whiteKingHasMoved : this.blackKingHasMoved;
        const rookHasMoved = (color == WHITE) ? this.whiteQueenRookHasMoved : this.blackQueenRookHasMoved;
        if (kingHasMoved || rookHasMoved || this.isKingInCheck(color)) {
            return false;
        }
        const king = (color == WHITE) ? this.board[60] : this.board[4];
        const extraPosition = (color == WHITE) ? 57 : 1;
        if (this.board[extraPosition] != null) {
            return false;
        }
        const positions = (color == WHITE) ? [58, 59] : [2, 3];
        const originalBoard = this.board.slice();
        for (var i = 0; i < positions.length; i++) {
            const flag1 = this.board[positions[i]] != null;
            this.board[king.position] = null;
            this.board[positions[i]] = king;
            const flag2 = this.isKingInCheck(color);
            this.board = originalBoard;
            if (flag1 || flag2) {
                return false;
            }
        }

        return true;
    }

    getKingCastleMoves(color) {
        var moves = []
        if (this.canCastleKingSide(color)) {
            moves.push((color == WHITE) ? 62 : 6);
        }
        if (this.canCastleQueenSide(color)) {
            moves.push((color == WHITE) ? 58 : 2);
        }
        return moves;
    }

    getPiecesForColor(color) {
        return this.board.filter((piece) => piece != null && piece.color == color);
    }

    getKingsPosition(color) {
        for (var i = 0; i < this.board.length; i++) {
            if (this.board[i] != null && this.board[i].isKing && this.board[i].color == color) {
                return i;
            }
        }
    }

    isKingInCheck(color) {
        /**
         * Is the king of the given color in check?
         *
         */
        const enemyColor = (color == BLACK) ? WHITE : BLACK;
        const enemyPieces = this.getPiecesForColor(enemyColor);
        const kingsPosition = this.getKingsPosition(color);
        for (var i = 0; i < enemyPieces.length; i++) {
            const moves = enemyPieces[i].getPossibleMoves(this.board);
            if (moves.includes(kingsPosition)) {
                return true;
            }
        }
        return false;
    }

    isKingCheckmated(color) {
        /**
         * Is the king of the given color in checkmate on the given board?
         */
        return this.isKingInCheck(color) && !this.hasLegalMove(color);
    }

    hasLegalMove(color) {
        /**
         * Does the given color have a legal move?
         */
        const pieces = this.getPiecesForColor(color);
        for (var i = 0; i < pieces.length; i++) {
            if (this.getPossibleMovesForPiece(pieces[i]).length > 0) {
                return true;
            }
        }
        return false;
    }

    getAlgebraicNotation(source, destination) {
        const piece = this.board[source];
        var str = (piece.color == WHITE) ? 'White ' : 'Black ';
        str = str + piece.toString();

        // check for ambiguous moves
        // there exists a piece of the same type, of a different source,
        // which can move to the same destination
        if (!piece.isPawn) {
            var otherPieces = [];
            for (var i = 0; i < this.board.length; i++) {
                if (this.board[i] != null && i != source && this.board[i].toString() == piece.toString() && this.board[i].color == piece.color && this.getPossibleMovesForPiece(this.board[i]).includes(destination)) {
                    otherPieces.push(this.board[i]);
                }
            }
            if (otherPieces.length > 0) {
                const otherFiles = otherPieces.map(p => this.getFile(p.position));
                const otherRanks = otherPieces.map(p => this.getRank(p.position));
                if (!otherFiles.includes(this.getFile(source))) {
                    str = str + this.getFile(source);
                } else if (!otherRanks.includes(this.getRank(source))) {
                    str = str + this.getRank(source);
                } else {
                    str = str + this.getRankAndFile(source);
                }
            }
        }

        // check for capture
        if (this.board[destination] != null) {
            if (piece.isPawn) {
                str = str + this.getFile(source);
            }

            str = str + 'x';
        }

        const dstrf = this.getRankAndFile(destination);
        str = str + dstrf;
        return str;
    }

    getRankAndFile(index) {
        return this.getFile(index) + this.getRank(index);
    }

    getRank(index) {
        return 8 - Math.floor(index/8);
    }

    getFile(index) {
        const files = ['a', 'b', 'c', 'd', 'e', 'f', 'g', 'h'];
        return files[index%8];
    }

    static getPieceForString(s, i) {
        /**
         * s should be a 2 character string:
         *  - the first denotes the color
         *  - the second denotes the piece
         */
        if (s.length < 2) {
            return null;
        }

        const colorChar = s[0];
        const pieceChar = s[1];
        const color = (colorChar == 'B') ? BLACK : WHITE;
        if (pieceChar == 'P') {
            return new Pawn(color, i, false, false, true);
        } else if (pieceChar == 'K') {
            return new King(color, i, true, false, false);
        } else if (pieceChar == 'Q') {
            return new Queen(color, i, false, false, false);
        } else if (pieceChar == 'R') {
            return new Rook(color, i, false, true, false);
        } else if (pieceChar == 'B') {
            return new Bishop(color, i, false, false, false);
        } else if (pieceChar == 'N') {
            return new Knight(color, i, false, false, false);
        } else {
            return null;
        }
    }
}

class Square extends React.Component {
    getButtonClassName() {
        const rowParity = Math.floor(this.props.index/8) % 2;
        const columnParity = this.props.index % 2;
        const colorClassName = (rowParity == columnParity) ? 'chess-square-light' : 'chess-square-dark';
        var className = colorClassName;
        if (this.props.isSelected) {
            //className = className + ' ' + 'chess-square selected';
            className = 'selected';
        }
        return className + ' ' + 'chess-square';
    }
    render() {
        const pieceValToClassNameMap = {
            'WB': 'white-bishop',
            'WK': 'white-king',
            'WN': 'white-knight',
            'WP': 'white-pawn',
            'WQ': 'white-queen',
            'WR': 'white-rook',
            'BB': 'black-bishop',
            'BK': 'black-king',
            'BN': 'black-knight',
            'BP': 'black-pawn',
            'BQ': 'black-queen',
            'BR': 'black-rook',
        };
        const pieceClassName = (pieceValToClassNameMap[this.props.value] != undefined) ? pieceValToClassNameMap[this.props.value] : '';
        const possibleMoveClassName = (this.props.isPossible) ? 'possible-move-square' : '';
        return (
            <div
                className={this.getButtonClassName()}
                onClick={() => this.props.onClick() }>
                <div className={'chess-img-box' + ' ' + pieceClassName + ' ' + 'chess-piece-img'}>
                    <div className={possibleMoveClassName}></div>
                </div>
                {/*{this.props.value}*/}
            </div>
        );
    }
} 

class ChessBoard extends React.Component {

    constructor(props) {
        super(props);

        this.game = new ChessGame(
            this.props.board,
            this.props.extra_state.blackQueenRookHasMoved,
            this.props.extra_state.blackKingRookHasMoved,
            this.props.extra_state.blackKingHasMoved,
            this.props.extra_state.whiteQueenRookHasMoved,
            this.props.extra_state.whiteKingRookHasMoved,
            this.props.extra_state.whiteKingHasMoved,
            this.props.extra_state.enPassantVictim
        );

        this.playerColor = (this.props.current_player == this.props.white) ? WHITE : BLACK;

        this.state = {
            'selected': -1,
            'possible': [],
            'showModal': false
        }

        this.moveToPosition = -1;
        this.moveText = '';
        this.handleChooseQueen = this.handleChooseQueen.bind(this);
        this.handleChooseKnight = this.handleChooseKnight.bind(this);
        this.handleChooseRook = this.handleChooseRook.bind(this);
        this.handleChooseBishop = this.handleChooseBishop.bind(this);
    }

    componentWillUpdate(nextProps, nextState) {
        this.game = new ChessGame(
            nextProps.board,
            nextProps.extra_state.blackQueenRookHasMoved,
            nextProps.extra_state.blackKingRookHasMoved,
            nextProps.extra_state.blackKingHasMoved,
            nextProps.extra_state.whiteQueenRookHasMoved,
            nextProps.extra_state.whiteKingRookHasMoved,
            nextProps.extra_state.whiteKingHasMoved,
            nextProps.extra_state.enPassantVictim
        );
        this.playerColor = (nextProps.current_player == nextProps.white) ? WHITE : BLACK;
    }

    isGameOver() {
        return this.props.completed != null;
    }

    getOppositePlayer() {
        return (this.props.current_player == this.props.white) ? this.props.black : this.props.white;
    }

    getCurrentTurnStatus() {
        if (this.isGameOver()) {
            return 'N/A';
        }

        return (this.props.current_turn == this.props.black) ? 'Black' : 'White';
    }

    getGameStatus() {
        var str = '';
        if (this.isGameOver()) {
            if (this.game.isKingCheckmated(WHITE)) {
                // black checkmated white
                str = 'Checkmate. Black wins.';
            } else if (this.game.isKingCheckmated(BLACK)) {
                // white checkmated black
                str = 'Checkmate. White wins.';
            } else if (!this.game.hasLegalMove(BLACK)) {
                // stalemate - current player has no moves
                str = 'Stalemate. Black has no legal move.';
            } else {
                str = 'Stalemate. White has no legal move.';
            }
        } else {
            // is anyone in check
            if (this.game.isKingInCheck(WHITE)) {
                str = 'White is in check';
            } else if (this.game.isKingInCheck(BLACK)) {
                str = 'Black is in check';
            }
        }
        return str;
    }

    otherPlayerIsReady() {
        return this.props.black != '';
    }

    isMyTurn() {
        return this.props.current_turn == this.props.current_player;
    }

    handleClick(i) {
        if (!this.otherPlayerIsReady() || !this.isMyTurn() || this.isGameOver()) {
            return;
        }

        var piece = this.game.getPieceAtSquare(i);
        if (piece != null && piece.color == this.playerColor) {
            const moves = this.game.getPossibleMovesForPiece(piece);
            this.setState({'selected': i, 'possible': moves});
            return;
        }

        if (this.state.selected != -1 && this.state.possible.includes(i)) {
            this.handleMove(i);
            return;
        }

    }

    handleMove(i) {
        this.moveText = this.game.getAlgebraicNotation(this.state.selected, i);

        var newBoard = this.props.board.slice();

        // pawn promotion
        if (newBoard[this.state.selected][1] == 'P' && (i <= 7 || i >= 56)) {
            this.moveToPosition = i;
            this.setState({'showModal': true});
            return;
        }

        // clone extra_state
        var extraState = JSON.parse(JSON.stringify(this.props.extra_state));

        // update castling-related state flags
        if (!extraState.blackQueenRookHasMoved && this.state.selected == 0) {
            extraState.blackQueenRookHasMoved = true;
        } else if (!extraState.blackKingRookHasMoved && this.state.selected == 7) {
            extraState.blackKingRookHasMoved = true;
        } else if (!extraState.blackKingHasMoved && this.state.selected == 4) {
            extraState.blackKingHasMoved = true;
        } else if (!extraState.whiteQueenRookHasMoved && this.state.selected == 56) {
            extraState.whiteQueenRookHasMoved = true;
        } else if (!extraState.whiteKingRookHasMoved && this.state.selected == 63) {
            extraState.whiteKingRookHasMoved = true;
        } else if (!extraState.whiteKingHasMoved && this.state.selected == 60) {
            extraState.whiteKingHasMoved = true;
        }

        // castling
        if (this.state.selected == 60 && i == 62 && newBoard[this.state.selected] == 'WK') {
            // white king-side castle
            newBoard[61] = newBoard[63];
            newBoard[63] = '';
            extraState.whiteKingRookHasMoved = true;
            extraState.whiteKingHasMoved = true;
            this.moveText = 'White 0-0';
        } else if (this.state.selected == 60 && i == 58 && newBoard[this.state.selected] == 'WK') {
            // white queen-side castle
            newBoard[59] = newBoard[56];
            newBoard[56] = '';
            extraState.whiteQueenRookHasMoved = true;
            extraState.whiteKingHasMoved = true;
            this.moveText = 'White 0-0-0';
        } else if (this.state.selected == 4 && i == 6 && newBoard[this.state.selected] == 'BK') {
            // black king-side castle
            newBoard[5] = newBoard[7];
            newBoard[7] = '';
            extraState.blackKingRookHasMoved = true;
            extraState.blackKingHasMoved = true;
            this.moveText = 'Black 0-0';
        } else if (this.state.selected == 4 && i == 2 && newBoard[this.state.selected] == 'BK') {
            // black queen-side castle
            newBoard[3] = newBoard[0];
            newBoard[0] = '';
            extraState.blackQueenRookHasMoved = true;
            extraState.blackKingHasMoved = true;
            this.moveText = 'Black 0-0-0';
        }

        // en passant capture
        // we know it's an en passant capture if a pawn is moving diagonally into an unoccupied square
        if (newBoard[this.state.selected][1] == 'P' && (this.state.selected + i) % 2 == 1 && newBoard[i] == '') {
            newBoard[extraState.enPassantVictim] = '';
            const colorText = (newBoard[this.state.selected][0] == 'W') ? 'White ' : ' Black ';
            this.moveText = colorText + this.game.getFile(this.state.selected) + 'x' + this.game.getRankAndFile(i) + 'e.p.';
        }

        // update en passant victim state
        const whiteStartingRow = [48, 49, 50, 51, 52, 53, 54, 55];
        const whiteEndingRow = [32, 33, 34, 35, 36, 37, 38, 39];
        const blackStartingRow = [8, 9, 10, 11, 12, 13, 14, 15];
        const blackEndingRow = [24, 25, 26, 27, 28, 29, 30, 31];
        if (whiteStartingRow.includes(this.state.selected) && whiteEndingRow.includes(i) && newBoard[this.state.selected][1] == 'P') {
            extraState.enPassantVictim = i;
        } else if (blackStartingRow.includes(this.state.selected) && blackEndingRow.includes(i) && newBoard[this.state.selected][1] == 'P') {
            extraState.enPassantVictim = i;
        } else {
            extraState.enPassantVictim = -1;
        }

        newBoard[i] = newBoard[this.state.selected];
        newBoard[this.state.selected] = '';

        this.handleNewBoard(newBoard, extraState);
    }

    handleNewBoard(board, extraState) {
        // check for game over conditions: stalemate and checkmate
        // stalemate: next player cannot make a move that won't put their king in check
        // checkmate: stalemate condition with the addition that their king is currently in check
        var gameOver = this.isGameOver();
        const otherColor = (this.playerColor == WHITE) ? BLACK : WHITE;
        const newChessGame = new ChessGame(
            board,
            extraState.blackQueenRookHasMoved,
            extraState.blackKingRookHasMoved,
            extraState.blackKingHasMoved,
            extraState.whiteQueenRookHasMoved,
            extraState.whiteKingRookHasMoved,
            extraState.whiteKingHasMoved,
            extraState.enPassantVictim
        );

        if (newChessGame.isKingCheckmated(otherColor)) {
            this.moveText = this.moveText + ' mate';
        } else if (newChessGame.isKingInCheck(otherColor)) {
            this.moveText = this.moveText + '+';
        }

        if (!newChessGame.hasLegalMove(otherColor)) {
            gameOver = true;
        }

        const data = {
            'message_type': 'new_move',
            'move': this.moveText,
            'board': board,
            'next_player': this.getOppositePlayer(),
            'game_over': gameOver,
            'extra_state': extraState
        }
        this.props.ws.state.ws.send(JSON.stringify(data));
        this.setState({'selected': -1, 'possible': []});
    }

    renderSquare(i) {
        return (
            <Square
                key={i}
                index={i}
                value={this.props.board[i]}
                onClick={() => this.handleClick(i)} 
                isSelected={this.state.selected == i} 
                isPossible={this.state.possible.includes(i)} />
        );
    }

    renderRow(row) {
        var squares = [];
        for (var i =0; i < 8; i++) {
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

    handleChooseQueen() {
        this.handleChoosePromotionPiece('Q');
    }

    handleChooseKnight() {
        this.handleChoosePromotionPiece('N');
    }

    handleChooseRook() {
        this.handleChoosePromotionPiece('R');
    }

    handleChooseBishop() {
        this.handleChoosePromotionPiece('B');
    }

    handleChoosePromotionPiece(pieceChar) {
        this.setState({'showModal': false});
        var newBoard = this.props.board.slice();
        const colorChar = (this.moveToPosition <= 7) ? 'W' : 'B';
        newBoard[this.moveToPosition] = colorChar + pieceChar;
        newBoard[this.state.selected] = '';
        this.moveText = this.moveText + pieceChar;
        this.handleNewBoard(newBoard, this.props.extra_state);
    }

    render() {
        const turnClassName = (this.isMyTurn() && !this.isGameOver()) ? 'current-turn-indicator' : '';
        return (
            <div className='board-area'>
                <div className='player-turn-status-area'>
                    <div>
                        White: {this.props.white}<br />
                        Black: {(this.props.black == '') ? 'N/A' : this.props.black}<br />
                    </div>
                    <div className='current-turn-area'>
                        Current turn: <span className={turnClassName}>{this.getCurrentTurnStatus()}</span>
                    </div>
                </div>
                <ReactModal
                    isOpen={this.state.showModal}
                    contentLabel='Pawn Promotion'
                    shouldCloseOnOverlayClick={false}
                >
                    <p>Choose a piece to replace your pawn:</p>
                    <button onClick={this.handleChooseQueen}>Queen</button>
                    <button onClick={this.handleChooseKnight}>Knight</button>
                    <button onClick={this.handleChooseRook}>Rook</button>
                    <button onClick={this.handleChooseBishop}>Bishop</button>
                </ReactModal>
                <div className='chess-board'>
                    {this.renderRows()}
                </div>
                <div>
                    {this.getGameStatus()}
                </div>
            </div>
        );
    }

}

export default ChessBoard;
