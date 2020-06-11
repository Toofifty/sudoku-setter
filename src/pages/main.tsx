import React, { useState, useEffect } from 'react';
import { decode } from 'utils';
import Context from 'components/context-menu';
import useAction from 'hooks/use-action';
import useSelector from 'hooks/use-selector';
import BoardContainer from 'components/board-container';

const Main = () => {
    const [hasLoadedFromHash, setHasLoadedFromHash] = useState(false);
    const debugMode = useSelector((state) => state.ui.debugMode);
    const setDebugMode = useAction('set-debug-mode');
    const hideSolution = useSelector((state) => state.ui.hideSolution);
    const setHideSolution = useAction('set-hide-solution');
    const placeOnClick = useSelector((state) => state.ui.placeOnClick);
    const setPlaceOnClick = useAction('set-place-on-click');
    const setSudoku = useAction('set-sudoku');
    const setShouldReduce = useAction('set-should-reduce');
    const _reset = useAction('reset');

    const reset = () => {
        _reset();
        window.location.hash = '';
    };

    useEffect(() => {
        if (!hasLoadedFromHash && window.location.hash) {
            setSudoku({
                ...decode(window.location.hash.slice(1)),
                shouldReduce: true,
            });
        }
        setHasLoadedFromHash(true);
    }, [hasLoadedFromHash, setSudoku, setShouldReduce]);

    return (
        <div style={{ margin: 100 }}>
            <BoardContainer />
            <br />
            <div className="container">
                <div className="columns">
                    <div className="column form-group">
                        <label className="form-switch">
                            <input
                                type="checkbox"
                                checked={debugMode}
                                onChange={() => setDebugMode(!debugMode)}
                            />
                            <i className="form-icon" /> Debug
                        </label>
                        <label className="form-switch">
                            <input
                                type="checkbox"
                                checked={hideSolution}
                                onChange={() => setHideSolution(!hideSolution)}
                            />
                            <i className="form-icon" /> Hide solution
                        </label>
                        <label className="form-switch">
                            <input
                                type="checkbox"
                                checked={placeOnClick}
                                onChange={() => setPlaceOnClick(!placeOnClick)}
                            />
                            <i className="form-icon" /> Place numbers on click
                        </label>
                    </div>
                    <button className="btn mr-2" onClick={() => reset()}>
                        Reset
                    </button>
                    <button
                        className="btn"
                        onClick={() => setShouldReduce(true)}
                    >
                        Solve step
                    </button>
                </div>
            </div>
            <Context />
        </div>
    );
};

export default Main;
