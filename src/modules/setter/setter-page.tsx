import React, { useState, useEffect } from 'react';
import { decode } from 'utils';
import ContextMenu from 'components/context-menu';
import useAction from 'hooks/use-action';
import BoardContainer from 'components/board-container';
import ControlsMenu from 'components/controls-menu';
import PageLayout from 'components/page-layout';
import SetterMobileControls from 'components/setter-mobile-controls';
import ModalHost from 'components/modal-host';

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
        <>
            <PageLayout
                board={<BoardContainer />}
                controls={<ControlsMenu />}
                mobileControls={<SetterMobileControls />}
            />
            <ContextMenu />
            <ModalHost />
        </>
    );
};

export default SetterPage;
