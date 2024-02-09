import { Thermo } from 'utils/sudoku-types';

import { isFilled } from '../helper';

import { CellSolver } from './types';

export const solveThermos =
    (thermos: Thermo[]): CellSolver =>
    (cell, i, board) => {
        for (const thermo of thermos) {
            const thermoIndex = thermo.indexOf(i);

            if (thermoIndex === -1) continue;

            // this cell must be strictly greater than it's index
            // on the thermo.
            cell.marks = cell.marks.filter((n) => n > thermoIndex);

            // this cell must be less than or equal to 9 minus
            // it's distance to the end of the thermo
            const inverseIndex = thermo.length - 1 - thermoIndex;
            cell.marks = cell.marks.filter((n) => n <= 9 - inverseIndex);

            const preceding = thermo
                .slice(0, thermoIndex)
                .map((index) => board[index]);

            const following = thermo
                .slice(thermoIndex + 1)
                .map((index) => board[index]);

            // the cell must be greater than the minimum mark (or final value)
            // of all preceding cells on the thermo
            const largestPreceding = Math.max(
                ...preceding.map((c) =>
                    isFilled(c) ? c.value : Math.min(...c.marks)
                )
            );
            cell.marks = cell.marks.filter((n) => n > largestPreceding);

            // the cell must be less than the maximum mark (or final value)
            // of all following cells on the thermo
            const smallestFollowing = Math.min(
                ...following.map((c) =>
                    isFilled(c) ? c.value : Math.max(...c.marks)
                )
            );
            cell.marks = cell.marks.filter((n) => n < smallestFollowing);
        }

        return cell;
    };
