import { CellSolver } from './types';
import { isFilled, king, getValue } from '../helper';
import { getPosition } from 'utils/sudoku';

export const solveAntiKing: CellSolver = (cell, i, board) => {
    if (isFilled(cell)) return cell;

    const kingCells = king(board, getPosition(i)).map(getValue);
    cell.marks = cell.marks.filter((n) => !kingCells.includes(n));

    return cell;
};
