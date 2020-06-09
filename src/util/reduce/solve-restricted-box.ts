import { InterCell } from './types';
import { isFilled, box, row, column } from './helper';
import { getCellAt, getBox } from '../sudoku';
import { range } from '../misc';

export const solveRestrictedBox = (inter: InterCell[]): InterCell[] =>
    inter.map((cell, i, board) => {
        const pos = getCellAt(i);
        if (isFilled(cell) && cell.given) return cell;

        const cells = box(board, pos, true);
        const ownIndex = cells.indexOf(cell);

        // calculate indices of box contents
        // so we can avoid them later
        const currentBox = getBox(pos);
        const boxRow = range(currentBox.x * 3, (currentBox.x + 1) * 3);
        const boxColumn = range(currentBox.y * 3, (currentBox.y + 1) * 3);

        for (let n of cell.pencils) {
            // short circuit if digit already pencilled
            // previously in box
            const alreadyTested = cells
                .filter((_, j) => j < ownIndex)
                .some((other) => !isFilled(other) && other.pencils.includes(n));
            if (alreadyTested) continue;

            // get all positions of the digit pencilled
            // in the box
            const digitIndices = cells
                .map((other, j) => {
                    if (
                        j < ownIndex ||
                        isFilled(other) ||
                        !other.pencils.includes(n)
                    )
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
                console.log(
                    'restricted row for',
                    n,
                    'in',
                    pos.y,
                    digitIndices.join(',')
                );
                // remove pencil marks from rest of row
                row(board, pos, false)
                    .filter((_, j) => !boxRow.includes(j))
                    .forEach((other) => {
                        if (!isFilled(other)) {
                            other.pencils = other.pencils.filter(
                                (m) => m !== n
                            );
                        }
                    });
            } else {
                const inColumn =
                    allIncluded(digitIndices, [0, 3, 6]) ||
                    allIncluded(digitIndices, [1, 4, 7]) ||
                    allIncluded(digitIndices, [2, 5, 8]);

                if (inColumn) {
                    console.log(
                        'restricted column for',
                        n,
                        'in',
                        pos.y,
                        digitIndices.join(',')
                    );
                    // remove pencil marks from rest of row
                    column(board, pos, false)
                        .filter((_, j) => !boxColumn.includes(j))
                        .forEach((other) => {
                            if (!isFilled(other)) {
                                other.pencils = other.pencils.filter(
                                    (m) => m !== n
                                );
                            }
                        });
                }
            }
        }

        return cell;
    });

const allIncluded = <T>(needle: T[], haystack: T[]): boolean =>
    needle.every((n) => haystack.includes(n));
