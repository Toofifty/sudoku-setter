import { getPosition } from '../../sudoku';
import { getMarks, isFilled, regions } from '../helper';
import { InterCell } from '../types';

import { CellSolver } from './types';
import { SolveHistory } from './history';

/**
 * Solves hidden-singles by determining if this is the only cell
 * in the row/column/box that can accept the candidate.
 *
 * repro: #G:7:2,i:2,s:2,13:2,1f:2,1k:2,1v:2,28:2
 */
export const solveHiddenSingles =
    (history: SolveHistory): CellSolver =>
    (cell, i, board) => {
        const pos = getPosition(i);
        if (isFilled(cell) && cell.given) return cell;
        if (cell.marks.length === 1) return cell;

        for (const cells of regions(board, pos)) {
            const marks = checkHiddenSingles(cell, cells);

            if (marks.length === 1) {
                history.push({
                    algorithm: 'hidden-singles',
                    affected: [i],
                    digit: marks[0],
                });
                return { ...cell, marks };
            }
        }

        return cell;
    };

export const checkHiddenSingles = (cell: InterCell, cells: InterCell[]) => {
    const cellMarks = cells.map(getMarks);
    for (const n of cell.marks) {
        if (cellMarks.every((marks) => !marks.includes(n))) {
            return [n];
        }
    }
    return cell.marks;
};
