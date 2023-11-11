import React from 'react';
import cx from 'classnames';
import { range } from 'utils';
import { getBoxIndex } from 'utils/sudoku';
import Box from 'components/box';
import BackgroundCell from './background-cell';
import useSelector from 'hooks/use-selector';
import './background.scss';
import BackgroundSVG from './background-svg';

const boxes = range(0, 81).reduce(
    (boxes, i) => {
        boxes[getBoxIndex(i)].push(i);
        return boxes;
    },
    [[], [], [], [], [], [], [], [], []] as number[][]
);

const Background = () => {
    const selection = useSelector((state) => state.ui.selection);
    const { board, arrows, thermos, killerCages, restrictions } = useSelector(
        (state) => state.puzzle
    );
    const partialVariants = useSelector(
        (state) => state.setter.partialVariants
    );
    const solution = useSelector((state) => state.solver.solution);
    const settings = useSelector((state) => state.player.settings);

    return (
        <div
            className={cx(
                'background',
                restrictions.uniqueDiagonals && 'background--diagonals'
            )}
        >
            <BackgroundSVG />
            {boxes.map((box, i) => (
                <Box key={i}>
                    {box.map((n) => (
                        <BackgroundCell
                            key={n}
                            index={n}
                            color={
                                solution[n].color ?? board[n].color ?? 'white'
                            }
                            selection={
                                settings.outlineSelection ? selection : []
                            }
                            partialVariants={partialVariants}
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
