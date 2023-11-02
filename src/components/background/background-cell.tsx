import React from 'react';
import GraphicsThermo from 'components/graphics/thermo';
import GraphicsArrow from 'components/graphics/arrow';
import GraphicsKillerCage from 'components/graphics/killer-cage';
import { Arrow, KillerCage, Thermo } from 'utils/sudoku-types';
import GraphicsBorderSelection from 'components/graphics/border-selection/border-selection';

interface BackgroundCellProps {
    index: number;
    color: string;
    selection: number[];
    thermos?: Thermo[];
    arrows?: Arrow[];
    killerCages?: KillerCage[];
}

const BackgroundCell = ({
    index,
    color,
    selection,
    thermos,
    arrows,
    killerCages,
}: BackgroundCellProps) => (
    <div className={`background-cell background-cell--${color}`}>
        {thermos && thermos.length > 0 && (
            <GraphicsThermo index={index} thermos={thermos} />
        )}
        {arrows && arrows.length > 0 && (
            <GraphicsArrow index={index} arrows={arrows} />
        )}
        {killerCages && killerCages.length > 0 && (
            <GraphicsKillerCage index={index} killerCages={killerCages} />
        )}
        {selection.length > 0 && (
            <GraphicsBorderSelection index={index} selection={selection} />
        )}
    </div>
);

export default BackgroundCell;
