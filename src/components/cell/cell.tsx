import React, { useRef, useEffect } from 'react';
import cx from 'classnames';
import { Position } from 'types';
import useContextMenu from 'hooks/use-context-menu';
import useSelector from 'hooks/use-selector';
import useAction from 'hooks/use-action';
import { capture } from 'utils';
import CellContextMenu from './cell-context-menu';
import './cell.scss';

interface CellProps {
    index: number;
    pos: Position;
    value?: number;
    marks?: number[];
    given: boolean;

    selection: number[];
    highlighted?: boolean;
    focused?: boolean;
    onFocus?: () => void;
    onMouseEnter?: (e: React.MouseEvent) => void;
    onMouseDown: (e: React.MouseEvent) => void;
    onKeyDown: (e: React.KeyboardEvent) => void;

    onCreateKillerCage: () => void;
}

const Cell = ({
    value,
    marks,
    given,
    selection,
    onMouseDown,
    onKeyDown,
    index,
    pos,
    focused,
    highlighted,
    onFocus,
    onMouseEnter,
    onCreateKillerCage,
}: CellProps) => {
    const debugMode = useSelector((state) => state.ui.debugMode);
    const hideSolution = useSelector((state) => state.ui.hideSolution);
    const placeOnClick = useSelector((state) => state.ui.placeOnClick);
    const setValue = useAction('set-value');
    const btn = useRef<HTMLButtonElement>(null!);

    useEffect(() => {
        if (focused) {
            btn.current.focus();
        }
    }, [focused]);

    const onContextMenu = useContextMenu(
        <CellContextMenu
            index={index}
            selection={selection}
            onCreateKillerCage={onCreateKillerCage}
        />
    );

    const selected = selection.includes(index);

    return (
        <button
            ref={btn}
            className={cx(
                'cell',
                given && 'cell--given',
                value && 'cell--filled',
                (selected || focused) && 'cell--selected',
                focused && 'cell--focused',
                highlighted && 'cell--highlighted',
                !value && marks?.length === 0 && 'cell--empty'
            )}
            onMouseDown={onMouseDown}
            onContextMenu={onContextMenu}
            onKeyDown={onKeyDown}
            onFocus={onFocus}
            onMouseEnter={onMouseEnter}
        >
            {(!hideSolution || given) &&
                (value ? (
                    <span className="cell__value">{value}</span>
                ) : (
                    Array(9)
                        .fill(0)
                        .map((_, i) => (
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
                                        ? capture(() => {
                                              console.log('set valueee');
                                              return setValue({
                                                  cell: pos,
                                                  value: i + 1,
                                                  given: true,
                                              });
                                          })
                                        : undefined
                                }
                            >
                                {marks?.includes(i + 1) ? i + 1 : <>&nbsp;</>}
                            </span>
                        ))
                ))}
            {debugMode && <span className="cell__num">{index}</span>}
        </button>
    );
};

export default Cell;
