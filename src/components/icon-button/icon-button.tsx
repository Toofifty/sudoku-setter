import cx from 'classnames';
import { forwardRef } from 'react';
import './icon-button.scss';

interface IconButtonProps {
    className?: string;
    icon: string;
    onClick: (event: React.MouseEvent) => void;
    primary?: boolean;
    danger?: boolean;
    disabled?: boolean;
}

export const IconButton = forwardRef<HTMLElement, IconButtonProps>(
    ({ className, primary, danger, disabled, icon, ...rest }, ref) => {
        const classNames = cx('icon-button', className, {
            'icon-button--primary': primary,
            'icon-button--danger': danger,
            'icon-button--disabled': disabled,
        });
        return (
            <button
                ref={ref as React.Ref<HTMLButtonElement>}
                className={classNames}
                type="button"
                {...rest}
            >
                <i className={icon} />
            </button>
        );
    }
);
