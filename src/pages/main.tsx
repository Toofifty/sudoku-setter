import React, { useState, useEffect } from 'react';
import Board from '../components/board';
import useAction from '../hooks/use-action';
import { decode } from '../util/url';
import Context from '../components/context';

const Main = () => {
    const [hasLoadedFromHash, setHasLoadedFromHash] = useState(false);
    const setBoard = useAction('set-board');
    const setShouldReduce = useAction('set-should-reduce');
    const _reset = useAction('reset');

    const reset = () => {
        _reset();
        window.location.hash = '';
    };

    useEffect(() => {
        if (!hasLoadedFromHash && window.location.hash) {
            const data = decode(window.location.hash.slice(1));
            setBoard(data.board);
            setShouldReduce(true);
        }
        setHasLoadedFromHash(true);
    }, [hasLoadedFromHash, setBoard, setShouldReduce]);

    return (
        <div>
            <Board />
            <button className="btn" onClick={() => reset()}>
                Reset
            </button>
            <Context />
        </div>
    );
};

export default Main;
