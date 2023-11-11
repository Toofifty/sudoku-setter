import { CellSolver } from './types';
import { getPosition } from '../../sudoku';
import { isFilled, getMarks, regions } from '../helper';
import { SolveHistory } from './history';

/**
 * Solves naked pairs by looking for paired cells with
 * identical candidates, and removing those candidates from
 * any cells in the same row/column/box
 *
 * repro: #!K:3:v,14
 */
export const solveNakedPairs =
    (history: SolveHistory): CellSolver =>
    (cell, i, board) => {
        const pos = getPosition(i);

        if (isFilled(cell)) return cell;

        if (cell.marks.length === 2) {
            // @see naked-tuples
            regions(board, pos, true).forEach((cells) => {
                const ownLocalIndex = cells.indexOf(cell);
                let pairLocalIndex = 0;
                const pairCell = cells.find((other, otherLocalIndex) => {
                    const marks = getMarks(other);
                    return (
                        otherLocalIndex > ownLocalIndex &&
                        marks.length === 2 &&
                        JSON.stringify(cell.marks) === JSON.stringify(marks) &&
                        (pairLocalIndex = otherLocalIndex)
                    );
                });

                if (pairCell !== undefined) {
                    const affected: number[] = [];
                    cells.forEach((other, otherLocalIndex) => {
                        if (
                            !isFilled(other) &&
                            otherLocalIndex !== pairLocalIndex &&
                            otherLocalIndex !== ownLocalIndex &&
                            (other.marks.includes(cell.marks[0]) ||
                                other.marks.includes(cell.marks[1]))
                        ) {
                            affected.push(other.index);
                            other.marks = other.marks.filter(
                                (n) => !cell.marks.includes(n)
                            );
                        }
                    });

                    if (affected.length > 0) {
                        history.push({
                            algorithm: 'naked-pairs',
                            affected,
                            removedCandidates: cell.marks,
                            reason: `${cell.marks.join('-')} pair`,
                            culprits: [i, pairCell.index],
                        });
                    }
                }
            });
        }
        return cell;
    };
