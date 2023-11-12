import React from 'react';
import GraphicsBorderSelection from 'components/graphics/border-selection/border-selection';

interface BackgroundCellProps {
    index: number;
    color: string;
    selection: number[];
}

const BackgroundCell = ({ index, color, selection }: BackgroundCellProps) => (
    <div className={`background-cell background-cell--${color}`}>
        {selection.length > 0 && (
            <GraphicsBorderSelection index={index} selection={selection} />
        )}
    </div>
);

export default BackgroundCell;
