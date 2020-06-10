import React from 'react';

export const capture = <E extends React.MouseEvent | React.KeyboardEvent>(
    handler?: (e: E) => void
) => (e: E) => {
    e.stopPropagation();
    e.preventDefault();
    handler?.(e);
};

export const range = (min: number, max: number): number[] =>
    Array(max - min)
        .fill(0)
        .map((_, i) => i + min);
