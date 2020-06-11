import React from 'react';
import Thermo from 'components/thermo';

interface BackgroundCellProps {
    index: number;
    color: string;
}

const BackgroundCell = ({ index, color }: BackgroundCellProps) => (
    <div className={`background-cell background-cell--${color}`}>
        <Thermo index={index} />
    </div>
);

export default BackgroundCell;
