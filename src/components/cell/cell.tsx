import React, { useRef, useEffect, useState } from 'react';
import cx from 'classnames';
import './cell.scss';
import { Position } from '../../types';

interface CellProps {
    value?: number;
    pencils?: number[];
    given: boolean;

    focus?: boolean;
    onFocus?: () => void;
    onMouseEnter?: (e: React.MouseEvent) => void;
    highlighted?: boolean;
    selected?: boolean;
    onClick: (e: React.MouseEvent) => void;
    onKeyDown: (e: React.KeyboardEvent) => void;
    num?: number;
    pos?: Position;
}

const Cell = ({
    value,
    pencils,
    given,
    selected,
    onClick,
    onKeyDown,
    num,
    pos,
    focus,
    highlighted,
    onFocus,
    onMouseEnter,
}: CellProps) => {
    const btn = useRef<HTMLButtonElement>(undefined!);

    useEffect(() => {
        if (focus) {
            btn.current.focus();
        }
    }, [focus]);

    return (
        <button
            ref={btn}
            className={cx(
                'cell',
                given && 'cell--given',
                value && 'cell--filled',
                selected && 'cell--selected',
                highlighted && 'cell--highlighted'
            )}
            onClick={onClick}
            onKeyDown={onKeyDown}
            onFocus={onFocus}
            onMouseEnter={onMouseEnter}
        >
            {value ? (
                <span className="cell__value">{value}</span>
            ) : (
                new Array(9).fill(0).map((_, i) => (
                    <span className={`cell__pencil pencil-${i + 1}`} key={i}>
                        {pencils?.includes(i + 1) ? i + 1 : <>&nbsp;</>}
                    </span>
                ))
            )}
            {num !== undefined && <span className="cell__num">{num}</span>}
            {pos !== undefined && (
                <span className="cell__pos">{`{${pos.x}, ${pos.y}}`}</span>
            )}
        </button>
    );
};

export default Cell;
