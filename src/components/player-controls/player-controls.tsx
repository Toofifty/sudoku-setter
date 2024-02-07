import React, { useLayoutEffect, useRef, useState } from 'react';
import './player-controls.scss';
import { PlayerAuxKeypad } from 'components/player-aux-keypad';
import PlayerKeypad from 'components/player-keypad';

const PADDING_X = 24;

const PlayerControls = () => {
    const ref = useRef<HTMLDivElement>(null);
    const [scale, setScale] = useState(100);

    useLayoutEffect(() => {
        const listener = () => {
            if (!ref.current) {
                return;
            }

            const targetWidth = window.innerWidth - PADDING_X;
            const currentWidth = ref.current.clientWidth;
            setScale((targetWidth / currentWidth) * 100);
        };

        window.addEventListener('resize', listener);
        listener();

        return () => {
            window.removeEventListener('resize', listener);
        };
    }, []);

    return (
        <div
            className="player-controls"
            style={{ '--scale': scale } as any}
            ref={ref}
        >
            <PlayerAuxKeypad />
            <PlayerKeypad />
        </div>
    );
};

export default PlayerControls;
