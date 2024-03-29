import { getCellIndex, getPosition } from 'utils/sudoku';

import { isFilled } from '../helper';

import { CellSolver } from './types';

const neighborOffsets = [
    [0, -1],
    [-1, 0],
    [1, 0],
    [0, 1],
];

export const solveNonSeqNeighbors: CellSolver = (cell, i, board) => {
    if (isFilled(cell)) return cell;

    const pos = getPosition(i);
    const neighbors = neighborOffsets
        .map(([x, y]) => ({ x: pos.x + x, y: pos.y + y }))
        .filter(({ x, y }) => x >= 0 && x < 9 && y >= 0 && y < 9)
        .map((p) => board[getCellIndex(p)]);

    cell.marks = cell.marks.filter((n) => {
        if (
            neighbors.some(
                (neighbor) =>
                    neighbor.value && Math.abs(neighbor.value - n) === 1
            )
        ) {
            return false;
        }
        return true;
    });

    return cell;
};
