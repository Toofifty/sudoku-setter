import React from 'react';
import cx from 'classnames';
import './cell.scss';

interface CellProps {
    value?: number;
    pencils?: number[];
    given: boolean;

    selected?: boolean;
    onClick: (e: React.MouseEvent) => void;
    onKeyUp: (e: React.KeyboardEvent) => void;
}

const Cell = ({
    value,
    pencils,
    given,
    selected,
    onClick,
    onKeyUp,
}: CellProps) => (
    <button
        className={cx(
            'cell',
            given && 'cell--given',
            value && 'cell--filled',
            selected && 'cell--selected'
        )}
        onClick={onClick}
        onKeyUp={onKeyUp}
    >
        {value ? (
            <span className="cell__value">{value}</span>
        ) : (
            new Array(9)
                .fill(0)
                .map((_, i) => (
                    <span className={`cell__pencil pencil-${i + 1}`}>
                        {pencils?.includes(i + 1) ? i + 1 : ''}
                    </span>
                ))
        )}
    </button>
);

export default Cell;
