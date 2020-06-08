import React from 'react';
import './board.scss';
import useSelector from '../../hooks/use-selector';
import { ICell, Position } from '../../types';
import { getBoxIndex, getCellAt } from '../../util/sudoku';
import Box from '../box';
import Cell from '../cell';
import useAction from '../../hooks/use-action';

const Board = () => {
    const board = useSelector((state) => state.sudoku.board);
    const setValue = useAction('set-value');

    const boxes = board.reduce(
        (boxes, cell, i) => {
            const pos = getCellAt(i);
            const index = getBoxIndex(pos);
            if (!boxes[index]) {
                boxes[index] = [];
            }
            boxes[index].push({ cell, pos });
            return boxes;
        },
        [[], [], [], [], [], [], [], [], []] as {
            cell: ICell;
            pos: Position;
        }[][]
    );

    return (
        <div className="board">
            {boxes.map((box, i) => (
                <Box key={i}>
                    {box.map(({ cell, pos }, i) => (
                        <Cell
                            key={i}
                            {...cell}
                            onClick={() => {}}
                            onKeyUp={({ key }) => {
                                const n = Number(key);
                                if (!isNaN(n) && n > 0 && n < 10) {
                                    setValue({
                                        cell: pos,
                                        value: n,
                                        given: true,
                                    });
                                }
                            }}
                        />
                    ))}
                </Box>
            ))}
        </div>
    );
};

export default Board;
