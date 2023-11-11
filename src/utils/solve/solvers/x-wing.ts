import { getPosition } from 'utils/sudoku';
import { column, isFilled, row } from '../helper';
import { SolveHistory } from './history';
import { CellSolver } from './types';
import { InterCell } from '../types';
import { range } from 'utils/misc';

/**
 * repro: #G:0:6,4:9,8:7,a:4,e:7,f:1,k:2,l:8,p:5,r:8,y:9,14:7,1a:3,1h:8,1j:5,1n:2,1o:3,1t:4,1u:5,1y:2,20:9,24:3,28:4
 */
export const solveXWing =
    (history: SolveHistory): CellSolver =>
    (cell, i, board) => {
        // for each cell candidate:
        // if there are 2 cells in this column/row that have the candidate
        // and there are 2 other columns/rows that have the candidate in the same places
        // then _all_ other cells on those rows and columns can not have the candidate

        const pos = getPosition(i);

        // no need to check final column
        if (pos.x === 8) {
            return cell;
        }

        const thisColumn = column(board, pos, true);

        cell.marks.forEach((candidate) => {
            // check column
            const indices = getIndicesWithCandidate(thisColumn, candidate);
            if (indices.length === 2) {
                // only check to the right (full search is ltr/ttb)
                range(pos.x + 1, 8).forEach((rowX) => {
                    const checkColumn = column(
                        board,
                        { x: rowX, y: pos.y },
                        true
                    );
                    const checkIndices = getIndicesWithCandidate(
                        checkColumn,
                        candidate
                    );
                    if (eq(indices, checkIndices)) {
                        // found x-wing
                        const xwing = [
                            thisColumn[indices[0]],
                            thisColumn[indices[1]],
                            checkColumn[checkIndices[0]],
                            checkColumn[checkIndices[1]],
                        ];

                        const thisRow = row(board, pos, true);
                        const thatRow = row(
                            board,
                            { x: pos.x, y: indices[1] },
                            true
                        );

                        const affected: number[] = [];
                        // remove from columns
                        [thisColumn, checkColumn, thisRow, thatRow]
                            .flat()
                            .forEach((affectedCell) => {
                                if (
                                    !xwing.includes(affectedCell) &&
                                    affectedCell.marks.includes(candidate)
                                ) {
                                    affected.push(affectedCell.index);
                                    affectedCell.marks =
                                        affectedCell.marks.filter(
                                            (m) => m !== candidate
                                        );
                                }
                            });

                        if (affected.length > 0) {
                            history.push({
                                algorithm: 'x-wing',
                                affected,
                                culprits: xwing.map((c) => c.index),
                                removedCandidates: [candidate],
                                reason: `${candidate} X-wing`,
                            });
                        }
                    }
                });
            }
        });

        return cell;
    };

const getIndicesWithCandidate = (
    cells: InterCell[],
    candidate: number
): number[] =>
    cells.reduce(
        (matches, cell, index) =>
            cell.marks.includes(candidate) && !isFilled(cell)
                ? [...matches, index]
                : matches,
        [] as number[]
    );

const eq = <T>(arr1: T[], arr2: T[]) =>
    arr1.length === arr2.length &&
    range(0, arr1.length).every((n) => arr1[n] === arr2[n]);
