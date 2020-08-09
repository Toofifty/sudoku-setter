import React, { useEffect, useState } from 'react';
import cx from 'classnames';
import { Portal } from 'react-portal';
import useSelector from 'hooks/use-selector';
import useAction from 'hooks/use-action';
import './context-menu.scss';
import { isEventOver } from 'utils';

const X_OFFSET = 4;
const Y_OFFSET = 4;

interface ContextMenuProps {
    isStatic?: boolean;
    onAction?: () => void;
}

const ContextMenu = ({ isStatic, onAction }: ContextMenuProps) => {
    const content = useSelector((state) => state.ui.contextMenu);
    const isVisible = useSelector((state) => state.ui.contextVisible);
    const [mouse, setMouse] = useState({ x: 0, y: 0 });
    const [position, setPosition] = useState({ x: 0, y: 0 });
    const toggleContextMenu = useAction('ui/toggle-context-menu');

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
        const close = (e: MouseEvent) =>
            !isEventOver(e, 'context-menu') &&
            e.button !== 2 &&
            toggleContextMenu(false);

        const closeAfterClick = (e: MouseEvent) => {
            if (isEventOver(e, 'context-menu') && e.button !== 2) {
                toggleContextMenu(false);
                onAction?.();
            }
        };

        if (isVisible || onAction) {
            window.addEventListener('mousedown', close);
            window.addEventListener('click', closeAfterClick);
            setPosition({ x: mouse.x + X_OFFSET, y: mouse.y + Y_OFFSET });
        }
        return () => {
            window.removeEventListener('mousedown', close);
            window.removeEventListener('click', closeAfterClick);
        };
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [isVisible]);

    const style = {
        '--x': `${position.x}px`,
        '--y': `${position.y}px`,
    } as React.CSSProperties;

    if (!content) return null;

    if (isStatic)
        return (
            <ul className={cx('menu context-menu context-menu--mobile')}>
                {content()}
            </ul>
        );

    return (
        <Portal>
            <ul
                className={cx(
                    'menu context-menu',
                    isVisible && 'context-menu--visible'
                )}
                style={style}
            >
                {content()}
            </ul>
        </Portal>
    );
};

export default ContextMenu;
