import React from 'react';
import { SCALE } from './consts';

import './background-svg.scss';
import ThermoGraphics from './thermo-graphics';

const BackgroundSVG = () => {
    return (
        <svg
            width={SCALE}
            height={SCALE}
            viewBox={`0 0 ${SCALE} ${SCALE}`}
            className="background-svg"
        >
            <ThermoGraphics />
        </svg>
    );
};

export default BackgroundSVG;
