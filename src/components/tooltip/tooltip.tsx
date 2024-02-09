import {
    cloneElement,
    isValidElement,
    useEffect,
    useRef,
    useState,
} from 'react';
import cx from 'classnames';

import { useDebouncedCallback } from 'utils/use-debounced-callback';

import './tooltip.scss';
import { Portal } from 'react-portal';

const getRect = (element: HTMLElement) => {
    const { width, height } = element.getBoundingClientRect();

    let left = 0;
    let top = 0;
    while (element && !isNaN(element.offsetLeft) && !isNaN(element.offsetTop)) {
        left += element.offsetLeft - element.scrollLeft;
        top += element.offsetTop - element.scrollTop;
        element = element.offsetParent as HTMLElement;
    }

    return { top, left, width, height };
};

const INTERACTION_DELAY = 400;

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
    const [initialRender, setInitialRender] = useState(true);
    const [hovered, setHovered] = useState(false);
    const [childRect, setChildRect] = useState<{
        top: number;
        left: number;
        width: number;
        height: number;
    }>();
    const childRef = useRef<HTMLDivElement>();

    useEffect(() => {
        if (childRef.current) {
            setChildRect(getRect(childRef.current));
        }
        if (initialRender) {
            // position can be incorrect on initial render
            // so we trigger this again later
            setTimeout(() => {
                setInitialRender(false);
            }, 100);
        }
    }, [children, initialRender]);

    const [onHover, clearHover] = useDebouncedCallback(() => {
        setHovered(true);
    }, INTERACTION_DELAY);

    const style = (
        childRect
            ? {
                  '--x': childRect.left + 'px',
                  '--y': childRect.top + 'px',
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
            <Portal>
                <div
                    className={cx(
                        'x-tooltip',
                        `x-tooltip--${anchor}`,
                        childRect && 'x-tooltip--animatable',
                        hovered && 'x-tooltip--hovered'
                    )}
                    style={style}
                >
                    {content}
                </div>
            </Portal>
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
