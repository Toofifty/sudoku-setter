import { CellSolver } from './types';
import { getCellAt } from '../../sudoku';
import { isFilled, row, column, box, getPencils } from '../helper';

export const solveNakedPairs: CellSolver = (cell, i, board) => {
    const pos = getCellAt(i);

    if (isFilled(cell)) return cell;

    if (cell.pencils.length === 2) {
        // n boxes have only the same n digits pencilled in -
        // in this case, remove them from the other cells
        // (rows/columns/boxes)
        [
            row(board, pos, true),
            column(board, pos, true),
            box(board, pos, true),
        ].forEach((cells, k) => {
            const ownIndex = cells.indexOf(cell);
            let matchIndex = 0;
            const hasPair = cells
                .filter((_, j) => j > ownIndex)
                .some((other, j) => {
                    const pencils = getPencils(other);
                    return (
                        !isFilled(other) &&
                        pencils.length === 2 &&
                        JSON.stringify(cell.pencils) ===
                            JSON.stringify(pencils) &&
                        (matchIndex = j + ownIndex + 1)
                    );
                });

            if (hasPair) {
                cells.forEach((other, j) => {
                    if (
                        !isFilled(other) &&
                        matchIndex !== j &&
                        j !== ownIndex
                    ) {
                        other.pencils = other.pencils.filter(
                            (n) => !cell.pencils.includes(n)
                        );
                    }
                });
            }
        });
    }
    return cell;
};
