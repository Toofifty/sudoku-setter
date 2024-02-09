import React from 'react';
import cx from 'classnames';

import './border-selection.scss';
import { addPosition, getIndex, getPosition } from 'utils/sudoku';

const edges = {
    b: { x: 0, y: 1 },
    r: { x: 1, y: 0 },
    l: { x: -1, y: 0 },
    t: { x: 0, y: -1 },
};

const corners = {
    br: { x: 1, y: 1 },
    bl: { x: -1, y: 1 },
    tr: { x: 1, y: -1 },
    tl: { x: -1, y: -1 },
};

const getEdges = (index: number, selection: number[]) => {
    const position = getPosition(index);
    return Object.entries(edges)
        .filter(
            ([, offset]) =>
                !selection.includes(getIndex(addPosition(position, offset)))
        )
        .map(([dir]) => dir);
};

const getCorners = (index: number, selection: number[], edges: string[]) => {
    const position = getPosition(index);
    return Object.entries(corners)
        .filter(
            ([dir, offset]) =>
                dir.split('').every((side) => !edges.includes(side)) &&
                !selection.includes(getIndex(addPosition(position, offset)))
        )
        .map(([dir]) => dir);
};

interface GraphicsBorderSelectionProps {
    index: number;
    selection: number[];
}

const GraphicsBorderSelection = ({
    index,
    selection,
}: GraphicsBorderSelectionProps) => {
    if (!selection.includes(index)) {
        return null;
    }

    const edges = getEdges(index, selection);
    const corners = getCorners(index, selection, edges);

    return (
        <div className="selection">
            <div
                className={cx(
                    `selection__edge`,
                    edges.map((edge) => `selection__edge--${edge}`)
                )}
            />
            {corners.map((corner) => (
                <div
                    key={corner}
                    className={`selection__corner selection__corner--${corner}`}
                />
            ))}
        </div>
    );
};

export default GraphicsBorderSelection;
