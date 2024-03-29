import { getBox, getPosition } from '../../sudoku';
import { box, column, isFilled, row } from '../helper';
import { range } from '../../misc';

import { CellSolver } from './types';

/**
 * Solve for "locked-candidates" - when the same digit is locked
 * to the same row/column in a single box, it cannot appear
 * in another box in that row/column.
 *
 * repro: #G:5:1,13:3,14:4,1c:5,1d:6
 */
export const solveLockedCandidates: CellSolver = (cell, i, board) => {
    const pos = getPosition(i);
    if (isFilled(cell) && cell.given) return cell;

    const boxCells = box(board, pos, true);
    const ownIndex = boxCells.indexOf(cell);

    // calculate indices of box contents
    // so we can avoid them later
    const currentBox = getBox(pos);
    const boxRow = range(currentBox.x * 3, (currentBox.x + 1) * 3 - 1);
    const boxColumn = range(currentBox.y * 3, (currentBox.y + 1) * 3 - 1);

    for (const n of cell.marks) {
        // short circuit if digit already marked
        // previously in box
        const alreadyTested = boxCells
            .filter((_, j) => j < ownIndex)
            .some((other) => !isFilled(other) && other.marks.includes(n));
        if (alreadyTested) continue;

        // get all positions of the digit marked
        // in the box
        const digitIndices = boxCells
            .map((other, j) => {
                if (j < ownIndex || isFilled(other) || !other.marks.includes(n))
                    return null;
                return j;
            })
            .filter((m) => m !== null);

        if (digitIndices.length < 2) continue;

        // test if they are in a row
        const inRow =
            allIncluded(digitIndices, [0, 1, 2]) ||
            allIncluded(digitIndices, [3, 4, 5]) ||
            allIncluded(digitIndices, [6, 7, 8]);

        if (inRow) {
            // remove marks from rest of row
            row(board, pos, false)
                .filter((_, j) => !boxRow.includes(j))
                .forEach((other) => {
                    if (!isFilled(other)) {
                        other.marks = other.marks.filter((m) => m !== n);
                    }
                });
        } else {
            const inColumn =
                allIncluded(digitIndices, [0, 3, 6]) ||
                allIncluded(digitIndices, [1, 4, 7]) ||
                allIncluded(digitIndices, [2, 5, 8]);

            if (inColumn) {
                // remove marks from rest of row
                column(board, pos, false)
                    .filter((_, j) => !boxColumn.includes(j))
                    .forEach((other) => {
                        if (!isFilled(other)) {
                            other.marks = other.marks.filter((m) => m !== n);
                        }
                    });
            }
        }
    }

    return cell;
};

const allIncluded = <T>(needle: T[], haystack: T[]): boolean =>
    needle.every((n) => haystack.includes(n));
