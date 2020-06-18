import React from 'react';
import useSelector from 'hooks/use-selector';
import useAction from 'hooks/use-action';
import './controls-menu.scss';

const ControlsMenu = () => {
    const debugMode = useSelector((state) => state.ui.debugMode);
    const toggleDebugMode = useAction('ui/toggle-debug-mode');
    const hideSolution = useSelector((state) => state.ui.hideSolution);
    const toggleHideSolution = useAction('ui/toggle-hide-solution');

    const stepSolve = useSelector((state) => state.solver.stepSolve);
    const setStepSolve = useAction('solver/toggle-step-solve');
    const lookahead = useSelector((state) => state.solver.lookahead);
    const setLookahead = useAction('solver/toggle-lookahead');

    const algorithms = useSelector((state) => state.solver.algorithms);
    const setAlgorithms = useAction('shared/set-algorithms');
    const restrictions = useSelector((state) => state.puzzle.restrictions);
    const setRestrictions = useAction('shared/set-restrictions');

    const triggerSolve = useAction('solver/trigger-solve');

    const _reset = useAction('shared/reset');

    const reset = () => {
        _reset();
        window.location.hash = '';
    };

    return (
        <ul className="controls menu">
            <li className="menu-item">
                <a href={`puzzle/${window.location.hash}`} target="blank">
                    <i className="icon icon-share mr-1" /> Test puzzle
                </a>
            </li>
            <li className="divider" data-content="View" />
            <li className="menu-item">
                <label className="form-switch">
                    <input
                        type="checkbox"
                        checked={debugMode}
                        onChange={() => toggleDebugMode()}
                    />
                    <i className="form-icon" /> Debug mode
                </label>
            </li>
            <li className="menu-item">
                <label className="form-switch">
                    <input
                        type="checkbox"
                        checked={hideSolution}
                        onChange={() => toggleHideSolution()}
                    />
                    <i className="form-icon" /> Hide solution
                </label>
            </li>
            <li className="divider" data-content="Solving algorithms" />
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
                        checked={algorithms.hiddenSingles}
                        onChange={() =>
                            setAlgorithms({
                                hiddenSingles: !algorithms.hiddenSingles,
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
                        checked={algorithms.nakedPairs}
                        onChange={() =>
                            setAlgorithms({
                                nakedPairs: !algorithms.nakedPairs,
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
                        checked={algorithms.hiddenPairs}
                        onChange={() =>
                            setAlgorithms({
                                hiddenPairs: !algorithms.hiddenPairs,
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
                        checked={algorithms.lockedCandidates}
                        onChange={() =>
                            setAlgorithms({
                                lockedCandidates: !algorithms.lockedCandidates,
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
                        checked={algorithms.thermos}
                        onChange={() =>
                            setAlgorithms({
                                thermos: !algorithms.thermos,
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
                        checked={algorithms.killerCages}
                        onChange={() =>
                            setAlgorithms({
                                killerCages: !algorithms.killerCages,
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
                        checked={algorithms.antiKnight}
                        onChange={() =>
                            setAlgorithms({
                                antiKnight: !algorithms.antiKnight,
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
                        checked={algorithms.antiKing}
                        onChange={() =>
                            setAlgorithms({
                                antiKing: !algorithms.antiKing,
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
                        checked={algorithms.uniqueDiagonals}
                        onChange={() =>
                            setAlgorithms({
                                uniqueDiagonals: !algorithms.uniqueDiagonals,
                            })
                        }
                    />
                    <i className="form-icon" /> Unique diagonals
                </label>
            </li>
            <li className="menu-item">
                <label className="form-checkbox">
                    <input
                        type="checkbox"
                        checked={algorithms.nonSeqNeighbors}
                        onChange={() =>
                            setAlgorithms({
                                nonSeqNeighbors: !algorithms.nonSeqNeighbors,
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
                        checked={lookahead}
                        onChange={() => setLookahead(!lookahead)}
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
                    onClick={() => triggerSolve()}
                >
                    <i className="icon icon-time mr-1" /> Run solve step
                </button>
            </li>
            <li className="menu-item">
                <button
                    className="btn-fake-link"
                    onClick={() => triggerSolve(true)}
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
