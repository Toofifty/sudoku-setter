import React, { useState, useEffect } from 'react';
import useAction from 'hooks/use-action';
import { decode } from 'utils';
import BoardContainer from 'components/board-container';
import ControlBox from 'components/control-box';
import SettingsModal from 'components/settings-modal/settings-modal';

const PlayerPage = () => {
    const [hasLoadedFromHash, setHasLoadedFromHash] = useState(false);
    const setSudoku = useAction('puzzle/set-sudoku');
    const triggerSolve = useAction('solver/trigger-solve');
    const [showSettingsModal, setShowSettingsModal] = useState(false);

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
                        className="column"
                        style={{
                            display: 'flex',
                            justifyContent: 'center',
                            alignItems: 'flex-start',
                        }}
                    >
                        <ControlBox
                            onShowSettings={() => setShowSettingsModal(true)}
                        />
                    </div>
                </div>
            </div>
            {showSettingsModal && (
                <SettingsModal onClose={() => setShowSettingsModal(false)} />
            )}
        </div>
    );
};

export default PlayerPage;
