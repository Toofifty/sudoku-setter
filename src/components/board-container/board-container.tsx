import React, { useState, useEffect } from 'react';
import Background from 'components/background';
import Board from 'components/board';
import './board-container.scss';

const MIN_SCALE = 80;

const MOBILE_PADDING = 12;
const DESKTOP_EXTRA_ROOM = 400;

const BoardContainer = () => {
    const [scale, setScale] = useState(100);
    const [mobileScale, setMobileScale] = useState(100);

    useEffect(() => {
        const listener = () => {
            setScale(
                Math.min(
                    (window.outerWidth - DESKTOP_EXTRA_ROOM) / 10,
                    MIN_SCALE
                )
            );
            setMobileScale(
                Math.min((window.outerWidth - MOBILE_PADDING) / 10, MIN_SCALE)
            );
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
            </div>
        </div>
    );
};

export default BoardContainer;
