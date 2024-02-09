import { KillerCage } from 'utils/sudoku-types';
import { except, range, sum } from 'utils';

import { isFilled } from '../helper';
import { InterCell } from '../types';

import { CellSolver } from './types';

const validOptions = (total: number, cells: number, perm: number[] = []) => {
    const valid: number[][] = [];
    for (const n of range((perm[perm.length - 1] ?? 0) + 1, 10)) {
        const newPerm = [...perm, n];
        const permSum = sum(newPerm);

        if (newPerm.length === cells && permSum === total) {
            valid.push(newPerm);
        } else if (newPerm.length < cells && permSum < total) {
            valid.push(...validOptions(total, cells, newPerm));
        }
    }
    return valid;
};

const canFillCage = (options: number[], cage: InterCell[]) => {
    if (cage.length === 1)
        return (
            cage[0].value === options[0] || cage[0].marks.includes(options[0])
        );

    for (const option of options) {
        // "place" the digit in the first cage possible
        // - then recurse with the new set of options
        // and cells
        const target =
            // if it's already placed, use that always
            cage.find(({ value }) => value === option) ||
            // otherwise just find the first one with the mark
            cage.find(({ marks }) => marks.includes(option));

        if (!target) return false;

        const newOptions = except(options, option);
        const newCage = except(cage, target);

        if (canFillCage(newOptions, newCage)) return true;
    }
    return false;
};

export const solveKillerCages =
    (killerCages: KillerCage[]): CellSolver =>
    (cell, i, board) => {
        if (isFilled(cell)) return cell;

        for (const { total, cage } of killerCages.filter(({ cage }) =>
            cage.includes(i)
        )) {
            const options = validOptions(total, cage.length);
            const otherCells = except(cage, i).map((index) => board[index]);

            cell.marks = cell.marks.filter((n) =>
                options.some((option) => {
                    if (!option.includes(n)) return false;
                    if (option.length === 1) return true;

                    // ensure other caged cells can contain the
                    // other options
                    const otherOptions = except(option, n);
                    return canFillCage(otherOptions, otherCells);
                })
            );
        }

        return cell;
    };
