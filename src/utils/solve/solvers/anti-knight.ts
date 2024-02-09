import { getPosition } from 'utils/sudoku';

import { getValue, isFilled, knight } from '../helper';

import { CellSolver } from './types';

export const solveAntiKnight: CellSolver = (cell, i, board) => {
    if (isFilled(cell)) return cell;

    const knightCells = knight(board, getPosition(i)).map(getValue);
    cell.marks = cell.marks.filter((n) => !knightCells.includes(n));

    // TODO:
    // solve anti-knight locked candidates
    // if all of the cells with n locked in them
    // in the box, column or row see the same cell
    // by knight's move or sudoku, then n can be
    // removed from that cell's candidates
    // might be solved via lookaheads, so I'll try
    // that first

    return cell;
};
