import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';

function Square(props) {
  return (
    <button
      className={"square " + (props.isWinning ? "square--winning" : null)}
      onClick={props.onClick}
    >
      {props.value}
    </button>
  );
}

class Board extends React.Component {
  renderSquare(i) {
      let winning = false;
    for (var k = 0; k < this.props.winningSquares.length; k++) {
      if (this.props.winningSquares[k] === i) {
        winning = true;
      }
    }
    let content = this.props.squares[i];
    if (winning) {
      content = "*" + this.props.squares[i] ;
    } else {
      content = this.props.squares[i];
    }
    return (
      <Square
        key={"square " + i}
        value={content}
        onClick={() => this.props.onClick(i)}
      />
    );
  }

  renderSquares(n) {
    let squares = [];
    for (let i = n; i < n + 5; i++) {
      squares.push(this.renderSquare(i));
    }
    return squares;
  }

  renderRows(i) {
    return <div className="board-row">{this.renderSquares(i)}</div>;
  }

  render() {
    return (
      <div>
        {this.renderRows(0)}
        {this.renderRows(5)}
        {this.renderRows(10)}
        {this.renderRows(15)}
        {this.renderRows(20)}
      </div>
    );
  }
}

class Game extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
        reverseHistory: false,
        history: [
            {
            squares: Array(9).fill(null)
            }
        ],
        stepNumber: 0,
        xIsNext: true
        };
    }
    handleReverseHistoryClick() {
        this.setState({
        reverseHistory: !this.state.reverseHistory
        });
    }

    lines  = [
        [0, 1, 2, 3, 4],
        [5,6,7,8,9],
        [10,11,12,13,14],
        [15,16,17,18,19],
        [20,21,22,23,24],
        [0,6,12,18,24],
        [4,8,12,16,20],
        [0,5,10,15,20],
        [1,6,11,16,21],
        [2,7,12,17,22],
        [3,8,13,18,23],
        [4,9,14,19,24]
    ];

    calculateWinner(squares) {
    
    for (let i = 0; i < this.lines.length; i++) {
        const [a, b, c,d,e] = this.lines[i];
        if (squares[a] && squares[a] === squares[b] && squares[a] === squares[c] && squares[a] === squares[d] && squares[a] === squares[e]) {
        return [squares[a], i];
        }
    }
    return null;
    }

  handleClick(i) {
    const locations = [
      [1, 1],
      [2, 1],
      [3, 1],
      [4, 1],
      [5, 1],
      [1, 2],
      [2, 2],
      [3, 2],
      [4, 2],
      [5, 2],
      [1, 3],
      [2, 3],
      [3, 3],
      [4, 3],
      [5, 3],
      [1, 4],
      [2, 4],
      [3, 4],
      [4, 4],
      [5, 4],
      [1, 5],
      [2, 5],
      [3, 5],
      [4, 5],
      [5, 5]
    ];

    
    const history = this.state.history.slice(0, this.state.stepNumber + 1);
    const current = history[history.length - 1];
    const squares = current.squares.slice();
    if (this.calculateWinner(squares) || squares[i]) {
      return;
    }
    squares[i] = this.state.xIsNext ? "X" : "O";
    this.setState({
      history: history.concat([
        {
          squares: squares,
          location: locations[i]
        }
      ]),
      stepNumber: history.length,
      xIsNext: !this.state.xIsNext
    });
  }

  jumpTo(step) {
    this.setState({
      stepNumber: step,
      xIsNext: step % 2 === 0
    });
  }

  render() {
    const history = this.state.history;
    const current = history[this.state.stepNumber];
    const winner = this.calculateWinner(current.squares);

    const moves = history.map((step, move) => {
      const desc = move
        ? "Go to move " + move + " (" +history[move].location + ")" 
        : "Go to game start";
      return (
        <li key={move}>
          <button onClick={() => this.jumpTo(move)}>
            {move == this.state.stepNumber ? <b>{desc}</b> : desc}
          </button>
        </li>
      );
    });
const reverseButtonDesc = this.state.reverseHistory
      ? "Change to Ascending  History"
      : "Change to Descending  History";
    const reverseButton = (
      <button onClick={() => this.handleReverseHistoryClick()}>
        {reverseButtonDesc}
      </button>
    );
    if (!this.state.reverseHistory) {
      moves.reverse();
    }
    let status;
    let winningSquares;
    if (winner) {
      status = "Winner: " + winner[0];
      winningSquares = this.lines[winner[1]];
    } else {
      status = "Next player: " + (this.state.xIsNext ? "X" : "O");
       winningSquares = [];
    }

    return (
      <div className="game">
        <div className="game-board">
           <Board
            winningSquares={winningSquares}
            squares={current.squares}
            onClick={i => this.handleClick(i)}
          />
        </div>
        <div className="game-info">
          <div>{status}</div>
          <ol>{moves}</ol>
          <div>{reverseButton}</div>
        </div>
      </div>
    );
  }
}

// ========================================

ReactDOM.render(<Game />, document.getElementById("root"));

