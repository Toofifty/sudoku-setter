import React from 'react';
import cx from 'classnames';
import { Link } from 'react-router-dom';
import './button.scss';

interface BaseButtonProps {
    children?: React.ReactNode;
    className?: string;
    primary?: boolean;
    wide?: boolean;
    disabled?: boolean;
}

interface RealButtonProps {
    onClick: (event: React.MouseEvent) => void;
}

interface LinkButtonProps {
    to: string;
}

interface ExternalLinkButtonProps {
    href: string;
    target?: string;
}

type ButtonProps = BaseButtonProps &
    (RealButtonProps | LinkButtonProps | ExternalLinkButtonProps);

const Button = ({
    children,
    className,
    primary,
    wide,
    disabled,
    ...rest
}: ButtonProps) => {
    const classNames = cx('button', className, {
        'button--primary': primary,
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
