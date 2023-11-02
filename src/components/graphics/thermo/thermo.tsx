import React from 'react';
import './thermo.scss';

const directionMap: Record<
    number,
    'br' | 'b' | 'bl' | 'r' | 'l' | 'tr' | 't' | 'tl'
> = {
    10: 'br',
    9: 'b',
    8: 'bl',
    1: 'r',
    [-1]: 'l',
    [-8]: 'tr',
    [-9]: 't',
    [-10]: 'tl',
};

const getDirectionTo = (index: number, target: number) =>
    directionMap[target - index];

interface GraphicsThermo {
    index: number;
    thermos: number[][];
}

const GraphicsThermo = ({ index, thermos }: GraphicsThermo) => (
    <>
        {thermos
            .filter((thermo) => thermo.includes(index))
            .map((thermo, i) => {
                const indexInThermo = thermo.indexOf(index);
                const first = indexInThermo === 0;
                const last = indexInThermo === thermo.length - 1;
                return (
                    <div className="thermo" key={i}>
                        {first && <div className="thermo__bulb" />}
                        {!last && (
                            <div
                                className={`thermo__line thermo__line--${getDirectionTo(
                                    index,
                                    thermo[indexInThermo + 1]
                                )}`}
                            />
                        )}
                    </div>
                );
            })}
    </>
);

export default GraphicsThermo;
