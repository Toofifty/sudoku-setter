import useSelector from 'hooks/use-selector';
import React, { useMemo } from 'react';
import { KillerCage } from 'utils/sudoku-types';
import { CAGE_OUTER_PADDING, getSVGPosition } from '../consts';
import {
    addPosition,
    getIndex,
    getPosition,
    multiplyPosition,
} from 'utils/sudoku';
import { Position } from 'types';

type Line = { start: Position; end: Position };

const eq = (a: Position, b: Position) => {
    return a.x === b.x && a.y === b.y;
};

const P = CAGE_OUTER_PADDING;

const edges = {
    b: { x: 0, y: 1 },
    r: { x: 1, y: 0 },
    l: { x: -1, y: 0 },
    t: { x: 0, y: -1 },
} as const;

const bottomLeft = { x: -0.5 + P, y: 0.5 - P };
const bottomRight = { x: 0.5 - P, y: 0.5 - P };
const topLeft = { x: -0.5 + P, y: -0.5 + P };
const topRight = { x: 0.5 - P, y: -0.5 + P };

// all must be clockwise
const edgeOffsets: Record<keyof typeof edges, Line> = {
    t: { start: topLeft, end: topRight },
    r: { start: topRight, end: bottomRight },
    b: { start: bottomRight, end: bottomLeft },
    l: { start: bottomLeft, end: topLeft },
};

const cornerLines: Record<string, Line[]> = {
    tl: [
        { start: { x: -0.5, y: topLeft.y }, end: topLeft },
        { start: topLeft, end: { x: topLeft.x, y: -0.5 } },
    ],
    tr: [
        { start: { x: topRight.x, y: -0.5 }, end: topRight },
        { start: topRight, end: { x: 0.5, y: topRight.y } },
    ],
    br: [
        { start: { x: 0.5, y: bottomRight.y }, end: bottomRight },
        { start: bottomRight, end: { x: bottomRight.x, y: 0.5 } },
    ],
    bl: [
        { start: { x: bottomLeft.x, y: 0.5 }, end: bottomLeft },
        { start: bottomLeft, end: { x: -0.5, y: bottomLeft.y } },
    ],
};

const findEdges = (index: number, cage: number[]) => {
    const position = getPosition(index);
    const inCage = (x: number, y: number) =>
        cage.includes(getIndex(addPosition(position, { x, y })));

    // get regular edges
    const e = Object.fromEntries(
        Object.entries(edges)
            .filter(([, { x, y }]) => !inCage(x, y))
            .map(([dir]) => {
                const { start, end } = edgeOffsets[dir as keyof typeof edges];
                // need to copy objects
                return [dir, { start: { ...start }, end: { ...end } }];
            })
    );

    // extends lines to the edge of the cell
    // if there is not an edge in that direction

    // top
    if (e.t && !e.r) e.t.end.x += P;
    if (e.t && !e.l) e.t.start.x -= P;
    // right
    if (e.r && !e.t) e.r.start.y -= P;
    if (e.r && !e.b) e.r.end.y += P;
    // bottom
    if (e.b && !e.r) e.b.start.x += P;
    if (e.b && !e.l) e.b.end.x -= P;
    // left
    if (e.l && !e.t) e.l.end.y -= P;
    if (e.l && !e.b) e.l.start.y += P;

    // add corners
    const corners: Line[] = [];
    if (!e.t && !e.l && !inCage(-1, -1)) corners.push(...cornerLines.tl);
    if (!e.t && !e.r && !inCage(1, -1)) corners.push(...cornerLines.tr);
    if (!e.b && !e.r && !inCage(1, 1)) corners.push(...cornerLines.br);
    if (!e.b && !e.l && !inCage(-1, 1)) corners.push(...cornerLines.bl);

    const svgPosition = getSVGPosition(index);

    return [...Object.values(e), ...corners].map((line) => ({
        start: addPosition(svgPosition, multiplyPosition(line.start, 100)),
        end: addPosition(svgPosition, multiplyPosition(line.end, 100)),
    }));
};

/**
 * Join edges in an array of lines. Only does one iteration,
 * and may not use up all lines in the array.
 */
const joinEdges = (lines: Line[]) => {
    const points: Position[] = [];

    const firstEdge = lines.shift()!;
    points.push(firstEdge.start, firstEdge.end);

    let currentEdge = firstEdge;
    while (lines.length > 0) {
        // eslint-disable-next-line no-loop-func
        currentEdge = lines.find(({ start }) => eq(currentEdge.end, start))!;
        // remove from edges (mutate)
        lines.splice(lines.indexOf(currentEdge), 1);
        if (!currentEdge) {
            break;
        }
        points.push(currentEdge.end);
        if (eq(currentEdge.end, firstEdge.start)) {
            break;
        }
    }

    return points;
};

const computeEdges = (cage: number[]) => {
    // get all edges for all cells (including corners)
    const edges = cage.flatMap((index) => findEdges(index, cage));
    const outlines: Position[][] = [];

    while (edges.length > 0) {
        outlines.push(joinEdges(edges));
    }

    return outlines;
};

const renderCage = ({ total, cage }: KillerCage, cageIndex: number) => {
    const topLeft = Math.min(...cage);
    const totalPosition = getSVGPosition(topLeft);

    const totalWidth = String(total).length * 10 + 16;

    return (
        <g key={cageIndex} className="svg-cage">
            <mask id={`cage-${cageIndex}-clip`}>
                <rect x="0" y="0" width="100%" height="100%" fill="white" />
                <rect
                    x={totalPosition.x - 50}
                    y={totalPosition.y - 50}
                    width={totalWidth}
                    height={30}
                    fill="black"
                />
            </mask>
            {computeEdges(cage).map((points, i) => {
                const move = `M${points[0].x} ${points[0].y} `;
                const path = points
                    .map((edge) => `L${edge.x} ${edge.y}`)
                    .join(' ');

                console.log(move + path);

                return (
                    <path
                        key={i}
                        d={move + path}
                        fill="none"
                        mask={`url(#cage-${cageIndex}-clip)`}
                    />
                );
            })}
            <text
                x={totalPosition.x - 50 + P * 100}
                y={totalPosition.y - 50 + P * 100}
            >
                {total}
            </text>
        </g>
    );
};

const CageGraphics = () => {
    const cages = useSelector((state) => state.puzzle.killerCages);

    const rendered = useMemo(() => cages.map(renderCage), [cages]);

    return <>{rendered}</>;
};

export default CageGraphics;
