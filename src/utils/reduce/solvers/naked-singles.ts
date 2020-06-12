import { CellSolver } from './types';
import { getCellAt } from '../../sudoku';
import { isFilled, column, row, box, getValue } from '../helper';
import { InterCell } from '../types';
import { Position } from '../../../types';

const NUMS = [1, 2, 3, 4, 5, 6, 7, 8, 9];

export const solveNakedSingles = (initial = false): CellSolver => {
    let workingBoard: InterCell[] | undefined;

    return (cell, i, board) => {
        if (!workingBoard) workingBoard = board;

        const pos = getCellAt(i);

        const marks =
            isFilled(cell) && cell.given
                ? []
                : (!isFilled(cell) ? cell.marks : NUMS).filter(
                      (n) => !breaksSudoku(workingBoard!, pos, n)
                  );

        const newCell = {
            ...cell,
            value: cell.value ?? (marks.length === 1 ? marks[0] : undefined),
            index: i,
            marks,
            initialMarks: initial
                ? isFilled(cell)
                    ? marks
                    : cell.marks
                : cell.initialMarks,
        };

        workingBoard[i] = newCell;

        return newCell;
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
