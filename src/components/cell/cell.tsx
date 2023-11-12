import React, { useRef, useEffect } from 'react';
import cx from 'classnames';
import useSelector from 'hooks/use-selector';
import { isSetModeSelector } from 'utils/selectors';
import Marks from './marks';
import './cell.scss';

interface CellProps {
    index: number;
    value?: number;
    candidates?: number[];
    invalidCandidates?: number[];
    cornerMarks?: number[];
    centreMarks?: number[];
    topLeftBlocked?: boolean;
    given: boolean;

    selection: number[];
    highlighted?: boolean;
    focused?: boolean;
    targetValue: number;
}

const Cell = ({
    value,
    candidates = [],
    invalidCandidates = [],
    cornerMarks = [],
    centreMarks = [],
    topLeftBlocked,
    given,
    selection,
    index,
    focused,
    highlighted,
    targetValue,
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

    const selected = selection.includes(index);
    const matches =
        value === targetValue ||
        cornerMarks.includes(targetValue) ||
        centreMarks.includes(targetValue);

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
                        topLeftBlocked={topLeftBlocked}
                    />
                ))}
            {debugMode && <span className="cell__num">{index}</span>}
        </button>
    );
};

export default Cell;
