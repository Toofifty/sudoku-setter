import { useEffect, useState } from 'react';

import useAction from 'hooks/use-action';
import { decode } from 'utils';
import BoardContainer from 'components/board-container';
import ModalHost from 'components/modal-host';
import { PlayerControls } from 'components/player-controls';

import PlayerPageLayout from './player-page-layout';

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
            <PlayerPageLayout
                board={<BoardContainer />}
                controls={<PlayerControls />}
            />
            <ModalHost />
        </>
    );
};

export default PlayerPage;
