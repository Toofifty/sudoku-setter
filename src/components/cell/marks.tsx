import React from 'react';
import cx from 'classnames';
import useSelector from 'hooks/use-selector';
import { isPlayModeSelector } from 'utils/selectors';

interface MarksProps {
    candidates: number[];
    invalidCandidates: number[];
    cornerMarks: number[];
    centreMarks: number[];
}

const sliceCornerMarks = (marks: number[]): number[][] => {
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
}: MarksProps) => {
    const isPlayMode = useSelector(isPlayModeSelector);

    const [cornerMarksTop, cornerMarksBottom] = sliceCornerMarks(cornerMarks);

    if (isPlayMode) {
        return (
            <>
                {cornerMarks.length > 0 && (
                    <div className="cell__corner-marks">
                        <div className="cell__corner-marks--top">
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
                            `len-${centreMarks.length}`
                        )}
                    >
                        {centreMarks.join('')}
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
