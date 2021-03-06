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
    given: boolean;
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
    invalid?: boolean;
    color: string;
};
