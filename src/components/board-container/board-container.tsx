import React, { useState, useEffect } from 'react';
import Background from 'components/background';
import Board from 'components/board';
import './board-container.scss';

const MOBILE_PADDING = 48;
const DESKTOP_EXTRA_ROOM = 360;

const BoardContainer = () => {
    const [scale, setScale] = useState(100);
    const [mobileScale, setMobileScale] = useState(100);

    useEffect(() => {
        const listener = () => {
            setScale(
                Math.min((window.outerWidth - DESKTOP_EXTRA_ROOM) / 10, 100)
            );
            setMobileScale(
                Math.min((window.outerWidth - MOBILE_PADDING) / 10, 100)
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
