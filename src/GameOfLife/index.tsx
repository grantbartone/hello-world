import React, { useState } from 'react';
import './styles.css';

import { GLIDER } from "./patterns";

export default function GameOfLife() {
  const [ board, setBoard ] = useState(GLIDER);
  const [ pastBoards, setPastBoards ] = useState([board]);
  const [ count, setCount ] = useState(0);

  const advanceGeneration = (start: boolean[][]) => {
    const nextCount = count + 1;
    if (nextCount === pastBoards.length) {
      const nextBoard = advance(board);
      setBoard(nextBoard);
      setPastBoards([...pastBoards, nextBoard]);
    } else {
      setBoard(pastBoards[nextCount]);
    }
    setCount(count + 1);
  }

  const previousGeneration = () => {
    const lastCount = count - 1 > 0 ? count - 1 : 0
    setCount(lastCount)
    setBoard(pastBoards[lastCount])
  }

  const renderBoard = () => {
    return (
      <div>
        {board.map((row, i) => (
          <div className="row" key={`${i}`}>
            {row.map((cell, j) => (
              <div className={`item ${cell ? 'item--alive' : ''}`} key={`${j}`} />
            ))}
          </div>
        ))}
      </div>
    );
  };

  return (
    <div className="container">
      <h1>Welcome to the Game... of Life!</h1>
      <div className="intro">
        <p>
          Below is Grant's "Game of Life" challenge built in React!
        </p>
        <p>
          Click a button below to play, and learn more about the rules of the game <a href="https://en.wikipedia.org/wiki/Conway%27s_Game_of_Life" target="_blank" rel="noopener noreferrer">here</a>.
        </p>
        <p>
          <button onClick={previousGeneration}>
            Previous Generation
          </button>
        </p>
        <p>
          <button onClick={() => advanceGeneration(board)}>
            Advance Generation
          </button>
        </p>
      </div>
      
      <div>{renderBoard()}</div>
    </div>
  );
}

export const advance = (start: boolean[][]) => {
  const numLiveNeighbors = (x: number, y: number) => {
    const isAlive = (x: number, y: number) => start[x][y] ? 1 : 0;
    const xLen = start.length, yLen = start[0].length;
    
    let count = 0;
    for (const [offsetX, offsetY] of [ [-1,-1],[-1,0],[-1,1],[0,-1],[0,1],[1,-1],[1,0],[1,1] ]) {
      count += isAlive((xLen + x + offsetX) % xLen, (yLen + y + offsetY) % yLen);
    }
    return count;
  }

  const end = [];
  for (let i = 0; i < start.length; i += 1) {
    const row = [];
    for (let j = 0; j < start[0].length; j += 1) {
      const liveNeighbors = numLiveNeighbors(i, j);
      if (start[i][j]) { // Alive
        row.push([2,3].includes(liveNeighbors));
      } else {
        row.push(liveNeighbors === 3);
      }
    }
    end.push(row);
  }
  return end;
}
