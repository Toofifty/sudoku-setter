import { CellSolver } from './types';
import { getCellAt } from '../../sudoku';
import { isFilled, column, row, box, getValue } from '../helper';
import { InterCell } from '../types';
import { Position } from '../../../types';

const NUMS = [1, 2, 3, 4, 5, 6, 7, 8, 9];

export const solveNakedSingles = (setInitial = false): CellSolver => (
    cell,
    i,
    board
) => {
    const pos = getCellAt(i);

    const pencils =
        isFilled(cell) && cell.given
            ? []
            : (!isFilled(cell) ? cell.pencils : NUMS).filter(
                  (n) => !breaksSudoku(board, pos, n)
              );

    return {
        ...cell,
        index: i,
        pencils,
        initialPencils: setInitial
            ? isFilled(cell)
                ? pencils
                : cell.pencils
            : cell.initialPencils,
    };
};

const breaksSudoku = (board: InterCell[], pos: Position, n: number) =>
    inColumn(board, pos, n) || inRow(board, pos, n) || inBox(board, pos, n);

const inColumn = (board: InterCell[], pos: Position, n: number) =>
    column(board, pos).map(getValue).includes(n);

const inRow = (board: InterCell[], pos: Position, n: number) =>
    row(board, pos).map(getValue).includes(n);

const inBox = (board: InterCell[], pos: Position, n: number) =>
    box(board, pos).map(getValue).includes(n);
