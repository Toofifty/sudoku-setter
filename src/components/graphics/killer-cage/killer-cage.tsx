import React from 'react';
import cx from 'classnames';
import './killer-cage.scss';
import { KillerCage } from 'utils/sudoku-types';

type Side = 'br' | 'b' | 'bl' | 'r' | 'l' | 'tr' | 't' | 'tl';

const directionMap: Record<number, Side> = {
    10: 'br',
    9: 'b',
    8: 'bl',
    1: 'r',
    [-1]: 'l',
    [-8]: 'tr',
    [-9]: 't',
    [-10]: 'tl',
};

const getSides = (index: number, cage: number[]) =>
    cage.reduce((sides, cell) => {
        const dir = directionMap[cell - index];
        if (dir && !sides.includes(dir)) return [...sides, dir];
        return sides;
    }, [] as Side[]);

interface GraphicsKillerCageProps {
    index: number;
    killerCages: KillerCage[];
}

const GraphicsKillerCage = ({
    index,
    killerCages,
}: GraphicsKillerCageProps) => (
    <>
        {killerCages
            .filter(({ cage }) => cage.includes(index))
            .map(({ total, cage }, i) => {
                const isTopLeft = Math.min(...cage) === index;

                return (
                    <div className="killer-cage" key={i}>
                        {isTopLeft && (
                            <div className="killer-cage__total">{total}</div>
                        )}
                        <div
                            className={cx(
                                'killer-cage__cage',
                                ...getSides(index, cage).map(
                                    (side) => `killer-cage__cage--has-${side}`
                                )
                            )}
                        />
                    </div>
                );
            })}
    </>
);

export default GraphicsKillerCage;
