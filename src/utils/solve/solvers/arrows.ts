import { Arrow } from 'utils/sudoku-types';
import { getBoxIndex } from 'utils/sudoku';

import { isFilled } from '../helper';

import { SolveHistory } from './history';
import { CellSolver } from './types';

const sameColumn = (aIndex: number, bIndex: number) =>
    aIndex % 9 === bIndex % 9;

const sameRow = (aIndex: number, bIndex: number) =>
    Math.floor(aIndex / 9) === Math.floor(bIndex / 9);

const sameBox = (aIndex: number, bIndex: number) =>
    getBoxIndex(aIndex) === getBoxIndex(bIndex);

const sees = (aIndex: number, bIndex: number) =>
    sameColumn(aIndex, bIndex) ||
    sameRow(aIndex, bIndex) ||
    sameBox(aIndex, bIndex);

const getAllSums = (inCellIndices: number[], inCandidates: number[][]) => {
    if (inCellIndices.length === 1 || inCandidates.length === 1) {
        return inCandidates[0];
    }

    // prevent writing to original candidates list
    const cellIndices = [...inCellIndices];
    const candidates = inCandidates.map((c) => [...c]);

    const sums: number[] = [];
    const thisIndex = cellIndices.shift()!;
    const thisCandidates = candidates.shift()!;

    for (const n of thisCandidates) {
        // filter this value out of other "seen" cell candidates
        const otherCandidates = candidates.map((c, i) =>
            sees(thisIndex, cellIndices[i]) ? c.filter((x) => x !== n) : c
        );
        getAllSums(cellIndices, otherCandidates).forEach((sum) => {
            sums.push(n + sum);
        });
    }

    return sums;
};

export const solveArrows =
    (history: SolveHistory, arrows: Arrow[]): CellSolver =>
    (cell, i, board) => {
        if (isFilled(cell)) return cell;

        // heads
        for (const arrow of arrows.filter(({ head }) => head.includes(i))) {
            const tail = arrow.tail.map((index) => board[index]);

            const sums = getAllSums(
                arrow.tail,
                tail.map((cell) => cell.marks)
            );

            if (cell.marks.some((n) => !sums.includes(n))) {
                history.push({
                    algorithm: 'arrow-sudoku',
                    affected: [cell.index],
                    removedCandidates: cell.marks.filter(
                        (n) => !sums.includes(n)
                    ),
                    reason: 'not being possible sums of the arrow',
                    culprits: arrow.tail,
                });
                cell.marks = cell.marks.filter((n) => sums.includes(n));
            }
        }

        // tails
        for (const arrow of arrows.filter(({ tail }) => tail.includes(i))) {
        }

        // arrow:
        // get maximum
        // get minimum
        // get all permutations

        // pill:
        return cell;
    };
