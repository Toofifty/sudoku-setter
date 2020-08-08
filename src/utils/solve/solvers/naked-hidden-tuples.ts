import { CellSolver } from './types';
import { regions, isFilled } from '../helper';
import { getCellAt } from 'utils/sudoku';

export const solveNakedHiddenTuples: CellSolver = (cell, i, board) => {
    const pos = getCellAt(i);

    if (isFilled(cell)) return cell;

    // hidden tuple:
    // if n numbers can only be placed into the same n cells in
    // the column/row/box, they are the only numbers that can
    // be placed in those cells

    // hidden tuple in r4 c7/8/9
    // http://localhost:3000/setter#G:7:8,11:8,12:9,13:7,19:7,1c:9,1d:8
    // 7/8/9 cannot be placed elsewhere in box 6

    // naked tuple:
    // if n cells only have a subset of n numbers as candidates
    // in the column/row/box, then no other cells in the
    // column/row/box can contain those n numbers
    // 2 ≤ n ≤ 5

    // naked tuple in r4 c7/8/9
    // http://localhost:3000/setter#G:7:8,r:1,s:2,t:3,u:4,v:5,w:6
    // 7/8/9 cannot be placed elsewhere in box 6

    // Naked pairs already has a solver, and we want this to be
    // different to allow for controlling the difficulty of the
    // puzzle
    if (cell.marks.length >= 3 && cell.marks.length <= 6) {
        // check all other cells in the regions to find which have a subset
        // of the first cell's candidates
        regions(board, pos).forEach((cells) => {
            // find the cells with a subset of the original's candidates
            const tupleCells = cells.filter(
                (other) =>
                    other.marks.length <= cell.marks.length &&
                    other.marks.every((mark) => cell.marks.includes(mark))
            );

            // if the number of cells found (+1 for the original cell) ==
            // the number of candidates, they are a tuple
            if (tupleCells.length + 1 === cell.marks.length) {
                // remove the candidates from other cells in the regions
                cells
                    .filter(
                        (other) =>
                            !tupleCells.includes(other) && !isFilled(other)
                    )
                    .forEach((other) => {
                        other.marks = other.marks.filter(
                            (n) => !cell.marks.includes(n)
                        );
                    });
            }
        });
    }

    return cell;
};
