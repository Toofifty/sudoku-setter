import { ICell } from '../types';
import { isFilled } from './reduce/helper';

type EncodedData = {
    givens: string;
};

type DecodedData = {
    board: ICell[];
};

export const encode = (board: ICell[]) => {
    const data = {
        givens: board
            .map((cell) => (isFilled(cell) && cell.given ? cell.value : 0))
            .join(''),
    };
    return JSON.stringify(data);
};

export const decode = (b64: string): DecodedData => {
    const data: EncodedData = JSON.parse(decodeURI(b64));

    const board: ICell[] = data.givens.split('').map((sv) => {
        const v = Number(sv);
        if (v === 0) {
            return {
                pencils: [1, 2, 3, 4, 5, 6, 7, 8, 9],
                given: false,
            };
        }
        return {
            value: v,
            given: true,
        };
    });

    return { board };
};
