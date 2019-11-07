import React, { Component } from 'react';
import { Cell } from './Cell';

export class Row extends Component {
	render() {
		const { row, handleClick } = this.props;
		return (
			<tr>
				{row.map((cell, i) => <Cell key={i} cell={cell} handleClick={handleClick} columnIndex={i} />)}
			</tr>
		);
	}
}