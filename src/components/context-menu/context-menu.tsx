import React, { useEffect, useRef, useState } from 'react';
import cx from 'classnames';
import { Portal } from 'react-portal';
import useSelector from 'hooks/use-selector';
import useAction from 'hooks/use-action';
import { isEventOver } from 'utils';
import Menu from 'components/menu';
import './context-menu.scss';
import { viewport } from 'utils/size';

const X_OFFSET = 8;
const Y_OFFSET = 0;
const SAFE_AREA_PADDING = 16;

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

    const ref = useRef<HTMLUListElement>(null);

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
            let x = mouse.x + X_OFFSET;
            let y = mouse.y + Y_OFFSET;
            if (ref.current) {
                const rect = ref.current.getBoundingClientRect();
                const { width, height } = viewport;

                if (x < 0) x = SAFE_AREA_PADDING;
                if (y < 0) y = SAFE_AREA_PADDING;
                if (x + rect.width > width)
                    x = width - rect.width - SAFE_AREA_PADDING;
                if (y + rect.height > height)
                    y = height - rect.height - SAFE_AREA_PADDING;
            }
            setPosition({ x, y });
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
            <Menu
                ref={ref}
                className={cx('context-menu context-menu--mobile')}
                style={style}
            >
                {content()}
            </Menu>
        );

    return (
        <Portal>
            <Menu
                ref={ref}
                className={cx(
                    'context-menu',
                    isVisible && 'context-menu--visible'
                )}
                style={style}
            >
                {content()}
            </Menu>
        </Portal>
    );
};

export default ContextMenu;
