import { PuzzleState } from 'reducers/puzzle';

import { PuzzleCell } from '../types';

import { isFilled } from './solve/helper';
import { Arrow, KillerCage, Thermo } from './sudoku-types';

type EncodedData = {
    givens: string;
    thermos?: string;
    arrows?: string;
    killerCages?: string;
};

type DecodedData = {
    board?: PuzzleCell[];
    thermos?: Thermo[];
    arrows?: Arrow[];
    killerCages?: KillerCage[];
};

const RADIX = 36;
const encodeNumber = (n: number) => n.toString(RADIX);
const encodeArray = (n: number[]) => n.map(encodeNumber).join(',');
const decodeNumber = (s: string) => parseInt(s, RADIX);
const decodeArray = (s: string) => s.split(',').map(decodeNumber);

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

export const encode = ({
    board,
    thermos,
    arrows,
    killerCages,
}: PuzzleState) => {
    const data: EncodedData = {
        givens: encodeGivens(
            board.map((cell) => (isFilled(cell) && cell.given ? cell.value : 0))
        ),
        thermos: thermos.map(encodeArray).join(';'),
        arrows: arrows
            .map(
                ({ head, tail }) => `${encodeArray(head)}:${encodeArray(tail)}`
            )
            .join(';'),
        killerCages: killerCages
            .map(({ total, cage }) => `${total}:${encodeArray(cage)}`)
            .join(';'),
    };
    let encoded = data.givens.length > 0 ? `G:${data.givens}` : '';
    if (data.thermos) encoded += `!T:${data.thermos}`;
    if (data.arrows) encoded += `!A:${data.arrows}`;
    if (data.killerCages) encoded += `!K:${data.killerCages}`;

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
            decoded.thermos = part.substr(2).split(';').map(decodeArray);
        }

        if (part.startsWith('A')) {
            decoded.arrows = part
                .substring(2)
                .split(';')
                .map((part) => {
                    const [head, tail] = part.split(':');
                    return {
                        head: decodeArray(head),
                        tail: decodeArray(tail),
                    };
                });
        }

        if (part.startsWith('K')) {
            decoded.killerCages = part
                .substr(2)
                .split(';')
                .map((part) => {
                    const [total, cage] = part.split(':');
                    return {
                        total: Number(total),
                        cage: decodeArray(cage),
                    };
                });
        }
    });

    return decoded;
};
