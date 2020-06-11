import React from 'react';
import cx from 'classnames';
import './color-picker.scss';

interface ColorPickerProps {
    color: string;
    onSelect: (color: string) => void;
}

const COLORS = ['white', 'yellow', 'red', 'green', 'blue'];

const ColorPicker = ({ color, onSelect }: ColorPickerProps) => (
    <div className="color-picker">
        {COLORS.map((option) => (
            <button
                key={option}
                className={cx(
                    `color-picker__option color-picker__option--${option}`,
                    color === option && 'color-picker__option--selected'
                )}
                onClick={() => onSelect(option)}
            />
        ))}
    </div>
);

export default ColorPicker;
