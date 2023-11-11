import { getPosition, getCoord } from 'utils/sudoku';
import { regionIndices, regions } from '../helper';
import { InterCell } from '../types';
import { CellSolver } from './types';
import { SolveHistory } from './history';

/**
 * repro: #G:0:5,5:7,8:2,a:9,e:8,i:4,l:1,t:6,x:8,10:7,11:8,14:5,17:1,18:3,1b:3,1f:9,1n:9,1q:4,1u:4,1y:7,20:2,23:6,28:1
 */
export const solveYWing =
    (history: SolveHistory): CellSolver =>
    (cell, i, board) => {
        if (cell.marks.length !== 2) {
            return cell;
        }

        // cells: P (pivot, this cell), A (pincer 1), B (pincer 2)

        // check row/column/box for another cell (A) that has two
        // candidates, and shares one

        // check row/column/box for _another_ cell that has two
        // candidates, sharing a candidate with both P & A that
        // is not the same as the last shared candidate

        // any cells that are seen by both A & B can have the candidate
        // removed that is shared between those

        // e.g. P has 3,8 ; A has 4,8 ; B has 3,4
        // if P=3 then B=4, and if P=8 then A=4
        // so any cell that sees both A & B cannot be 4.

        const pincers = regions(board, getPosition(i))
            .flat()
            .filter(
                (pincer) =>
                    pincer.marks.length === 2 &&
                    sharedCandidates(cell, pincer).length === 1
            );
        pincers.forEach((aPincer, i) => {
            // common between pivot & A
            const aMark = sharedCandidates(cell, aPincer)[0];
            // common between pivot & B
            const bMark = uniqueCandidates(cell, aPincer)[0];
            // common between A & B - this is the candidate to remove
            const otherMark = uniqueCandidates(aPincer, cell)[0];

            const possibleBPincers = pincers.filter(
                (pincer, j) =>
                    j > i &&
                    pincer.marks.length === 2 &&
                    pincer.marks.includes(bMark) &&
                    pincer.marks.includes(otherMark)
            );
            possibleBPincers.forEach((bPincer) => {
                const commonCells = commonCellIndices(aPincer, bPincer).filter(
                    (index) => index !== i
                );

                const affected: number[] = [];
                commonCells.forEach((index) => {
                    if (board[index].marks.includes(otherMark)) {
                        affected.push(index);
                        board[index].marks = board[index].marks.filter(
                            (m) => m !== otherMark
                        );
                    }
                });

                if (affected.length > 0) {
                    history.push({
                        algorithm: 'y-wing',
                        affected,
                        removedCandidates: [otherMark],
                        reason: `${[aMark, bMark, otherMark]
                            .sort()
                            .join('')} Y-wing at ${getCoord(
                            cell.index
                        )}, ${getCoord(aPincer.index)} and ${getCoord(
                            bPincer.index
                        )}`,
                    });
                }
            });
        });

        return cell;
    };

const sharedCandidates = (a: InterCell, b: InterCell): number[] => {
    return a.marks.filter((mark) => b.marks.includes(mark));
};

const uniqueCandidates = (a: InterCell, b: InterCell): number[] => {
    return a.marks.filter((mark) => !b.marks.includes(mark));
};

const commonCellIndices = (a: InterCell, b: InterCell): number[] => {
    const aRegions = regionIndices(getPosition(a.index)).flat();
    const bRegions = regionIndices(getPosition(b.index)).flat();
    return aRegions.filter((index) => bRegions.includes(index));
};
