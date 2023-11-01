import { InterCell } from '../types';

export type CellSolver = (
    cell: InterCell,
    i: number,
    board: InterCell[]
) => InterCell;

export type SolveStep =
    | {
          algorithm: string;
          affected: number[];
      } & (
          | {
                placed: number;
            }
          | {
                removedCandidates: number[];
                reason: string;
            }
      );

export type SolveHistory = SolveStep[];
