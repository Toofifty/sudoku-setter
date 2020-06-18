import React from 'react';
import cx from 'classnames';

interface MarksProps {
    candidates: number[];
    invalidCandidates: number[];
}

const Marks = ({ candidates, invalidCandidates }: MarksProps) => (
    <>
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
    </>
);

export default Marks;
