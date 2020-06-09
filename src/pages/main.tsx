import React from 'react';
import Board from '../components/board';
import { useSudokuReducer } from '../util/reduce';

const Main = () => {
    const sudokuReduce = useSudokuReducer();
    return (
        <div>
            <Board />
            <button onClick={sudokuReduce}>Reduce</button>
        </div>
    );
};

export default Main;
