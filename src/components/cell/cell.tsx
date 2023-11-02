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
    targetValue: number;
    onFocus?: () => void;
    onMouseEnter?: (e: React.MouseEvent) => void;
    onMouseDown: (e: React.MouseEvent) => void;
}

const Cell = ({
    value,
    candidates = [],
    invalidCandidates = [],
    cornerMarks = [],
    centreMarks = [],
    given,
    selection,
    onMouseDown,
    index,
    focused,
    highlighted,
    targetValue,
    onFocus,
    onMouseEnter,
}: CellProps) => {
    const isSetMode = useSelector(isSetModeSelector);
    const debugMode = useSelector((state) => state.ui.debugMode);
    const hideSolution = useSelector((state) => state.ui.hideSolution);
    const settings = useSelector((state) => state.player.settings);
    const btn = useRef<HTMLButtonElement>(null!);

    useEffect(() => {
        if (focused) {
            btn.current.focus();
        }
    }, [focused]);

    const onContextMenu = useContextMenu(
        !!focused,
        <CellContextMenu index={index} />
    );

    const selected = selection.includes(index);
    const matches =
        value === targetValue ||
        (isSetMode && candidates.includes(targetValue)) ||
        (!isSetMode &&
            (cornerMarks.includes(targetValue) ||
                centreMarks.includes(targetValue)));

    const incorrect = value && !candidates.includes(value);

    return (
        <button
            ref={btn}
            className={cx(
                'cell',
                given && 'cell--given',
                value && 'cell--filled',
                settings.highlightSelection && selected && 'cell--selected',
                isSetMode && focused && 'cell--focused',
                highlighted && 'cell--highlighted',
                matches && 'cell--matches',
                incorrect && 'cell--incorrect',
                isSetMode && !value && candidates.length === 0 && 'cell--empty'
            )}
            onContextMenu={onContextMenu}
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
                        cornerMarks={cornerMarks}
                        centreMarks={centreMarks}
                    />
                ))}
            {debugMode && <span className="cell__num">{index}</span>}
        </button>
    );
};

export default Cell;
