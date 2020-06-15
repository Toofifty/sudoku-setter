import { CellSolver } from './types';
import { getCellAt } from '../../sudoku';
import { isFilled, row, column, box, getMarks } from '../helper';
import { InterCell } from '../types';

export const solveHiddenSingles: CellSolver = (cell, i, board) => {
    const pos = getCellAt(i);
    if (isFilled(cell) && cell.given) return cell;
    if (cell.marks.length === 1) return cell;

    const cellSets = [row(board, pos), column(board, pos), box(board, pos)];

    for (let cells of cellSets) {
        const marks = checkHiddenSingles(cell, cells);

        if (marks.length === 1) return { ...cell, marks };
    }

    return cell;
};

export const checkHiddenSingles = (cell: InterCell, cells: InterCell[]) => {
    for (let n of cell.marks) {
        if (cells.map(getMarks).every((marks) => !marks.includes(n))) {
            return [n];
        }
    }
    return cell.marks;
};
