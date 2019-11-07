import React, { Component } from 'react';
import './ConnectN.css';
import { Row } from './Row';

export default class ConnectN extends Component {
	constructor(props) {
		super(props);

		const BOARDWIDTH = 7, BOARDHEIGHT = 6; // TODO: Get these from the UI
		this.state = {
			playerTurn: 1,
			playerOneName: "Red", // TODO: Ask player names in the UI
			playerTwoName: "Black",
			winningRows: 4, // TODO: Ask how many in-a-row to win
			boardHeight: BOARDHEIGHT,
			board: new Array(BOARDWIDTH).fill([]),
			isGameOver: false,
			isDraw: false,
		};
		
		this.handleClick = this.handleClick.bind(this);
	}

	initNewGame() {
		this.setState({
			...this.state,
			playerTurn: 1,
			board: new Array(this.state.board.length).fill([]),
			isGameOver: false,
			isDraw: false,
		});
	}

	getPlayerTurnName() {
		if (this.state.playerTurn === 1) {
			return <span className="playerRed">{this.state.playerOneName}</span>;
		}
		return this.state.playerTwoName;
	}

	verticalWinner(board) {
		for (let column = 0; column < board.length; column += 1) {
			if (board[column].length < this.state.winningRows) continue;

			let winnerFlag = true;
			for (let row = 0; row < board[column].length; row += 1) {
				if (row < board[column].length - this.state.winningRows) continue;
				if (board[column][row] !== this.state.playerTurn) {
					winnerFlag = false;
					break;
				}
			}
			if (winnerFlag) return this.state.playerTurn;
		}
		return false;
	}

	horizontalWinner(board) {
		for (let column = 0; column < board.length; column += 1) {
			if (board[column].length === 0) continue;
			const lastRowIndex = board[column].length - 1;
			if (board[column][lastRowIndex] !== this.state.playerTurn) continue;

			const startColumnIndex = Math.max(column - this.state.winningRows, 0);
			const endColumnIndex = Math.min(board.length, column + this.state.winningRows);
			let countInARow = 0;
			for (let i = startColumnIndex; i < endColumnIndex; i += 1) {
				if (!board[i][lastRowIndex] || board[i][lastRowIndex] !== this.state.playerTurn) {
					countInARow = 0;
				} else {
					countInARow += 1;
					if (countInARow === this.state.winningRows) return this.state.playerTurn;
				}
			}
		}
		return false;
	}

	diagonalWinner(board) {
		for (let column = 0; column < board.length; column += 1) {
			const lastRowIndex = board[column].length - 1;
			if (board[column].length < this.state.winningRows ||
				board[column][lastRowIndex] !== this.state.playerTurn) continue;

			let leftDiag = column >= this.state.winningRows - 1;
			let rightDiag = column <= board.length - this.state.winningRows;
			for (let offset = 1; offset < this.state.winningRows; offset += 1) {
				leftDiag = leftDiag && board[column - offset][lastRowIndex - offset] === this.state.playerTurn;
				rightDiag = rightDiag && board[column + offset][lastRowIndex - offset] === this.state.playerTurn;
				if (!leftDiag && !rightDiag) break;
			}
			if (leftDiag || rightDiag) return this.state.playerTurn;
		}
		return false;
	}

	isPlayerWin(board) {
		return (this.verticalWinner(board) // First check for a vertical win in the current row
			|| this.horizontalWinner(board) // Next check if the player is a horizontal winner
			|| this.diagonalWinner(board)); // Finally check if the player is a diagonal winner
	}

	isFullColumn = (column) => column.length === this.state.boardHeight;

	isDraw(board) {
		for (let i = 0; i < board.length; i += 1) {
			if (!this.isFullColumn(board[i])) return false;
		}
		return true;
	}

	handleClick(columnIndex) {
		if (this.state.isGameOver) return;
		const board = [...this.state.board];
		const column = [...board[columnIndex]];
		if (this.isFullColumn(column)) return;
		column.push(this.state.playerTurn);
		board[columnIndex] = column;

		const winner = this.isPlayerWin(board);
		if (!winner) {
			if (this.isDraw(board)) {
				// Draw game: Game Over
				this.setState({
					...this.state,
					board,
					isGameOver: true,
					isDraw: true,
				});
			} else {
				// No winner or Draw: next player's turn
				this.setState({
					...this.state,
					board,
					playerTurn: (this.state.playerTurn === 1 ? 2 : 1),
				});
			}
		} else {
			// Winner: Game Over
			this.setState({
				...this.state,
				board,
				isGameOver: true,
			});
		}
	}

	getDisplayGrid() {
		// First, copy the board from state and fill empty spaces with null values
		const board = [...this.state.board];
		for (let column = 0; column < board.length; column += 1) {
			if (board[column].length < this.state.boardHeight) {
				const fillCount = this.state.boardHeight - board[column].length;
				const fillArr = new Array(fillCount).fill(null);
				board[column] = [...board[column], ...fillArr];
			}
		}

		// Then, rotate the board 90-degrees
		const grid = [];
		for (let i = board[0].length - 1; i >= 0; i -= 1) {
			const row = [];
			for (let j = 0; j < board.length; j += 1) {
				row.push(board[j][i]);
			}
			grid.push(row);
		}
		return grid;
	}

	renderPlayerPrompt() {
		if (this.state.isDraw)
			return <div className="playerPrompt">This game is a draw!</div>;
		else if (this.state.isGameOver)
			return <div className="playerPrompt">{this.getPlayerTurnName()} wins!!!</div>;
		else {
			return <div className="playerPrompt">Next Player: {this.getPlayerTurnName()}</div>;
		}
	}

	renderInstructions() {
		if (this.state.isDraw || this.state.isGameOver)
			return (
				<div className="center">
					<button className="newGame" onClick={() => this.initNewGame()}>Play Again!</button>
				</div>
			);
		else
			return <div className="center">Click any column below to drop a piece</div>;
	}

	render() {
		const grid = this.getDisplayGrid();
		return (
			<div>
				<h1>Connect 4</h1>
				{this.renderPlayerPrompt()}
				{this.renderInstructions()}
				<table>
					<tbody>
						{grid.map((row, i) => <Row key={i} row={row} handleClick={this.handleClick} />)}
					</tbody>
				</table>
				<div className="center">By: Grant Bartone</div>
				<div className="center">Coming Soon: "Connect N"</div>
			</div>
		);
	}
}