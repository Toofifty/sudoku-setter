import React, { useState, useEffect } from 'react';
import { decode } from 'utils';
import ContextMenu from 'components/context-menu';
import useAction from 'hooks/use-action';
import BoardContainer from 'components/board-container';
import ControlsMenu from 'components/controls-menu';

const SetterPage = () => {
    const [hasLoadedFromHash, setHasLoadedFromHash] = useState(false);
    const setSudoku = useAction('puzzle/set-sudoku');
    const triggerSolve = useAction('solver/trigger-solve');

    useEffect(() => {
        if (!hasLoadedFromHash) {
            setSudoku({
                ...(window.location.hash &&
                    decode(window.location.hash.slice(1))),
                mode: 'set',
            });
            triggerSolve();
        }
        setHasLoadedFromHash(true);
    }, [hasLoadedFromHash, setSudoku, triggerSolve]);

    return (
        <div>
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
                            <ControlsMenu />
                        </div>
                        <div className="column col-4 hide-desktop">
                            <ContextMenu isStatic />
                        </div>
                    </div>
                </div>
                <ContextMenu />
            </div>
        </div>
    );
};

export default SetterPage;
