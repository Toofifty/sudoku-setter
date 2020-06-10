import React, { useEffect, useState } from 'react';
import cx from 'classnames';
import useSelector from '../../hooks/use-selector';
import './context.scss';
import useAction from '../../hooks/use-action';

const X_OFFSET = 4;
const Y_OFFSET = 4;

const Context = () => {
    const content = useSelector((state) => state.ui.context);
    const [mouse, setMouse] = useState({ x: 0, y: 0 });
    const [position, setPosition] = useState({ x: 0, y: 0 });
    const closeContext = useAction('close-context');

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
        const close = () => closeContext();
        if (content) {
            setPosition({ x: mouse.x + X_OFFSET, y: mouse.y + Y_OFFSET });
            window.addEventListener('mousedown', close);
        }
        return () => {
            window.removeEventListener('mousedown', close);
        };
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [content]);

    const style = {
        '--x': `${position.x}px`,
        '--y': `${position.y}px`,
    } as React.CSSProperties;

    return (
        <ul
            className={cx('context menu', content && 'context--visible')}
            style={style}
        >
            {content}
        </ul>
    );
};

export default Context;
