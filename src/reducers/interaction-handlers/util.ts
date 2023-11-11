import { Subcell } from './types';

export const isCorner = (subcell: Subcell) =>
    subcell === 'top-left' ||
    subcell === 'top-right' ||
    subcell === 'bottom-left' ||
    subcell === 'bottom-right';
