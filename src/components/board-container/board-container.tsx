import React from 'react';
import Background from 'components/background';
import Board from 'components/board';
import './board-container.scss';

const BoardContainer = () => (
    <div className="board-container">
        <div className="board-sizer">
            <Background />
            <Board />
        </div>
    </div>
);

export default BoardContainer;
