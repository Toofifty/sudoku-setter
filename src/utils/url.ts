import { ICell } from '../types';
import { isFilled } from './reduce/helper';
import { SudokuState } from 'reducers/sudoku';

type EncodedData = {
    givens: string;
    thermos?: string;
};

type DecodedData = {
    board: ICell[];
    thermos?: number[][];
};

export const encode = ({ board, thermos }: SudokuState) => {
    const data: EncodedData = {
        givens: board
            .map((cell) => (isFilled(cell) && cell.given ? cell.value : 0))
            .join(''),
    };
    if (thermos) {
        data.thermos = thermos.map((thermo) => thermo.join('')).join(',');
    }
    return JSON.stringify(data);
};

export const decode = (b64: string): DecodedData => {
    const { givens, thermos }: EncodedData = JSON.parse(decodeURI(b64));

    const decoded: DecodedData = {
        board: givens.split('').map((sv) => {
            const v = Number(sv);
            if (v === 0) {
                return {
                    marks: [1, 2, 3, 4, 5, 6, 7, 8, 9],
                    given: false,
                };
            }
            return {
                value: v,
                given: true,
            };
        }),
    };

    if (thermos) {
        decoded.thermos = thermos
            .split(',')
            .map((thermo) => thermo.split('').map(Number));
    }

    return decoded;
};
