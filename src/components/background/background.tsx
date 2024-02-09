import React from 'react';
import cx from 'classnames';

import { range } from 'utils';
import { getBoxIndex } from 'utils/sudoku';
import Box from 'components/box';
import useSelector from 'hooks/use-selector';

import BackgroundCell from './background-cell';
import './background.scss';
import { SCALE } from './consts';
import ThermoGraphics from './graphics/thermo-graphics';
import ArrowGraphics from './graphics/arrow-graphics';
import CageGraphics from './graphics/cage-graphics';

const boxes = range(0, 81).reduce(
    (boxes, i) => {
        boxes[getBoxIndex(i)].push(i);
        return boxes;
    },
    [[], [], [], [], [], [], [], [], []] as number[][]
);

const Background = () => {
    const selection = useSelector((state) => state.ui.selection);
    const { board, restrictions } = useSelector((state) => state.puzzle);
    const solution = useSelector((state) => state.solver.solution);
    const settings = useSelector((state) => state.player.settings);

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
                            selection={
                                settings.outlineSelection ? selection : []
                            }
                        />
                    ))}
                </Box>
            ))}
            <svg
                width={SCALE}
                height={SCALE}
                viewBox={`0 0 ${SCALE} ${SCALE}`}
                className="background-svg"
            >
                <ThermoGraphics />
                <ArrowGraphics />
                <CageGraphics />
            </svg>
        </div>
    );
};

export default Background;
