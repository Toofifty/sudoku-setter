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
    const { board, thermos, killerCages, restrictions } = useSelector(
        (state) => state.puzzle
    );

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
                            color={board[n].color ?? 'white'}
                            thermos={thermos}
                            killerCages={killerCages}
                        />
                    ))}
                </Box>
            ))}
        </div>
    );
};

export default Background;
