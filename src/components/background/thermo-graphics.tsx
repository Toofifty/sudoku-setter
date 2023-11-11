import React from 'react';
import useSelector from 'hooks/use-selector';
import {
    GHOST_THERMO_BULB_SIZE,
    GHOST_THERMO_LINE_WIDTH,
    THERMO_BULB_SIZE,
    THERMO_LINE_WIDTH,
    getSVGPosition,
} from './consts';

const renderLines = (thermo: number[], width: number) =>
    thermo.map((index, i) => {
        const next = thermo[i + 1];
        if (!next) {
            return null;
        }

        const position = getSVGPosition(index);
        const nextPosition = getSVGPosition(next);

        return (
            <line
                key={index}
                x1={position.x}
                y1={position.y}
                x2={nextPosition.x}
                y2={nextPosition.y}
                strokeWidth={width * 100}
                strokeLinecap="round"
            />
        );
    });

const renderThermo = (
    thermo: number[],
    i: number,
    bulbSize: number,
    lineWidth: number
) => {
    const [bulb] = thermo;
    const position = getSVGPosition(bulb);

    return (
        <g key={i} className="svg-thermo">
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
