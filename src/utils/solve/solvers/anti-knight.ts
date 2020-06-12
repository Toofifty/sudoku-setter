import { CellSolver } from './types';
import { isFilled, knight, getValue } from '../helper';
import { getCellAt } from 'utils/sudoku';

export const solveAntiKnight: CellSolver = (cell, i, board) => {
    if (isFilled(cell)) return cell;

    const knightCells = knight(board, getCellAt(i)).map(getValue);
    cell.marks = cell.marks.filter((n) => !knightCells.includes(n));

    return cell;
};
