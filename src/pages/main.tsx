import React, { useState, useEffect } from 'react';
import { decode } from 'utils';
import ContextMenu from 'components/context-menu';
import useAction from 'hooks/use-action';
import BoardContainer from 'components/board-container';
import ControlsMenu from 'components/controls-menu';

const Main = () => {
    const [hasLoadedFromHash, setHasLoadedFromHash] = useState(false);
    const setSudoku = useAction('set-sudoku');

    useEffect(() => {
        if (!hasLoadedFromHash && window.location.hash) {
            setSudoku({
                ...decode(window.location.hash.slice(1)),
                shouldReduce: true,
            });
        }
        setHasLoadedFromHash(true);
    }, [hasLoadedFromHash, setSudoku]);

    return (
        <div style={{ margin: 50, marginBottom: 200 }}>
            <div className="container">
                <div className="columns">
                    <div className="column">
                        <BoardContainer />
                    </div>
                    <div className="column">
                        <ControlsMenu />
                    </div>
                </div>
            </div>
            <ContextMenu />
        </div>
    );
};

export default Main;
