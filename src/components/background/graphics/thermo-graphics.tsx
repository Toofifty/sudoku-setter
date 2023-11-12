import React from 'react';
import cx from 'classnames';
import useSelector from 'hooks/use-selector';
import {
    GHOST_THERMO_BULB_SIZE,
    GHOST_THERMO_LINE_WIDTH,
    THERMO_BULB_SIZE,
    THERMO_LINE_WIDTH,
    getSVGPosition,
} from '../consts';

const renderLines = (thermo: number[], width: number) => {
    const path = thermo
        .map((index, i) => {
            const p = getSVGPosition(index);
            return `${i === 0 ? 'M' : 'L'}${p.x} ${p.y}`;
        })
        .join(' ');

    return (
        <path
            d={path}
            fill="none"
            strokeWidth={width * 100}
            strokeLinecap="round"
            strokeLinejoin="round"
        />
    );
};

const renderThermo = (
    thermo: number[],
    i: number,
    bulbSize: number,
    lineWidth: number
) => {
    const [bulb] = thermo;
    const position = getSVGPosition(bulb);

    return (
        <g
            key={i}
            className={cx('svg-thermo', i === -1 && 'svg-thermo--ghost')}
        >
            <circle cx={position.x} cy={position.y} r={50 * bulbSize} />
            {renderLines(thermo, lineWidth)}
        </g>
    );
};

const ThermoGraphics = () => {
    const partialVariants = useSelector(
        (state) => state.setter.partialVariants
    );
    const thermos = useSelector((state) => state.puzzle.thermos);

    const partialThermo = partialVariants.thermo;

    return (
        <>
            {thermos.map((thermo, i) =>
                renderThermo(thermo, i, THERMO_BULB_SIZE, THERMO_LINE_WIDTH)
            )}
            {partialThermo &&
                renderThermo(
                    partialThermo,
                    -1,
                    GHOST_THERMO_BULB_SIZE,
                    GHOST_THERMO_LINE_WIDTH
                )}
        </>
    );
};

export default ThermoGraphics;
