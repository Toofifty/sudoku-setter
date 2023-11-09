import React, { useState, useEffect } from 'react';
import useAction from 'hooks/use-action';
import { decode } from 'utils';
import BoardContainer from 'components/board-container';
import PlayerControlBox from 'components/player-control-box';
import PageLayout from 'components/page-layout';
import ModalHost from 'components/modal-host';

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
        <>
            <PageLayout
                board={<BoardContainer />}
                controls={<PlayerControlBox />}
            />
            <ModalHost />
        </>
    );
};

export default PlayerPage;
