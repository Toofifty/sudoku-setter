import React from 'react';
import Thermo from 'components/thermo';
import KillerCage from 'components/killer-cage';

interface BackgroundCellProps {
    index: number;
    color: string;
    thermos?: number[][];
    killerCages?: { total: number; cage: number[] }[];
}

const BackgroundCell = ({
    index,
    color,
    thermos,
    killerCages,
}: BackgroundCellProps) => (
    <div className={`background-cell background-cell--${color}`}>
        <Thermo index={index} thermos={thermos} />
        <KillerCage index={index} killerCages={killerCages} />
    </div>
);

export default BackgroundCell;
