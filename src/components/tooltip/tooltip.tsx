import React, {
    cloneElement,
    isValidElement,
    useEffect,
    useRef,
    useState,
} from 'react';
import cx from 'classnames';
import { useDebouncedCallback } from 'utils/use-debounced-callback';

import './tooltip.scss';

const INTERACTION_DELAY = 500;

interface TooltipProps {
    children: React.ReactNode;
    content: React.ReactNode;
    className?: string;
    anchor?: 'top' | 'left' | 'right' | 'bottom';
}

const Tooltip = ({
    children,
    content,
    className,
    anchor = 'top',
}: TooltipProps) => {
    const [hovered, setHovered] = useState(false);
    const [childRect, setChildRect] = useState<DOMRect>();
    const childRef = useRef<HTMLDivElement>();

    useEffect(() => {
        if (childRef.current) {
            setChildRect(childRef.current.getBoundingClientRect());
        }
    }, []);

    const [onHover, clearHover] = useDebouncedCallback(() => {
        setHovered(true);
    }, INTERACTION_DELAY);

    const style = (
        childRect
            ? {
                  '--x': childRect.x + 'px',
                  '--y': childRect.y + 'px',
                  '--width': childRect.width + 'px',
                  '--height': childRect.height + 'px',
              }
            : {}
    ) as React.CSSProperties;

    if (!isValidElement(children)) {
        throw new Error('Tooltip children must be a valid element');
    }

    return (
        <>
            <div
                className={cx(
                    'x-tooltip',
                    `x-tooltip--${anchor}`,
                    hovered && 'x-tooltip--hovered'
                )}
                style={style}
            >
                {content}
            </div>
            {cloneElement(children, {
                onMouseEnter: (e: React.MouseEvent) => {
                    onHover();
                    children.props.onMouseEnter?.(e);
                },
                onMouseLeave: (e: React.MouseEvent) => {
                    clearHover();
                    setHovered(false);
                    children.props.onMouseLeave?.(e);
                },
                ref: childRef,
                ...children.props,
            })}
        </>
    );
};

export default Tooltip;
