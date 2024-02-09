import { forwardRef } from 'react';
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
    onMouseEnter?: (event: React.MouseEvent) => void;
    onMouseLeave?: (event: React.MouseEvent) => void;
}

const Toggle = forwardRef<HTMLLabelElement, ToggleProps>(
    (
        {
            className,
            children,
            sw,
            radio,
            onMouseEnter,
            onMouseLeave,
            ...input
        },
        ref
    ) => (
        <label
            ref={ref}
            className={cx(
                'toggle',
                radio && 'form-radio',
                sw && 'form-switch',
                !sw && !radio && 'form-checkbox',
                className,
                input.disabled && 'toggle--disabled'
            )}
            onMouseEnter={onMouseEnter}
            onMouseLeave={onMouseLeave}
        >
            <input type={radio ? 'radio' : 'checkbox'} {...input} />
            <i className="form-icon" /> {children}
        </label>
    )
);

export default Toggle;
