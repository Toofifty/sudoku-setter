import React, { useState, useLayoutEffect } from 'react';
import Background from 'components/background';
import Board from 'components/board';
import './board-container.scss';
import InteractionLayer from 'components/interaction-layer';
import { viewport } from 'utils/size';

const MAX_SCALE = 100;

// mobile only considers play mode (for now)
const MOBILE_PAD_X = 24;
// header = 64
// top padding = 24
// keypad = 240
// extra room (pad-bottom will be half) = 48
const MOBILE_PAD_Y = 64 + 24 + 240 + 48;

// side controls are ~280px
// +24 * 2 for side padding
const DESKTOP_PAD_X = 280 * 2 + 48;
// header = 64
// top padding = 24
// extra room (pad-bottom will be half) = 48
const DESKTOP_PAD_Y = 64 + 24 + 48;

const BoardContainer = () => {
    const [scale, setScale] = useState(100);
    const [mobileScale, setMobileScale] = useState(100);

    useLayoutEffect(() => {
        const listener = () => {
            const desktopScaleX = (viewport.width - DESKTOP_PAD_X) / 10;
            const desktopScaleY = (viewport.height - DESKTOP_PAD_Y) / 10;
            const mobileScaleX = (viewport.width - MOBILE_PAD_X) / 10;
            const mobileScaleY = (viewport.height - MOBILE_PAD_Y) / 10;

            setScale(Math.min(desktopScaleX, desktopScaleY, MAX_SCALE));
            setMobileScale(Math.min(mobileScaleX, mobileScaleY, MAX_SCALE));
        };

        window.addEventListener('resize', listener);
        listener();

        return () => {
            window.removeEventListener('resize', listener);
        };
    }, []);

    return (
        <div
            className="board-container"
            style={{ '--scale': scale, '--mobile-scale': mobileScale } as any}
        >
            <div className="board-sizer">
                <Background />
                <Board />
                <InteractionLayer />
            </div>
        </div>
    );
};

export default BoardContainer;
