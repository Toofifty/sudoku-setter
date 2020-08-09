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
        {range(1, 11).map((n) => (
            <Button
                primary={n !== 10}
                key={n}
                onClick={() => onSetNumber(n === 10 ? 0 : n)}
                disabled={n === selected}
                danger={n === 10}
            >
                {n === 10 ? <i className="fa fa-times" /> : n}
            </Button>
        ))}
    </div>
);

export default NumberInput;
