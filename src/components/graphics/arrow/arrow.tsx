import React from 'react';
import { Arrow } from 'utils/sudoku-types';

import './arrow.scss';

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

interface GraphicsArrowProps {
    index: number;
    arrows: Arrow[];
}

const GraphicsArrow = ({ index, arrows }: GraphicsArrowProps) => (
    <>
        {arrows
            .filter(
                (arrow) =>
                    arrow.head.includes(index) || arrow.tail.includes(index)
            )
            .map((arrow, i) => {
                const twoDigit = arrow.head.length === 2;
                const indexInHead = arrow.head.indexOf(index);
                const head = indexInHead >= 0;
                const indexInTail = arrow.tail.indexOf(index);
                const last = indexInTail === arrow.tail.length - 1;
                const verticalPill =
                    head &&
                    arrow.head.length === 2 &&
                    arrow.head[1] - arrow.head[0] === 9;
                return (
                    <div className="arrow" key={i}>
                        {!head && (
                            <div
                                className={`arrow__line arrow__line--${getDirectionTo(
                                    index,
                                    arrow.tail[indexInTail - 1] ??
                                        getClosestHead(arrow.head, index)
                                )}`}
                            />
                        )}
                        {last && (
                            <div
                                className={`arrow__point arrow__point--${getDirectionTo(
                                    index,
                                    arrow.tail[indexInTail - 1]
                                )}`}
                            />
                        )}
                        {head && !twoDigit && <div className="arrow__single" />}
                        {head && twoDigit && (
                            <div
                                className={`arrow__double arrow__double--${
                                    verticalPill ? 'v' : 'h'
                                }${indexInHead}`}
                            />
                        )}
                    </div>
                );
            })}
    </>
);

export default GraphicsArrow;
