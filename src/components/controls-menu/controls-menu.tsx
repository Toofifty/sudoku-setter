import React, { useState } from 'react';
import useSelector from 'hooks/use-selector';
import useAction from 'hooks/use-action';
import Button from 'components/button';
import Menu from 'components/menu';
import './controls-menu.scss';
import Toggle from 'components/toggle';
import SettingsModal from 'components/settings-modal';

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

    const [showSettingsModal, setShowSettingsModal] = useState(false);

    const reset = () => {
        _reset();
        window.location.hash = '';
    };

    return (
        <Menu className="controls">
            <Menu.Item>
                <Button
                    primary
                    wide
                    href={`puzzle/${window.location.hash}`}
                    target="blank"
                >
                    <i className="fad fa-play m-r-12" />
                    Test puzzle
                </Button>
            </Menu.Item>
            <Menu.Collapse label="View">
                <Menu.Item>
                    <Toggle
                        sw
                        checked={debugMode}
                        onChange={() => toggleDebugMode()}
                    >
                        Debug mode
                    </Toggle>
                </Menu.Item>
                <Menu.Item>
                    <Toggle
                        sw
                        checked={hideSolution}
                        onChange={() => toggleHideSolution()}
                    >
                        Hide solution
                    </Toggle>
                </Menu.Item>
                <Menu.Item>
                    <Button wide onClick={() => setShowSettingsModal(true)}>
                        <i className="fad fa-wrench m-r-12" />
                        Player settings
                    </Button>
                    {showSettingsModal && (
                        <SettingsModal
                            onClose={() => setShowSettingsModal(false)}
                        />
                    )}
                </Menu.Item>
            </Menu.Collapse>
            <Menu.Collapse label="Restrictions">
                <Menu.Item>
                    <Toggle disabled>Enable perimeter cells</Toggle>
                </Menu.Item>
                <Menu.Item>
                    <Toggle
                        checked={restrictions.antiKnight}
                        onChange={() =>
                            setRestrictions({
                                antiKnight: !restrictions.antiKnight,
                            })
                        }
                    >
                        Anti-knight
                    </Toggle>
                </Menu.Item>
                <Menu.Item>
                    <Toggle
                        checked={restrictions.antiKing}
                        onChange={() =>
                            setRestrictions({
                                antiKing: !restrictions.antiKing,
                            })
                        }
                    >
                        Anti-king
                    </Toggle>
                </Menu.Item>
                <Menu.Item>
                    <Toggle
                        checked={restrictions.uniqueDiagonals}
                        onChange={() =>
                            setRestrictions({
                                uniqueDiagonals: !restrictions.uniqueDiagonals,
                            })
                        }
                    >
                        Unique diagonals
                    </Toggle>
                </Menu.Item>
            </Menu.Collapse>
            <Menu.Collapse label="Solve algorithms" expandedByDefault>
                <Menu.Item>
                    <Toggle checked disabled>
                        Naked singles
                    </Toggle>
                </Menu.Item>
                <Menu.Item>
                    <Toggle
                        checked={algorithms.hiddenSingles}
                        onChange={() =>
                            setAlgorithms({
                                hiddenSingles: !algorithms.hiddenSingles,
                            })
                        }
                    >
                        Hidden singles
                    </Toggle>
                </Menu.Item>
                <Menu.Item>
                    <Toggle
                        checked={algorithms.nakedPairs}
                        onChange={() =>
                            setAlgorithms({
                                nakedPairs: !algorithms.nakedPairs,
                            })
                        }
                    >
                        Naked pairs
                    </Toggle>
                </Menu.Item>
                <Menu.Item>
                    <Toggle
                        checked={algorithms.hiddenPairs}
                        onChange={() =>
                            setAlgorithms({
                                hiddenPairs: !algorithms.hiddenPairs,
                            })
                        }
                    >
                        Hidden pairs
                    </Toggle>
                </Menu.Item>
                <Menu.Item>
                    <Toggle
                        checked={algorithms.nakedTuples}
                        onChange={() =>
                            setAlgorithms({
                                nakedTuples: !algorithms.nakedTuples,
                            })
                        }
                    >
                        Naked tuples (3+)
                    </Toggle>
                </Menu.Item>
                <Menu.Item>
                    <Toggle
                        checked={algorithms.lockedCandidates}
                        onChange={() =>
                            setAlgorithms({
                                lockedCandidates: !algorithms.lockedCandidates,
                            })
                        }
                    >
                        Locked candidates
                    </Toggle>
                </Menu.Item>
                <Menu.Item>
                    <Toggle
                        checked={algorithms.yWing}
                        onChange={() =>
                            setAlgorithms({
                                yWing: !algorithms.yWing,
                            })
                        }
                    >
                        Y-Wings
                    </Toggle>
                </Menu.Item>
                <Menu.Item>
                    <Toggle
                        checked={algorithms.thermos}
                        onChange={() =>
                            setAlgorithms({
                                thermos: !algorithms.thermos,
                            })
                        }
                    >
                        Thermo sudoku
                    </Toggle>
                </Menu.Item>
                <Menu.Item>
                    <Toggle
                        checked={algorithms.killerCages}
                        onChange={() =>
                            setAlgorithms({
                                killerCages: !algorithms.killerCages,
                            })
                        }
                    >
                        Killer cage sudoku
                    </Toggle>
                </Menu.Item>
                <Menu.Item>
                    <Toggle disabled>Sandwich sudoku</Toggle>
                </Menu.Item>
                <Menu.Item>
                    <Toggle
                        checked={algorithms.antiKnight}
                        onChange={() =>
                            setAlgorithms({
                                antiKnight: !algorithms.antiKnight,
                            })
                        }
                    >
                        Anti-knight
                    </Toggle>
                </Menu.Item>
                <Menu.Item>
                    <Toggle
                        checked={algorithms.antiKing}
                        onChange={() =>
                            setAlgorithms({
                                antiKing: !algorithms.antiKing,
                            })
                        }
                    >
                        Anti-king
                    </Toggle>
                </Menu.Item>
                <Menu.Item>
                    <Toggle
                        checked={algorithms.uniqueDiagonals}
                        onChange={() =>
                            setAlgorithms({
                                uniqueDiagonals: !algorithms.uniqueDiagonals,
                            })
                        }
                    >
                        Unique diagonals
                    </Toggle>
                </Menu.Item>
                <Menu.Item>
                    <Toggle
                        checked={algorithms.nonSeqNeighbors}
                        onChange={() =>
                            setAlgorithms({
                                nonSeqNeighbors: !algorithms.nonSeqNeighbors,
                            })
                        }
                    >
                        Non-sequential neighbors
                    </Toggle>
                </Menu.Item>
            </Menu.Collapse>
            <Menu.Collapse label="Solve configuration">
                <Menu.Item>
                    <Toggle
                        checked={lookahead}
                        onChange={() => setLookahead(!lookahead)}
                    >
                        Enable look-ahead solve
                    </Toggle>
                </Menu.Item>
                <Menu.Item>
                    <Toggle
                        checked={stepSolve}
                        onChange={() => setStepSolve(!stepSolve)}
                    >
                        Step-by-step solve
                    </Toggle>
                </Menu.Item>
                <Menu.Item>
                    <Button wide onClick={() => triggerSolve()}>
                        <i className="fad fa-stopwatch m-r-12" />
                        Run solve step
                    </Button>
                </Menu.Item>
                <Menu.Item>
                    <Button wide onClick={() => triggerSolve(true)}>
                        <i className="fad fa-redo m-r-12" />
                        Solve from scratch
                    </Button>
                </Menu.Item>
            </Menu.Collapse>
            <Menu.Divider label="Puzzle" />
            <Menu.Item>
                <Button wide onClick={() => reset()}>
                    <i className="fad fa-times m-r-12" />
                    Reset grid
                </Button>
            </Menu.Item>
            <Menu.Item>
                <Button wide disabled onClick={() => {}}>
                    <i className="fad fa-save m-r-12" />
                    Save draft
                </Button>
            </Menu.Item>
            <Menu.Item>
                <Button wide primary disabled onClick={() => {}}>
                    <i className="fad fa-check m-r-12" />
                    Publish
                </Button>
            </Menu.Item>
        </Menu>
    );
};

export default ControlsMenu;
