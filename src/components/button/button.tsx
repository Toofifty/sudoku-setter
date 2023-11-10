import React, { forwardRef } from 'react';
import cx from 'classnames';
import { Link } from 'react-router-dom';
import './button.scss';

interface BaseButtonProps {
    children?: React.ReactNode;
    className?: string;
    primary?: boolean;
    danger?: boolean;
    wide?: boolean;
    disabled?: boolean;
}

interface RealButtonProps {
    onClick: (event: React.MouseEvent) => void;
}

interface SubmitButtonProps {
    submit: boolean;
}

interface LinkButtonProps {
    to: string;
}

interface ExternalLinkButtonProps {
    href: string;
    target?: string;
}

type ButtonProps = BaseButtonProps &
    (
        | RealButtonProps
        | SubmitButtonProps
        | LinkButtonProps
        | ExternalLinkButtonProps
    );

const Button = forwardRef<HTMLElement, ButtonProps>(
    (
        { children, className, primary, danger, wide, disabled, ...rest },
        ref
    ) => {
        const classNames = cx('button', className, {
            'button--primary': primary,
            'button--danger': danger,
            'button--wide': wide,
            'button--disabled': disabled,
        });

        if ('onClick' in rest) {
            return (
                <button
                    ref={ref as React.Ref<HTMLButtonElement>}
                    className={classNames}
                    type="button"
                    {...rest}
                >
                    {children}
                </button>
            );
        }

        if ('submit' in rest) {
            return (
                <button
                    ref={ref as React.Ref<HTMLButtonElement>}
                    className={classNames}
                    type={rest.submit ? 'submit' : 'button'}
                >
                    {children}
                </button>
            );
        }

        if ('href' in rest) {
            return (
                <a
                    ref={ref as React.Ref<HTMLAnchorElement>}
                    className={classNames}
                    {...rest}
                >
                    {children}
                </a>
            );
        }

        return (
            <Link
                ref={ref as React.Ref<HTMLAnchorElement>}
                className={classNames}
                {...rest}
            >
                {children}
            </Link>
        );
    }
);

export default Button;
