import { useEffect, useState } from 'react';

import { decode } from 'utils';
import ContextMenu from 'components/context-menu';
import useAction from 'hooks/use-action';
import BoardContainer from 'components/board-container';
import ControlsMenu from 'components/setter-controls-menu';
import PageLayout from 'components/page-layout';
import ModalHost from 'components/modal-host';
import SetterInputMenu from 'components/setter-input-menu';

import { MobileKeypad } from './components/mobile-keypad';

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
                leftControls={<SetterInputMenu />}
                controls={<ControlsMenu />}
                mobileControls={<MobileKeypad />}
            />
            <ContextMenu />
            <ModalHost />
        </>
    );
};

export default SetterPage;
