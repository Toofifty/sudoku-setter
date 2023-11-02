import React from 'react';
import cx from 'classnames';
import { range } from 'utils';
import { getBoxIndex } from 'utils/sudoku';
import Box from 'components/box';
import BackgroundCell from './background-cell';
import './background.scss';
import useSelector from 'hooks/use-selector';

const boxes = range(0, 81).reduce(
    (boxes, i) => {
        boxes[getBoxIndex(i)].push(i);
        return boxes;
    },
    [[], [], [], [], [], [], [], [], []] as number[][]
);

const Background = () => {
    const { board, arrows, thermos, killerCages, restrictions } = useSelector(
        (state) => state.puzzle
    );
    const solution = useSelector((state) => state.solver.solution);

    return (
        <div
            className={cx(
                'background',
                restrictions.uniqueDiagonals && 'background--diagonals'
            )}
        >
            {boxes.map((box, i) => (
                <Box key={i}>
                    {box.map((n) => (
                        <BackgroundCell
                            key={n}
                            index={n}
                            color={
                                solution[n].color ?? board[n].color ?? 'white'
                            }
                            thermos={thermos}
                            arrows={arrows}
                            killerCages={killerCages}
                        />
                    ))}
                </Box>
            ))}
        </div>
    );
};

export default Background;
