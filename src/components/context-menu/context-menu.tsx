import React, { useEffect, useState } from 'react';
import cx from 'classnames';
import useSelector from '../../hooks/use-selector';
import useAction from '../../hooks/use-action';
import './context-menu.scss';

const X_OFFSET = 4;
const Y_OFFSET = 4;

const Context = () => {
    const content = useSelector((state) => state.ui.contextMenu);
    const [mouse, setMouse] = useState({ x: 0, y: 0 });
    const [position, setPosition] = useState({ x: 0, y: 0 });
    const closeContextMenu = useAction('close-context-menu');

    useEffect(() => {
        const updateMousePos = (e: MouseEvent) => {
            setMouse({ x: e.pageX, y: e.pageY });
        };
        window.addEventListener('mousemove', updateMousePos);
        return () => {
            window.removeEventListener('mousemove', updateMousePos);
        };
    }, []);

    useEffect(() => {
        const close = (e: MouseEvent) => e.button !== 2 && closeContextMenu();
        if (content) {
            setPosition({ x: mouse.x + X_OFFSET, y: mouse.y + Y_OFFSET });
            window.addEventListener('click', close);
        }
        return () => {
            window.removeEventListener('click', close);
        };
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [content]);

    const style = {
        '--x': `${position.x}px`,
        '--y': `${position.y}px`,
    } as React.CSSProperties;

    return (
        <ul
            className={cx(
                'context-menu menu',
                content && 'context-menu--visible'
            )}
            style={style}
        >
            {content?.()}
        </ul>
    );
};

export default Context;
