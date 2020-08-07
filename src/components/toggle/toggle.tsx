import React from 'react';
import cx from 'classnames';
import './toggle.scss';

interface ToggleProps {
    children: React.ReactNode;
    className?: string;
    sw?: boolean;
    checked?: boolean;
    onChange?: (event: React.ChangeEvent) => void;
    disabled?: boolean;
}

const Toggle = ({ className, children, sw, ...input }: ToggleProps) => (
    <label
        className={cx(
            'toggle',
            sw ? 'form-switch' : 'form-checkbox',
            className,
            input.disabled && 'toggle--disabled'
        )}
    >
        <input type="checkbox" {...input} />
        <i className="form-icon" /> {children}
    </label>
);

export default Toggle;
