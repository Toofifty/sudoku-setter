import React from 'react';
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

const Button = ({
    children,
    className,
    primary,
    danger,
    wide,
    disabled,
    ...rest
}: ButtonProps) => {
    const classNames = cx('button', className, {
        'button--primary': primary,
        'button--danger': danger,
        'button--wide': wide,
        'button--disabled': disabled,
    });

    if ('onClick' in rest) {
        return (
            <button className={classNames} {...rest}>
                {children}
            </button>
        );
    }

    if ('submit' in rest) {
        return (
            <button
                className={classNames}
                type={rest.submit ? 'submit' : 'button'}
            >
                {children}
            </button>
        );
    }

    if ('href' in rest) {
        return (
            <a className={classNames} {...rest}>
                {children}
            </a>
        );
    }

    return (
        <Link className={classNames} {...rest}>
            {children}
        </Link>
    );
};

export default Button;
