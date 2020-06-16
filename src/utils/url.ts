import { PuzzleState } from 'reducers/puzzle';
import { PuzzleCell } from '../types';
import { isFilled } from './solve/helper';

type EncodedData = {
    givens: string;
    thermos?: string;
    killerCages?: string;
};

type DecodedData = {
    board?: PuzzleCell[];
    thermos?: number[][];
    killerCages?: { total: number; cage: number[] }[];
};

const RADIX = 36;

const encodeGivens = (givens: number[]) =>
    givens
        .map((value, i) => (value > 0 ? `${i.toString(RADIX)}:${value}` : null))
        .filter(Boolean)
        .join(',');

const decodeGivens = (encoded: string) => {
    const board: PuzzleCell[] = Array(81)
        .fill({})
        .map(() => ({
            given: false,
            color: 'white',
        }));
    encoded.split(',').forEach((part) => {
        const [index, value] = part.split(':');
        board[parseInt(index, RADIX)] = {
            value: Number(value),
            given: true,
            color: 'white',
        };
    });
    return board;
};

export const encode = ({ board, thermos, killerCages }: PuzzleState) => {
    const data: EncodedData = {
        givens: encodeGivens(
            board.map((cell) => (isFilled(cell) && cell.given ? cell.value : 0))
        ),
        thermos: thermos
            ?.map((thermo) => thermo.map((n) => n.toString(RADIX)).join(','))
            .join(';'),
        killerCages: killerCages
            ?.map(
                ({ total, cage }) =>
                    `${total}:${cage.map((n) => n.toString(RADIX)).join(',')}`
            )
            .join(';'),
    };
    let encoded = data.givens ? `G:${data.givens}` : '';
    if (data.thermos) encoded += data.thermos ? `!T:${data.thermos}` : '';
    if (data.killerCages)
        encoded += data.killerCages ? `!K:${data.killerCages}` : '';

    return encoded;
};

export const decode = (encoded: string): DecodedData => {
    const encodedParts = encoded.split('!');
    const decoded: DecodedData = {};

    encodedParts.forEach((part) => {
        if (part.startsWith('G')) {
            decoded.board = decodeGivens(part.substr(2));
        }

        if (part.startsWith('T')) {
            decoded.thermos = part
                .substr(2)
                .split(';')
                .map((thermo) =>
                    thermo.split(',').map((v) => parseInt(v, RADIX))
                );
        }

        if (part.startsWith('K')) {
            decoded.killerCages = part
                .substr(2)
                .split(';')
                .map((part) => {
                    const [total, cage] = part.split(':');
                    return {
                        total: Number(total),
                        cage: cage.split(',').map((v) => parseInt(v, RADIX)),
                    };
                });
        }
    });

    return decoded;
};
