import React from 'react';
import useSelector from 'hooks/use-selector';
import useAction from 'hooks/use-action';
import './controls-menu.scss';

const ControlsMenu = () => {
    const debugMode = useSelector((state) => state.ui.debugMode);
    const setDebugMode = useAction('set-debug-mode');
    const hideSolution = useSelector((state) => state.ui.hideSolution);
    const setHideSolution = useAction('set-hide-solution');
    const stepSolve = useSelector((state) => state.sudoku.stepSolve);
    const setStepSolve = useAction('set-step-solve');
    const lookaheadSolve = useSelector((state) => state.sudoku.lookaheadSolve);
    const setLookaheadSolve = useAction('set-lookahead-solve');

    const solvers = useSelector((state) => state.sudoku.solvers);
    const setSolvers = useAction('set-solvers');
    const restrictions = useSelector((state) => state.sudoku.restrictions);
    const setRestrictions = useAction('set-restrictions');

    const setShouldSolve = useAction('set-should-solve');
    const solveFromScratch = useAction('solve-from-scratch');
    const _reset = useAction('reset');

    const reset = () => {
        _reset();
        window.location.hash = '';
    };

    return (
        <ul className="controls menu">
            <li className="divider" data-content="View" />
            <li className="menu-item">
                <label className="form-switch">
                    <input
                        type="checkbox"
                        checked={debugMode}
                        onChange={() => setDebugMode(!debugMode)}
                    />
                    <i className="form-icon" /> Debug mode
                </label>
            </li>
            <li className="menu-item">
                <label className="form-switch">
                    <input
                        type="checkbox"
                        checked={hideSolution}
                        onChange={() => setHideSolution(!hideSolution)}
                    />
                    <i className="form-icon" /> Hide solution
                </label>
            </li>
            <li className="divider" data-content="Solvers" />
            <li className="menu-item">
                <label className="form-checkbox">
                    <input type="checkbox" checked disabled />
                    <i className="form-icon" /> Naked singles
                </label>
            </li>
            <li className="menu-item">
                <label className="form-checkbox">
                    <input
                        type="checkbox"
                        checked={solvers.hiddenSingles}
                        onChange={() =>
                            setSolvers({
                                hiddenSingles: !solvers.hiddenSingles,
                            })
                        }
                    />
                    <i className="form-icon" /> Hidden singles
                </label>
            </li>
            <li className="menu-item">
                <label className="form-checkbox">
                    <input
                        type="checkbox"
                        checked={solvers.nakedPairs}
                        onChange={() =>
                            setSolvers({
                                nakedPairs: !solvers.nakedPairs,
                            })
                        }
                    />
                    <i className="form-icon" /> Naked pairs
                </label>
            </li>
            <li className="menu-item">
                <label className="form-checkbox">
                    <input
                        type="checkbox"
                        checked={solvers.hiddenPairs}
                        onChange={() =>
                            setSolvers({
                                hiddenPairs: !solvers.hiddenPairs,
                            })
                        }
                    />
                    <i className="form-icon" /> Hidden pairs
                </label>
            </li>
            <li className="menu-item">
                <label className="form-checkbox">
                    <input
                        type="checkbox"
                        checked={solvers.lockedCandidates}
                        onChange={() =>
                            setSolvers({
                                lockedCandidates: !solvers.lockedCandidates,
                            })
                        }
                    />
                    <i className="form-icon" /> Locked candidates
                </label>
            </li>
            <li className="menu-item">
                <label className="form-checkbox">
                    <input
                        type="checkbox"
                        checked={solvers.thermos}
                        onChange={() =>
                            setSolvers({
                                thermos: !solvers.thermos,
                            })
                        }
                    />
                    <i className="form-icon" /> Thermo sudoku
                </label>
            </li>
            <li className="menu-item">
                <label className="form-checkbox">
                    <input
                        type="checkbox"
                        checked={solvers.killerCages}
                        onChange={() =>
                            setSolvers({
                                killerCages: !solvers.killerCages,
                            })
                        }
                    />
                    <i className="form-icon" /> Killer sudoku
                </label>
            </li>
            <li className="menu-item">
                <label className="form-checkbox">
                    <input type="checkbox" disabled />
                    <i className="form-icon" /> Sandwich sudoku
                </label>
            </li>
            <li className="menu-item">
                <label className="form-checkbox">
                    <input
                        type="checkbox"
                        checked={solvers.antiKnight}
                        onChange={() =>
                            setSolvers({
                                antiKnight: !solvers.antiKnight,
                            })
                        }
                    />
                    <i className="form-icon" /> Anti-knight
                </label>
            </li>
            <li className="menu-item">
                <label className="form-checkbox">
                    <input
                        type="checkbox"
                        checked={solvers.antiKing}
                        onChange={() =>
                            setSolvers({
                                antiKing: !solvers.antiKing,
                            })
                        }
                    />
                    <i className="form-icon" /> Anti-king
                </label>
            </li>
            <li className="menu-item">
                <label className="form-checkbox">
                    <input type="checkbox" disabled />
                    <i className="form-icon" /> Unique diagonals
                </label>
            </li>
            <li className="menu-item">
                <label className="form-checkbox">
                    <input
                        type="checkbox"
                        checked={solvers.nonSeqNeighbors}
                        onChange={() =>
                            setSolvers({
                                nonSeqNeighbors: !solvers.nonSeqNeighbors,
                            })
                        }
                    />
                    <i className="form-icon" /> Non-sequential neighbors
                </label>
            </li>
            <li className="divider" />
            <li className="menu-item">
                <label className="form-checkbox">
                    <input
                        type="checkbox"
                        checked={lookaheadSolve}
                        onChange={() => setLookaheadSolve(!lookaheadSolve)}
                    />
                    <i className="form-icon" /> Enable look-ahead solve
                </label>
            </li>
            <li className="menu-item">
                <label className="form-checkbox">
                    <input
                        type="checkbox"
                        checked={stepSolve}
                        onChange={() => setStepSolve(!stepSolve)}
                    />
                    <i className="form-icon" /> Step-by-step solve
                </label>
            </li>
            <li className="menu-item">
                <button
                    className="btn-fake-link"
                    disabled={!stepSolve}
                    onClick={() => setShouldSolve(true)}
                >
                    <i className="icon icon-time mr-1" /> Run solve step
                </button>
            </li>
            <li className="menu-item">
                <button
                    className="btn-fake-link"
                    onClick={() => solveFromScratch()}
                >
                    <i className="icon icon-refresh mr-1" /> Solve from scratch
                </button>
            </li>
            <li className="divider" data-content="Restrictions" />
            <li className="menu-item">
                <label className="form-checkbox">
                    <input type="checkbox" disabled />
                    <i className="form-icon" /> Enable perimeter cells
                </label>
            </li>
            <li className="menu-item">
                <label className="form-checkbox">
                    <input
                        type="checkbox"
                        checked={restrictions.antiKnight}
                        onChange={() =>
                            setRestrictions({
                                antiKnight: !restrictions.antiKnight,
                            })
                        }
                    />
                    <i className="form-icon" /> Anti-knight
                </label>
            </li>
            <li className="menu-item">
                <label className="form-checkbox">
                    <input
                        type="checkbox"
                        checked={restrictions.antiKing}
                        onChange={() =>
                            setRestrictions({
                                antiKing: !restrictions.antiKing,
                            })
                        }
                    />
                    <i className="form-icon" /> Anti-king
                </label>
            </li>
            <li className="menu-item">
                <label className="form-checkbox">
                    <input
                        type="checkbox"
                        checked={restrictions.uniqueDiagonals}
                        onChange={() =>
                            setRestrictions({
                                uniqueDiagonals: !restrictions.uniqueDiagonals,
                            })
                        }
                    />
                    <i className="form-icon" /> Unique diagonals
                </label>
            </li>
            <li className="divider" data-content="Puzzle" />
            <li className="menu-item">
                <button className="btn-fake-link" onClick={() => reset()}>
                    <i className="icon icon-refresh mr-1" /> Reset grid
                </button>
            </li>
        </ul>
    );
};

export default ControlsMenu;
