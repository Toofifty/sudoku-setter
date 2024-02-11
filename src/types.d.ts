export type FilledCell = {
    value: number;
    given: boolean;
};

export type MarkedCell = {
    marks: number[];
    given: boolean;
};

export type Position = { x: number; y: number };

export type PuzzleCell = {
    value?: number;
    color: string;
};

export type SolutionCell = {
    value?: number;
    candidates: number[];
    invalidCandidates: number[];
    color?: string;
};

export type PlayerCell = {
    value?: number;
    cornerMarks: number[];
    centreMarks: number[];
    color: string;
};

/**
 * A cell containing a digit that can see another
 * cell with the same value
 */
export type DigitError = {
    type: 'digit';
    index: number;
    sees?: number[];
};

/**
 * A cell containing a candidate that can see antoher
 * cell with the same value
 */
export type CandidateError = {
    type: 'candidate';
    index: number;
    candidate: number;
    sees?: number[];
};

/**
 * A cell containing a digit that is impossible due
 * to some special constraint
 */
export type ConstraintDigitError = {
    type: 'constraint-digit';
    index: number;
    reason?: string;
};

/**
 * A cell containing a candidate that is impossible due
 * to some special constraint
 */
export type ConstraintCandidateError = {
    type: 'constraint-candidate';
    index: number;
    candidate: number;
    reason?: string;
};

export type CellError =
    | DigitError
    | CandidateError
    | ConstraintDigitError
    | ConstraintCandidateError;
