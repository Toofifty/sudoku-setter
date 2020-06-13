import { CellSolver } from './types';
import { getCellAt, getBox } from '../../sudoku';
import { isFilled, box, row, column } from '../helper';
import { range } from '../../misc';

export const solveLockedCandidates: CellSolver = (cell, i, board) => {
    const pos = getCellAt(i);
    if (isFilled(cell) && cell.given) return cell;

    const cells = box(board, pos, true);
    const ownIndex = cells.indexOf(cell);

    // calculate indices of box contents
    // so we can avoid them later
    const currentBox = getBox(pos);
    const boxRow = range(currentBox.x * 3, (currentBox.x + 1) * 3);
    const boxColumn = range(currentBox.y * 3, (currentBox.y + 1) * 3);

    for (let n of cell.marks) {
        // short circuit if digit already markled
        // previously in box
        const alreadyTested = cells
            .filter((_, j) => j < ownIndex)
            .some((other) => !isFilled(other) && other.marks.includes(n));
        if (alreadyTested) continue;

        // get all positions of the digit markled
        // in the box
        const digitIndices = cells
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
            // console.log(
            //     'locked row for',
            //     n,
            //     'in',
            //     pos.y,
            //     digitIndices.join(','),
            //     'in box',
            //     JSON.stringify(currentBox)
            // );
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
                // console.log(
                //     'locked column for',
                //     n,
                //     'in',
                //     pos.x,
                //     digitIndices.join(','),
                //     'in box',
                //     JSON.stringify(currentBox)
                // );
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
