import { CellSolver } from './types';
import { getCellAt } from '../../sudoku';
import { isFilled, getMarks, regions } from '../helper';

export const solveNakedPairs: CellSolver = (cell, i, board) => {
    const pos = getCellAt(i);

    if (isFilled(cell)) return cell;

    if (cell.marks.length === 2) {
        // @see naked-tuples
        regions(board, pos, true).forEach((cells, k) => {
            const ownIndex = cells.indexOf(cell);
            let matchIndex = 0;
            const hasPair = cells
                .filter((_, j) => j > ownIndex)
                .some((other, j) => {
                    const marks = getMarks(other);
                    return (
                        !isFilled(other) &&
                        marks.length === 2 &&
                        JSON.stringify(cell.marks) === JSON.stringify(marks) &&
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
                        other.marks = other.marks.filter(
                            (n) => !cell.marks.includes(n)
                        );
                    }
                });
            }
        });
    }
    return cell;
};
