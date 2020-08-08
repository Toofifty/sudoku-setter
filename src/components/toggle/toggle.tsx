import React from 'react';
import cx from 'classnames';
import './toggle.scss';

interface ToggleProps {
    children: React.ReactNode;
    className?: string;
    sw?: boolean;
    radio?: boolean;
    checked?: boolean;
    onChange?: (event: React.ChangeEvent) => void;
    disabled?: boolean;
}

const Toggle = ({ className, children, sw, radio, ...input }: ToggleProps) => (
    <label
        className={cx(
            'toggle',
            radio && 'form-radio',
            sw && 'form-switch',
            !sw && !radio && 'form-checkbox',
            className,
            input.disabled && 'toggle--disabled'
        )}
    >
        <input type={radio ? 'radio' : 'checkbox'} {...input} />
        <i className="form-icon" /> {children}
    </label>
);

export default Toggle;
