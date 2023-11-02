import React from 'react';
import cx from 'classnames';

import './border-selection.scss';

const directions: Record<string, number> = {
    br: 10,
    b: 9,
    bl: 8,
    r: 1,
    l: -1,
    tr: -8,
    t: -9,
    tl: -10,
};

const getEdges = (index: number, selection: number[]) => {
    return Object.entries(directions)
        .filter(
            ([dir, dist]) =>
                dir.length === 1 && !selection.includes(index + dist)
        )
        .map(([dir]) => dir);
};

const getCorners = (index: number, selection: number[], edges: string[]) => {
    return Object.entries(directions)
        .filter(
            ([dir, dist]) =>
                dir.length === 2 &&
                dir.split('').every((side) => !edges.includes(side)) &&
                !selection.includes(index + dist)
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
                    className={`selection__corner selection__corner--${corner}`}
                />
            ))}
        </div>
    );
};

export default GraphicsBorderSelection;
