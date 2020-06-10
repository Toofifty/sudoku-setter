import { CellSolver } from './types';
import { getCellAt } from '../../sudoku';
import { isFilled, row, column, box, getPencils } from '../helper';

export const solveHiddenSingles: CellSolver = (cell, i, board) => {
    const pos = getCellAt(i);
    if (isFilled(cell) && cell.given) return cell;

    const cellSets = [row(board, pos), column(board, pos), box(board, pos)];

    for (let n of cell.pencils) {
        for (let cells of cellSets) {
            if (
                cells.map(getPencils).every((pencils) => !pencils.includes(n))
            ) {
                const k = cellSets.indexOf(cells);
                if (cell.value !== n) {
                    console.log(
                        `narrow (${['row', 'column', 'box'][k]}): placing`,
                        n,
                        'at',
                        i
                    );
                }
                return { ...cell, pencils: [n] };
            }
        }
    }

    return cell;
};
