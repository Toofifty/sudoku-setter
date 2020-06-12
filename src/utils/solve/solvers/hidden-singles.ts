import { CellSolver } from './types';
import { getCellAt } from '../../sudoku';
import { isFilled, row, column, box, getMarks } from '../helper';

export const solveHiddenSingles: CellSolver = (cell, i, board) => {
    const pos = getCellAt(i);
    if (isFilled(cell) && cell.given) return cell;

    const cellSets = [row(board, pos), column(board, pos), box(board, pos)];

    for (let n of cell.marks) {
        for (let cells of cellSets) {
            if (cells.map(getMarks).every((marks) => !marks.includes(n))) {
                const k = cellSets.indexOf(cells);
                if (cell.value !== n) {
                    console.log(
                        `narrow (${['row', 'column', 'box'][k]}): placing`,
                        n,
                        'at',
                        i
                    );
                }
                return { ...cell, marks: [n] };
            }
        }
    }

    return cell;
};
