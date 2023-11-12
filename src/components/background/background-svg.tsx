import React from 'react';
import { SCALE } from './consts';
import ThermoGraphics from './thermo-graphics';
import ArrowGraphics from './arrow-graphics';

import './background-svg.scss';
import CageGraphics from './cage-graphics';

const BackgroundSVG = () => {
    return (
        <svg
            width={SCALE}
            height={SCALE}
            viewBox={`0 0 ${SCALE} ${SCALE}`}
            className="background-svg"
        >
            <ThermoGraphics />
            <ArrowGraphics />
            <CageGraphics />
        </svg>
    );
};

export default BackgroundSVG;
