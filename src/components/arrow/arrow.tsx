import React from 'react';
import './arrow.scss';

interface ArrowProps {
    index: number;
    arrows: { head: number[]; tail: number[] }[];
}

const Arrow = ({ index, arrows }: ArrowProps) => <div />;

export default Arrow;
