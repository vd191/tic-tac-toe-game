import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {

  board: any[];
  boardLocked = true;
  againstAI = true;
  gameOver: boolean;

  hardMode: false;

  currentPlayer: any;

  huPlayer1 = { name: '', symbol: '' };
  huPlayer2 = { name: '', symbol: '' };

  huPlayer = { name: '', symbol: '' };
  aiPlayer = { name: '', symbol: '' };

  ngOnInit() {

  }

  newGame(mode) {
    this.boardLocked = false;

    this.board = [
      { value: '' }, { value: '' }, { value: '' },
      { value: '' }, { value: '' }, { value: '' },
      { value: '' }, { value: '' }, { value: '' }
    ];

    if (mode === 'PLAYER_MODE') {
      this.currentPlayer = (Math.floor(Math.random() * 2) === 0) ? this.huPlayer1 : this.huPlayer2;
    } else if (mode === 'AI_MODE') {
      this.currentPlayer = (Math.floor(Math.random() * 2) === 0) ? this.huPlayer : this.aiPlayer;
      if (this.currentPlayer === this.aiPlayer) {
        this.computerMove();
      }
    }
  }

  multiPlayerMode(event) {
    const player = event.target.id;
    // Random tick
    const symbol = (Math.floor(Math.random() * 2) === 0) ? 'X' : 'O';

    switch (player) {
      case 'player1': {
        this.huPlayer1.name = event.target.value;
        this.huPlayer1.symbol = symbol;
        break;
      }
      case 'player2': {
        this.huPlayer2.name = event.target.value;
        this.huPlayer2.symbol = (this.huPlayer1.symbol === 'X') ? 'O' : 'X';
        break;
      }
      default: {
        console.log('Invalid choice');
        break;
      }
    }

    if (this.huPlayer1.name !== '' && this.huPlayer2.name !== '') {
      this.newGame('PLAYER_MODE');
    }
  }


  makeMove(square) {
    if (this.againstAI) {
      this.gameWithAI(square);
    } else {
      this.gameWithPlayer(square);
    }
  }

  gameWithAI(square) {
    // Chack winning condition
    if (square.value === '') {
      if (this.currentPlayer === this.aiPlayer) {
        this.computerMove();
      } else if (this.currentPlayer === this.huPlayer) {
        square.value = this.currentPlayer.symbol;
        this.checkStateGame(this.currentPlayer.symbol);
        this.currentPlayer = (this.currentPlayer === this.huPlayer) ? this.aiPlayer : this.huPlayer;
        this.computerMove();
      }
    }

  }

  getNewBoard() {
    let newBoard = [];
    for (let i in this.board) {
      if (this.board[i].value === '') {
        newBoard.push(i);
      } else {
        newBoard.push(this.board[i].value);
      }
    }
    return newBoard;
  }

  computerMove() {
    let square: any;

    if (this.hardMode) {
      const newBoard = this.getNewBoard;
      const move = this.minimax(newBoard, this.aiPlayer);
      this.board[move.index].value = this.aiPlayer.symbol;

    } else {
      square = this.getRandomAvailableSquare();
      square.value = this.aiPlayer.symbol;
    }

    this.checkStateGame(this.currentPlayer.symbol);
    // change current player
    this.currentPlayer = (this.currentPlayer === this.huPlayer) ? this.aiPlayer : this.huPlayer;
  }

  getRandomAvailableSquare() {
    const avaiableSquares = this.board.filter(s => s.value === '');
    const squareIndex = Math.floor(Math.random() * (avaiableSquares.length - 1 - 0 + 1) + 0);
    return avaiableSquares[squareIndex];
  }


  gameWithPlayer(square) {
    // Chack winning condition
    if (square.value === '') {
      square.value = this.currentPlayer.symbol;
      this.checkStateGame(this.currentPlayer.symbol);
      this.currentPlayer = (this.currentPlayer === this.huPlayer1) ? this.huPlayer2 : this.huPlayer1;
    }
  }

  checkStateGame(symbol) {
    if (this.winning(this.board, symbol)) {
      this.gameOver = true;
      alert('wow ' + this.currentPlayer.name + 'wins');
    }
  }

  winning(board, symbol) {
    if (
      (board[0].value === symbol && board[1].value === symbol && board[2].value === symbol) || // top row
      (board[3].value === symbol && board[4].value === symbol && board[5].value === symbol) || // middle row
      (board[6].value === symbol && board[7].value === symbol && board[8].value === symbol) || // bottom row
      (board[0].value === symbol && board[3].value === symbol && board[6].value === symbol) || // first col
      (board[1].value === symbol && board[4].value === symbol && board[7].value === symbol) || // second col
      (board[2].value === symbol && board[5].value === symbol && board[8].value === symbol) || // third col
      (board[0].value === symbol && board[4].value === symbol && board[8].value === symbol) || // first diagonal
      (board[2].value === symbol && board[4].value === symbol && board[6].value === symbol)    // second diagonal
    ) {
      return true;
    } else {
      return false;
    }
  }


  computerMode(event) {
    const symbol = (Math.floor(Math.random() * 2) === 0) ? 'X' : 'O';

    this.huPlayer.name = event.target.value;
    this.huPlayer.symbol = symbol;

    const aiNames = ['Ware', 'Flux', 'Brain', 'Luck', 'Thing', 'Logic', 'Oracle', 'Familiar', 'Holmes', 'Codec'];
    const index = Math.floor(Math.random() * (aiNames.length));

    this.aiPlayer.name = aiNames[index];
    this.aiPlayer.symbol = (this.huPlayer.symbol === 'X') ? 'O' : 'X';

    if (this.huPlayer.name !== '' && this.aiPlayer.name !== '') {
      this.newGame('AI_MODE');
    }

  }

  getAvailableMoves(board) {
    let availIndex = [];
    for (let i in board) {
      if (board[i].value === '') {
        availIndex.push(i);
      }
    }
    return availIndex;
  }


  minimax(newBoard, player) {
    // Difining the indexes of the avaiable spots in the board
    let availSopts = this.getAvailableMoves(newBoard);

    // // Checking who wins
    // if (this.winning(newBoard, this.aiPlayer.name)) { return { score: 10 }; }
    // else if (this.winning(newBoard, this.huPlayer.symbol)) { return { score: -10 }; }
    // else if (availSopts.length === 0) { return { score: 0 }; }

    let moves = []; // Collect the scores from each of empty sopts to evaluate them later

    for (let i = 0; i < availSopts.length; i++) {
      let move = { index: 0, score: 0, };

      // Setting the index number the empty spot
      move.index = newBoard[availSopts[i]];
      // setting empty spot on a newBoard to the current player
      newBoard[availSopts[i]] = player.symbol;

      if (player === this.aiPlayer) { // calling the minimax function with the other player in the newly changed newBoard
        const result = this.minimax(newBoard, this.huPlayer);
        // store the object result from the minimax function call, that includes a score property, to the score property of the move object
        move.score = result.score;
      } else {
        const result = this.minimax(newBoard, this.aiPlayer);
        // if the minimax function does not find a terminal state, it goes level by level (deeper into the game). 
        // this recursion happens until it reached out the terminal state and returns a score one level up
        move.score = result.score;
      }
      // resets newBoard to what it was before
      newBoard[availSopts[i]] = move.index;

      moves.push(move);//pushes the move object to the moves array
    }

    let bestMove; // evaluates the best move in the moves array

    // Choosing the highest score when AI is playing and the lowest score when the human is playing            
    if (player === this.aiPlayer) {
      let bestScore = -10000; // if the player is AI player, it sets variable bestScore to a very low number

      for (let i = 0; i < moves.length; i++) {
        if (moves[i].score > bestScore) { // if a move has a higher score than the bestScore, then stores that move
          bestScore = moves[i].score;
          bestMove = i;
        }
      }
    } else { // when human player
      let bestScore = 10000;
      for (let i = 0; i < moves.length; i++) {
        if (moves[i].score < bestScore) { // looks for a move with the lowest score to store
          bestScore = moves[i].score;
          bestMove = i;
        }
      }
    }

    return moves[bestMove]; // returning object stored in bestMove
  }


}
