import { SolverState } from 'reducers/solver';

export type InterCell = {
    value?: number;
    given: boolean;
    marks: number[];
    initialMarks: number[];
    index: number;
    invalidMarks?: number[];
    color?: string;
};

export type SolvePayload = {
    board: InterCell[];
    thermos?: number[][];
    killerCages?: { total: number; cage: number[] }[];
    stepSolve: boolean;
    algorithms: SolverState['algorithms'];
};
