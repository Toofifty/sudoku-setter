import React from 'react';
import Thermo from 'components/thermo';
import KillerCage from 'components/killer-cage';
import Arrow from 'components/arrow';

interface BackgroundCellProps {
    index: number;
    color: string;
    thermos?: number[][];
    arrows?: { head: number[]; tail: number[] }[];
    killerCages?: { total: number; cage: number[] }[];
}

const BackgroundCell = ({
    index,
    color,
    thermos,
    arrows,
    killerCages,
}: BackgroundCellProps) => (
    <div className={`background-cell background-cell--${color}`}>
        {thermos && thermos.length > 0 && (
            <Thermo index={index} thermos={thermos} />
        )}
        {arrows && arrows.length > 0 && <Arrow index={index} arrows={arrows} />}
        {killerCages && killerCages.length > 0 && (
            <KillerCage index={index} killerCages={killerCages} />
        )}
    </div>
);

export default BackgroundCell;
