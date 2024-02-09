import React from 'react';

import useSelector from 'hooks/use-selector';
import { Arrow } from 'utils/sudoku-types';

import {
    ARROW_HEAD_SIZE,
    ARROW_LINE_WIDTH,
    ARROW_PILL_SIZE,
    getSVGPosition,
} from '../consts';

const directionMap: Record<
    number,
    'br' | 'b' | 'bl' | 'r' | 'l' | 'tr' | 't' | 'tl'
> = {
    10: 'br',
    9: 'b',
    8: 'bl',
    1: 'r',
    [-1]: 'l',
    [-8]: 'tr',
    [-9]: 't',
    [-10]: 'tl',
};

const dirAngles: Record<
    'br' | 'b' | 'bl' | 'r' | 'l' | 'tr' | 't' | 'tl',
    number
> = {
    br: Math.PI / 4,
    b: Math.PI / 2,
    bl: (3 * Math.PI) / 4,
    r: 0,
    l: Math.PI,
    tr: (7 * Math.PI) / 4,
    t: (3 * Math.PI) / 2,
    tl: (5 * Math.PI) / 4,
};

const getArrowHeadAngle = (index: number, last: number) => {
    return dirAngles[getDirectionTo(last, index)];
};

const getDirectionTo = (index: number, target: number) =>
    directionMap[target - index];

const getClosestHead = (head: number[], index: number): number => {
    if (head.length === 1) {
        return head[0];
    }
    const head0Dir = getDirectionTo(index, head[0]);
    if (head0Dir !== undefined && head0Dir.length === 1) {
        return head[0];
    }
    return head[1];
};

const renderArrowTail = ({ head, tail }: Arrow, width: number) => {
    const start = getSVGPosition(getClosestHead(head, tail[0]));
    const move = `M${start.x} ${start.y} `;

    const path = tail
        .map((index) => {
            const p = getSVGPosition(index);
            return `L${p.x} ${p.y}`;
        })
        .join(' ');

    return (
        <path
            d={move + path}
            fill="none"
            strokeWidth={width * 100}
            strokeLinecap="round"
            strokeLinejoin="round"
        />
    );
};

const R = (Math.PI * 3) / 4;
const L = (Math.PI * 5) / 4;

const renderArrowHead = (fullArrow: number[], width: number) => {
    const [secondLast, last] = fullArrow.slice(-2);
    const angle = getArrowHeadAngle(last, secondLast);
    const { x, y } = getSVGPosition(last);
    const s = ARROW_HEAD_SIZE * 100;

    const path =
        `M${x} ${y} l${Math.cos(angle + R) * s} ${Math.sin(angle + R) * s}` +
        `M${x} ${y} l${Math.cos(angle + L) * s} ${Math.sin(angle + L) * s}`;

    return (
        <path
            d={path}
            fill="none"
            strokeWidth={width * 100}
            strokeLinecap="round"
            strokeLinejoin="round"
        />
    );
};

const renderPill = (pill: number[], size: number, stroke: number) => {
    const first = getSVGPosition(pill[0]);
    const last = getSVGPosition(pill[pill.length - 1]);

    return (
        <rect
            x={first.x - size * 50}
            y={first.y - size * 50}
            width={last.x - first.x + size * 100}
            height={size * 100}
            strokeWidth={stroke * 100}
            rx={size * 50}
        />
    );
};

const renderArrow = (arrow: Arrow, i: number) => {
    return (
        <g key={i} className="svg-arrow">
            {renderArrowTail(arrow, ARROW_LINE_WIDTH)}
            {renderArrowHead([...arrow.head, ...arrow.tail], ARROW_LINE_WIDTH)}
            {renderPill(arrow.head, ARROW_PILL_SIZE, ARROW_LINE_WIDTH)}
        </g>
    );
};

const ArrowGraphics = () => {
    const arrows = useSelector((state) => state.puzzle.arrows);

    return <>{arrows.map(renderArrow)}</>;
};

export default ArrowGraphics;
