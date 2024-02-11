import cx from 'classnames';
import { useLayoutEffect, useRef, useState } from 'react';

import Tooltip from 'components/tooltip';
import useAction from 'hooks/use-action';
import { range } from 'utils';
import { useIsDigitCompleted } from 'hooks/use-is-digit-completed';
import { viewport } from 'utils/size';

import './keypad.scss';

const PADDING_X = 24;

const preventFocus = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
};

interface KeypadProps {
    children: React.ReactNode;
    className?: string;
}

export const Keypad = ({ children, className }: KeypadProps) => {
    const ref = useRef<HTMLDivElement>(null);
    const [scale, setScale] = useState(100);

    useLayoutEffect(() => {
        const listener = () => {
            if (!ref.current) {
                return;
            }

            const targetWidth = viewport.width - PADDING_X;
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
            className={cx('keypad', className)}
            style={{ '--scale': scale } as any}
            ref={ref}
        >
            {children}
        </div>
    );
};

interface KeypadColumnProps {
    children?: React.ReactNode;
}

const KeypadColumn = ({ children }: KeypadColumnProps) => {
    return <div className="keypad__column">{children}</div>;
};

interface KeypadDigitsProps {
    children?: React.ReactNode;
}

const KeypadDigits = ({ children }: KeypadDigitsProps) => {
    const setSelectionValue = useAction('shared/set-selection-value');
    const isDigitCompleted = useIsDigitCompleted();

    return (
        <div className="keypad__digits">
            {range(1, 10).map((n) => (
                <Keypad.Button
                    primary
                    key={n}
                    onClick={() => setSelectionValue(n)}
                    disabled={isDigitCompleted(n)}
                >
                    {n}
                </Keypad.Button>
            ))}
            {children}
        </div>
    );
};

interface KeypadButtonProps {
    onClick: () => void;
    children: React.ReactNode;
    className?: string;
    disabled?: boolean;
    tooltip?: string;
    primary?: boolean;
    danger?: boolean;
    success?: boolean;
    selected?: boolean;
}

const KeypadButton = ({
    children,
    className,
    onClick,
    disabled,
    tooltip,
    primary,
    danger,
    success,
    selected,
}: KeypadButtonProps) => {
    const button = (
        <button
            className={cx(
                'keypad__button',
                {
                    'keypad__button--light': !primary,
                    'keypad__button--primary': primary,
                    'keypad__button--danger': danger,
                    'keypad__button--success': success,
                    'keypad__button--selected': selected,
                },
                className
            )}
            onClick={onClick}
            disabled={disabled}
            onMouseDown={preventFocus}
        >
            {children}
        </button>
    );

    if (tooltip) {
        return (
            <Tooltip content={tooltip} anchor="bottom">
                {button}
            </Tooltip>
        );
    }

    return button;
};

Keypad.Column = KeypadColumn;
Keypad.Digits = KeypadDigits;
Keypad.Button = KeypadButton;
