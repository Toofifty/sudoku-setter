export type FilledCell = {
    value: number;
    given: boolean;
};

export type MarkedCell = {
    marks: number[];
    given: boolean;
};

export type ICell = FilledCell | MarkedCell;

export type Position = { x: number; y: number };

export type PuzzleCell = {
    value?: number;
    given: boolean;
    color?: string;
};

export type SolutionCell = {
    value?: number;
    candidates: number[];
    invalidCandidates: number[];
};
