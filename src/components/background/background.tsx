import React from 'react';
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
    const colors = useSelector((state) => state.sudoku.colors);

    return (
        <div className="background">
            {boxes.map((box, i) => (
                <Box key={i}>
                    {box.map((n) => (
                        <BackgroundCell key={n} index={n} color={colors[n]} />
                    ))}
                </Box>
            ))}
        </div>
    );
};

export default Background;