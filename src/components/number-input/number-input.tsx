import React from 'react';
import { range } from 'utils';
import './number-input.scss';

interface NumberInputProps {
    onSetNumber: (n: number) => void;
    selected?: number;
}

const NumberInput = ({ onSetNumber, selected }: NumberInputProps) => (
    <div className="number-input">
        {range(0, 10).map((n) => (
            <button
                className="btn btn-primary"
                key={n}
                onClick={() => onSetNumber(n)}
                disabled={n === selected}
            >
                {n === 0 ? <i className="icon icon-cross" /> : n}
            </button>
        ))}
    </div>
);

export default NumberInput;
