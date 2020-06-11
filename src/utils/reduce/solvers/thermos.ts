import { CellSolver } from './types';
import { getValue } from '../helper';

export const solveThermos = (thermos: number[][]): CellSolver => (
    cell,
    i,
    board
) => {
    for (let thermo of thermos) {
        const thermoIndex = thermo.indexOf(i);

        if (thermoIndex === -1) continue;

        // predicate 1: this cell must be strictly greater than it's index
        // on the thermo.
        cell.marks = cell.marks.filter((n) => n > thermoIndex);

        // predicate 2: this cell must be less than or equal to 9 minus
        // it's distance to the end of the thermo
        const inverseIndex = thermo.length - 1 - thermoIndex;
        cell.marks = cell.marks.filter((n) => n <= 9 - inverseIndex);

        // predicate 3: the cell must be greater than anything
        // preceding it on the thermo
        const largestPreceding = Math.max(
            ...thermo
                .slice(0, thermoIndex)
                .map((index) => board[index])
                .map(getValue)
                .filter((n) => n > 0)
        );
        cell.marks = cell.marks.filter((n) => n > largestPreceding);

        // predicate 4: the cell must be less than anything
        // following it on the thermo
        const smallestFollowing = Math.min(
            ...thermo
                .slice(thermoIndex)
                .map((index) => board[index])
                .map(getValue)
                .filter((n) => n > 0)
        );
        cell.marks = cell.marks.filter((n) => n < smallestFollowing);

        // TODO: 5 & 6 there are m lower numbers than n preceding the cell,
        // and v higher numbers following the cell
    }

    return cell;
};
