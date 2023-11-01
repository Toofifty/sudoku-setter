import React from 'react';

export const capture =
    <E extends React.MouseEvent | React.KeyboardEvent>(
        handler?: (e: E) => void
    ) =>
    (e: E) => {
        e.stopPropagation();
        e.preventDefault();
        handler?.(e);
    };

export const range = (min: number, max: number): number[] =>
    Array(max - min)
        .fill(0)
        .map((_, i) => i + min);

export const sum = (arr: number[]) => arr.reduce((total, n) => total + n, 0);

export const naturalJoin = (list: string[]): string => {
    if (list.length === 1) {
        return list[0];
    }

    return list.slice(0, -1).join(', ') + ' and ' + list.slice(-1);
};
