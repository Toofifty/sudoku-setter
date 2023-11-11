import React from 'react';
import GraphicsThermo from 'components/graphics/thermo';
import GraphicsArrow from 'components/graphics/arrow';
import GraphicsKillerCage from 'components/graphics/killer-cage';
import { Arrow, KillerCage, Thermo } from 'utils/sudoku-types';
import GraphicsBorderSelection from 'components/graphics/border-selection/border-selection';
import { PartialVariants } from 'reducers/setter';

interface BackgroundCellProps {
    index: number;
    color: string;
    selection: number[];
    partialVariants: PartialVariants;
    thermos?: Thermo[];
    arrows?: Arrow[];
    killerCages?: KillerCage[];
}

const BackgroundCell = ({
    index,
    color,
    selection,
    partialVariants,
    thermos,
    arrows,
    killerCages,
}: BackgroundCellProps) => (
    <div className={`background-cell background-cell--${color}`}>
        <GraphicsThermo
            index={index}
            thermos={thermos}
            partialThermo={partialVariants.thermo}
        />
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
