import React, { useRef, useEffect } from 'react';
import cx from 'classnames';
import useContextMenu from 'hooks/use-context-menu';
import useSelector from 'hooks/use-selector';
import CellContextMenu from './cell-context-menu';
import './cell.scss';
import { isSetModeSelector } from 'utils/selectors';
import Marks from './marks';

interface CellProps {
    index: number;
    value?: number;
    candidates?: number[];
    invalidCandidates?: number[];
    cornerMarks?: number[];
    centreMarks?: number[];
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
    candidates = [],
    invalidCandidates = [],
    given,
    selection,
    onMouseDown,
    onKeyDown,
    index,
    focused,
    highlighted,
    onFocus,
    onMouseEnter,
    onCreateKillerCage,
}: CellProps) => {
    const isSetMode = useSelector(isSetModeSelector);
    const debugMode = useSelector((state) => state.ui.debugMode);
    const hideSolution = useSelector((state) => state.ui.hideSolution);
    const btn = useRef<HTMLButtonElement>(null!);

    useEffect(() => {
        if (focused) {
            btn.current.focus();
        }
    }, [focused]);

    const onContextMenu = useContextMenu(
        !!focused,
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
                isSetMode && !value && candidates.length === 0 && 'cell--empty'
            )}
            onContextMenu={onContextMenu}
            onKeyDown={onKeyDown}
            onFocus={onFocus}
            onPointerDown={onMouseDown}
            onPointerMove={(e) => {
                onMouseEnter?.(e);
                (e.target as any).releasePointerCapture(e.pointerId);
            }}
        >
            {(!hideSolution || given) &&
                (value ? (
                    <span className="cell__value">{value}</span>
                ) : (
                    <Marks
                        candidates={candidates}
                        invalidCandidates={invalidCandidates}
                    />
                ))}
            {debugMode && <span className="cell__num">{index}</span>}
        </button>
    );
};

export default Cell;
