import React from 'react';
import Thermo from 'components/thermo';

interface BackgroundCellProps {
    index: number;
}

const BackgroundCell = ({ index }: BackgroundCellProps) => (
    <div className="background-cell">
        <Thermo index={index} />
    </div>
);

export default BackgroundCell;
