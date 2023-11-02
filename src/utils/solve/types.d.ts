import { SolverState } from 'reducers/solver';
import { Arrow, KillerCage, Thermo } from 'utils/sudoku-types';

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
    thermos?: Thermo[];
    arrows?: Arrow[];
    killerCages?: KillerCage[];
    stepSolve: boolean;
    algorithms: SolverState['algorithms'];
};
