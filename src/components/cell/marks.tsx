import React from 'react';
import cx from 'classnames';

import useSelector from 'hooks/use-selector';
import { isPlayModeSelector } from 'utils/selectors';

interface MarksProps {
    candidates: number[];
    invalidCandidates: number[];
    cornerMarks: number[];
    centreMarks: number[];
    topLeftBlocked?: boolean;
}

const sliceCornerMarks = (
    marks: number[],
    topLeftBlocked?: boolean
): number[][] => {
    if (topLeftBlocked) {
        if (marks.length === 1) {
            return [marks, []];
        }

        return [
            marks.slice(0, Math.floor(marks.length / 2)),
            marks.slice(Math.floor(marks.length / 2)),
        ];
    }

    if (marks.length < 3) {
        return [marks, []];
    }
    return [
        marks.slice(0, Math.ceil(marks.length / 2)),
        marks.slice(Math.ceil(marks.length / 2)),
    ];
};

const Marks = ({
    candidates,
    invalidCandidates,
    cornerMarks,
    centreMarks,
    topLeftBlocked,
}: MarksProps) => {
    const isPlayMode = useSelector(isPlayModeSelector);

    const [cornerMarksTop, cornerMarksBottom] = sliceCornerMarks(
        cornerMarks,
        topLeftBlocked
    );

    const hasManyCornerMarks = cornerMarks.length > 4;
    const hasManyCentreMarks = centreMarks.length > 4;

    if (isPlayMode) {
        return (
            <>
                {cornerMarks.length > 0 && (
                    <div
                        className={cx(
                            'cell__corner-marks',
                            hasManyCornerMarks && 'cell__corner-marks--many'
                        )}
                    >
                        <div className="cell__corner-marks--top">
                            {topLeftBlocked && <span style={{ width: 20 }} />}
                            {cornerMarksTop.map((n) => (
                                <span key={n}>{n}</span>
                            ))}
                        </div>
                        <div className="cell__corner-marks--bottom">
                            {cornerMarksBottom.map((n) => (
                                <span key={n}>{n}</span>
                            ))}
                        </div>
                    </div>
                )}
                {centreMarks.length > 0 && (
                    <div
                        className={cx(
                            'cell__centre-marks',
                            hasManyCentreMarks && 'cell__centre-marks--many'
                        )}
                    >
                        {centreMarks.map((n) => (
                            <span key={n}>{n}</span>
                        ))}
                    </div>
                )}
            </>
        );
    }

    // solution
    return (
        <div className="cell__candidates">
            {Array(9)
                .fill(0)
                .map((_, i) => (
                    <span
                        className={cx(
                            `cell__mark mark-${i + 1}`,
                            invalidCandidates.includes(i + 1) &&
                                'cell__mark--invalid'
                        )}
                        key={i}
                    >
                        {candidates?.includes(i + 1) ? i + 1 : <>&nbsp;</>}
                    </span>
                ))}
        </div>
    );
};

export default Marks;
