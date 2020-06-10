import { InterCell } from '../types';

export type CellSolver = (
    cell: InterCell,
    i: number,
    board: InterCell[]
) => InterCell;
