import React, { useRef, useEffect } from 'react';
import cx from 'classnames';
import './cell.scss';
import { Position } from '../../types';
import useRightClick from '../../hooks/use-right-click';
import useSelector from 'hooks/use-selector';
import useAction from 'hooks/use-action';
import { capture } from 'utils';
import Thermo from 'components/thermo';

interface CellProps {
    value?: number;
    marks?: number[];
    given: boolean;

    focus?: boolean;
    onFocus?: () => void;
    onMouseEnter?: (e: React.MouseEvent) => void;
    highlighted?: boolean;
    selected?: boolean;
    selection: number[];
    onMouseDown: (e: React.MouseEvent) => void;
    onKeyDown: (e: React.KeyboardEvent) => void;
    num: number;
    pos?: Position;
}

const Cell = ({
    value,
    marks,
    given,
    selected,
    selection,
    onMouseDown,
    onKeyDown,
    num,
    pos,
    focus,
    highlighted,
    onFocus,
    onMouseEnter,
}: CellProps) => {
    const debugMode = useSelector((state) => state.ui.debugMode);
    const hideSolution = useSelector((state) => state.ui.hideSolution);
    const placeOnClick = useSelector((state) => state.ui.placeOnClick);
    const thermos = useSelector((state) => state.sudoku.thermos);
    const setValue = useAction('set-value');
    const createThermo = useAction('create-thermo');
    const deleteThermo = useAction('delete-thermo');
    const btn = useRef<HTMLButtonElement>(undefined!);

    useEffect(() => {
        if (focus) {
            btn.current.focus();
        }
    }, [focus]);

    const onRightClick = useRightClick(
        <>
            {pos ? (
                <li
                    className="divider"
                    data-content={`Cell r${pos.y + 1}c${pos.x + 1}`}
                />
            ) : (
                <li className="divider" data-content="Cell" />
            )}
            <li className="menu-item">
                <a href="#0">Begin thermo here</a>
            </li>
            <li className="menu-item">
                <a href="#0">Set colour</a>
            </li>
            {selection.length > 1 && (
                <>
                    <li
                        className="divider"
                        data-content={`Selection (${selection.length})`}
                    />
                    {selection.length <= 9 && (
                        <>
                            <li className="menu-item">
                                <button
                                    className="btn-fake-link"
                                    onClick={() => createThermo(selection)}
                                >
                                    Selection to thermo
                                </button>
                            </li>
                            <li className="menu-item">
                                <a href="#0">Selection to killer cage</a>
                            </li>
                        </>
                    )}
                    <li className="menu-item">
                        <a href="#0">Set colour</a>
                    </li>
                </>
            )}
            {thermos?.some((thermo) => thermo.includes(num)) && (
                <>
                    <li className="divider" data-content="Thermos" />
                    <li className="menu-item">
                        <button
                            className="btn-fake-link"
                            onClick={() => deleteThermo(num)}
                        >
                            Delete thermo
                        </button>
                    </li>
                </>
            )}
        </>
    );

    return (
        <button
            ref={btn}
            className={cx(
                'cell',
                given && 'cell--given',
                value && 'cell--filled',
                (selected || focus) && 'cell--selected',
                focus && 'cell--focused',
                highlighted && 'cell--highlighted',
                !value && marks?.length === 0 && 'cell--empty'
            )}
            onMouseDown={onMouseDown}
            onContextMenu={onRightClick}
            onKeyDown={onKeyDown}
            onFocus={onFocus}
            onMouseEnter={onMouseEnter}
        >
            <Thermo index={num} />
            {(!hideSolution || given) &&
                (value ? (
                    <span className="cell__value">{value}</span>
                ) : (
                    new Array(9).fill(0).map((_, i) => (
                        <span
                            className={cx(
                                `cell__mark mark-${i + 1}`,
                                placeOnClick &&
                                    marks?.includes(i + 1) &&
                                    'cell__mark--can-click'
                            )}
                            key={i}
                            onClick={
                                placeOnClick && pos
                                    ? capture(() =>
                                          setValue({
                                              cell: pos,
                                              value: i + 1,
                                              given: true,
                                          })
                                      )
                                    : undefined
                            }
                        >
                            {marks?.includes(i + 1) ? i + 1 : <>&nbsp;</>}
                        </span>
                    ))
                ))}
            {debugMode && <span className="cell__num">{num}</span>}
        </button>
    );
};

export default Cell;
