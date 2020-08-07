import React from 'react';
import { range } from 'utils';
import Button from 'components/button';
import './number-input.scss';

interface NumberInputProps {
    onSetNumber: (n: number) => void;
    selected?: number;
}

const NumberInput = ({ onSetNumber, selected }: NumberInputProps) => (
    <div className="number-input">
        {range(0, 10).map((n) => (
            <Button
                primary
                key={n}
                onClick={() => onSetNumber(n)}
                disabled={n === selected}
            >
                {n === 0 ? <i className="icon icon-cross" /> : n}
            </Button>
        ))}
    </div>
);

export default NumberInput;
