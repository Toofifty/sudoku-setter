import { InterCell } from './types';
import { getCellAt } from '../sudoku';
import { row, column, box, getPencils, isFilled } from './helper';
import { PencilledCell } from '../../types';

type Solver = (cell: InterCell, i: number, board: InterCell[]) => InterCell;

export const solveGroups = (inter: InterCell[]): InterCell[] =>
    inter.map(solvePairs);

export const solvePairs: Solver = (cell, i, board) => {
    const pos = getCellAt(i);

    if (isFilled(cell)) return cell;

    if (cell.pencils.length === 2) {
        // check inclusive pairs
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

        // can't have an inclusive & exclusive pair
        // so don't check
        return cell;
    }

    // check exclusive pairs
    // n boxes are the only places that n digits can go -
    // in this case, remove other digits from the boxes
    [
        row(board, pos, true),
        column(board, pos, true),
        box(board, pos, true),
    ].forEach((cells, k) => {
        const ownIndex = cells.indexOf(cell);

        let matchIndex = 0;
        let matchingDigits: number[] = [];
        for (let n of cell.pencils) {
            // if anything previous has the digit,
            // skip straight away
            const alreadyTested = cells
                .filter((_, j) => j < ownIndex)
                .some((other) => !isFilled(other) && other.pencils.includes(n));
            if (alreadyTested) continue;

            const hasMatch =
                cells
                    .filter((_, j) => j > ownIndex)
                    .filter(
                        // eslint-disable-next-line no-loop-func
                        (other, j) =>
                            !isFilled(other) &&
                            getPencils(other).includes(n) &&
                            (matchIndex = j + ownIndex + 1)
                    ).length === 1;

            if (hasMatch) {
                // check if a larger pencil mark
                // is also constrained
                for (let m of cell.pencils.filter((m) => m > n)) {
                    // if anything previous has the digit,
                    // skip straight away
                    const alreadyTested = cells
                        .filter((_, j) => j < ownIndex)
                        .some(
                            (other) =>
                                !isFilled(other) && other.pencils.includes(m)
                        );
                    if (alreadyTested) continue;

                    let matchIndex2 = 0;
                    const hasSecondMatch =
                        cells
                            .filter((_, j) => j > ownIndex)
                            .filter(
                                (other, j) =>
                                    !isFilled(other) &&
                                    getPencils(other).includes(m) &&
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
            cell.pencils = [...matchingDigits];
            (cells[matchIndex] as PencilledCell).pencils = [...matchingDigits];
        }
    });

    return cell;
};
