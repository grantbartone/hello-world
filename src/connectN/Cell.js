import React, { Component } from 'react';

// Cell class component
export class Cell extends Component {
	getCellColor(cell) {
		if (cell === 1) return "red";
		if (cell === 2) return "black";
		return "white";
	}
	
	render() {
		const { cell, columnIndex, handleClick } = this.props;
		const color = this.getCellColor(cell);
		return (
			<td>
				<div className="cell" onClick={() => handleClick(columnIndex)}>
					<div className={color} />
				</div>
			</td>
		);
	}
}