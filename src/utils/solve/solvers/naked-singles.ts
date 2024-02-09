import { getPosition } from '../../sudoku';
import { box, column, getValue, row } from '../helper';
import { InterCell } from '../types';
import { Position } from '../../../types';

import { CellSolver } from './types';

/**
 * Solves naked-singles by removing conflicting candidates
 *
 * repro: #G:10:1,11:2,12:3,13:4,15:6,16:7,17:8,18:9
 */
export const solveNakedSingles: CellSolver = (cell, i, board) => {
    const pos = getPosition(i);
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
