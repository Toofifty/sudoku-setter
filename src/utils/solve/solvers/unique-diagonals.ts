import { CellSolver } from './types';
import { diagonals, getValue } from '../helper';
import { getCellAt } from 'utils/sudoku';
import { checkHiddenSingles } from './hidden-singles';

export const solveUniqueDiagonals: CellSolver = (cell, i, board) => {
    const pos = getCellAt(i);
    const diags = diagonals(board, pos);
    const sees = diags.flat().map(getValue);

    // naked singles
    cell.marks = cell.marks.filter((n) => !sees.includes(n));
    if (cell.marks.length === 1) return cell;

    // hidden singles
    for (let diag of diags) {
        if (cell.marks.length === 1) break;

        const marks = checkHiddenSingles(
            cell,
            diag.filter((c) => c !== cell)
        );

        if (marks.length === 1) return { ...cell, marks };
    }

    return cell;
};
