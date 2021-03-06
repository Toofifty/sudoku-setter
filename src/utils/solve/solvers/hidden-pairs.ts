import { CellSolver } from './types';
import { getCellAt } from '../../sudoku';
import { isFilled, row, column, box, getMarks } from '../helper';
import { MarkedCell } from '../../../types';

export const solveHiddenPairs: CellSolver = (cell, i, board) => {
    const pos = getCellAt(i);

    if (isFilled(cell)) return cell;

    // n boxes have only the same n digits markled in -
    // in this case, remove them from the other cells
    // (rows/columns/boxes)
    [
        row(board, pos, true),
        column(board, pos, true),
        box(board, pos, true),
    ].forEach((cells, k) => {
        const ownIndex = cells.indexOf(cell);

        let matchIndex = 0;
        let matchingDigits: number[] = [];
        for (let n of cell.marks) {
            // if anything previous has the digit,
            // skip straight away
            const alreadyTested = cells
                .filter((_, j) => j < ownIndex)
                .some((other) => !isFilled(other) && other.marks.includes(n));
            if (alreadyTested) continue;

            const hasMatch =
                cells
                    .filter((_, j) => j > ownIndex)
                    .filter(
                        // eslint-disable-next-line no-loop-func
                        (other, j) =>
                            !isFilled(other) &&
                            getMarks(other).includes(n) &&
                            (matchIndex = j + ownIndex + 1)
                    ).length === 1;

            if (hasMatch) {
                // check if a larger mark
                // is also constrained
                for (let m of cell.marks.filter((m) => m > n)) {
                    // if anything previous has the digit,
                    // skip straight away
                    const alreadyTested = cells
                        .filter((_, j) => j < ownIndex)
                        .some(
                            (other) =>
                                !isFilled(other) && other.marks.includes(m)
                        );
                    if (alreadyTested) continue;

                    let matchIndex2 = 0;
                    const hasSecondMatch =
                        cells
                            .filter((_, j) => j > ownIndex)
                            .filter(
                                (other, j) =>
                                    !isFilled(other) &&
                                    getMarks(other).includes(m) &&
                                    (matchIndex2 = j + ownIndex + 1)
                            ).length === 1;

                    if (hasSecondMatch && matchIndex === matchIndex2) {
                        matchingDigits = [n, m];
                        break;
                    }
                }
            }

            if (matchingDigits.length > 0) break;
        }

        if (matchingDigits.length > 0) {
            cell.marks = [...matchingDigits];
            (cells[matchIndex] as MarkedCell).marks = [...matchingDigits];
        }
    });

    return cell;
};
