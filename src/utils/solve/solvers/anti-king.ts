import { getPosition } from 'utils/sudoku';

import { getValue, isFilled, king } from '../helper';

import { CellSolver } from './types';

export const solveAntiKing: CellSolver = (cell, i, board) => {
    if (isFilled(cell)) return cell;

    const kingCells = king(board, getPosition(i)).map(getValue);
    cell.marks = cell.marks.filter((n) => !kingCells.includes(n));

    return cell;
};
