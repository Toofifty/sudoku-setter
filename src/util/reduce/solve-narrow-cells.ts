import { InterCell } from './types';
import { ICell, Position } from '../../types';
import { row, column, box, getPencils, isFilled } from './helper';
import { getCellAt } from '../sudoku';

export const solveNarrowCells = (inter: InterCell[]): InterCell[] =>
    inter.map((cell, i) => {
        const pos = getCellAt(i);
        if (isFilled(cell) && cell.given) return cell;

        let pencils = [...cell.pencils];

        for (let n of cell.pencils) {
            if (isOnlyPlaceFor(inter, pos, n)) {
                pencils = [n];
                break;
            }
        }

        return { ...cell, pencils };
    });

const isOnlyPlaceFor = (board: ICell[], pos: Position, n: number) =>
    isOnlyPlaceInColumnFor(board, pos, n) ||
    isOnlyPlaceInRowFor(board, pos, n) ||
    isOnlyPlaceInBoxFor(board, pos, n);

const isOnlyPlaceInRowFor = (board: ICell[], pos: Position, n: number) =>
    row(board, pos)
        .map(getPencils)
        .every((pencils) => !pencils.includes(n));

const isOnlyPlaceInColumnFor = (board: ICell[], pos: Position, n: number) =>
    column(board, pos)
        .map(getPencils)
        .every((pencils) => !pencils.includes(n));

const isOnlyPlaceInBoxFor = (board: ICell[], pos: Position, n: number) =>
    box(board, pos)
        .map(getPencils)
        .every((pencils) => !pencils.includes(n));
