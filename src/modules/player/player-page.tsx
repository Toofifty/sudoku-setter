import React, { useState, useEffect } from 'react';
import useAction from 'hooks/use-action';
import { decode } from 'utils';
import BoardContainer from 'components/board-container';
import ControlsMenu from 'components/controls-menu';
import ContextMenu from 'components/context-menu';

const PlayerPage = () => {
    const [hasLoadedFromHash, setHasLoadedFromHash] = useState(false);
    const setSudoku = useAction('puzzle/set-sudoku');
    const triggerSolve = useAction('solver/trigger-solve');

    useEffect(() => {
        if (!hasLoadedFromHash) {
            setSudoku({
                ...(window.location.hash &&
                    decode(window.location.hash.slice(1))),
                mode: 'play',
            });
            triggerSolve();
        }
        setHasLoadedFromHash(true);
    }, [hasLoadedFromHash, setSudoku, triggerSolve]);

    return (
        <div style={{ margin: 50 }}>
            <div className="container">
                <div className="columns">
                    <div
                        className="column"
                        style={{ display: 'flex', justifyContent: 'center' }}
                    >
                        <BoardContainer />
                    </div>
                    <div
                        className="column columns control-columns"
                        style={{
                            display: 'flex',
                            justifyContent: 'center',
                            alignItems: 'flex-start',
                        }}
                    >
                        <div className="column">
                            {/* TODO: remove controls menu */}
                            <ControlsMenu />
                        </div>
                        <div className="column col-4">
                            {/* TODO: better player controls */}
                            <ContextMenu isStatic />
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default PlayerPage;
