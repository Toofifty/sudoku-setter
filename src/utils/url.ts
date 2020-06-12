import { ICell } from '../types';
import { isFilled } from './reduce/helper';
import { SudokuState } from 'reducers/sudoku';

type EncodedData = {
    givens: string;
    thermos?: string;
    killerCages?: string;
};

type DecodedData = {
    board: ICell[];
    thermos?: number[][];
    killerCages?: { total: number; cage: number[] }[];
};

export const encode = ({ board, thermos, killerCages }: SudokuState) => {
    const data: EncodedData = {
        givens: board
            .map((cell) => (isFilled(cell) && cell.given ? cell.value : 0))
            .join(''),
    };
    if (thermos) {
        data.thermos = thermos.map((thermo) => thermo.join(',')).join(';');
    }
    if (killerCages) {
        data.killerCages = killerCages
            .map(({ total, cage }) => `${total}:${cage.join(',')}`)
            .join(';');
    }
    return JSON.stringify(data);
};

export const decode = (b64: string): DecodedData => {
    const { givens, thermos, killerCages }: EncodedData = JSON.parse(
        decodeURI(b64)
    );

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
            .split(';')
            .map((thermo) => thermo.split(',').map(Number));
    }

    if (killerCages) {
        decoded.killerCages = killerCages.split(';').map((part) => {
            const [total, cage] = part.split(':');
            return { total: Number(total), cage: cage.split(',').map(Number) };
        });
    }

    return decoded;
};
