import { CellSolver } from './types';
import { getCellAt } from '../../sudoku';
import { column, row, box, getValue } from '../helper';
import { InterCell } from '../types';
import { Position } from '../../../types';

export const solveNakedSingles = (initial = false): CellSolver => (
    cell,
    i,
    board
) => {
    const pos = getCellAt(i);
    cell.marks = cell.marks.filter((n) => !breaksSudoku(board, pos, n));
    return cell;
};

const breaksSudoku = (board: InterCell[], pos: Position, n: number) =>
    inColumn(board, pos, n) || inRow(board, pos, n) || inBox(board, pos, n);

const inColumn = (board: InterCell[], pos: Position, n: number) =>
    column(board, pos).map(getValue).includes(n);

const inRow = (board: InterCell[], pos: Position, n: number) =>
    row(board, pos).map(getValue).includes(n);

const inBox = (board: InterCell[], pos: Position, n: number) =>
    box(board, pos).map(getValue).includes(n);
