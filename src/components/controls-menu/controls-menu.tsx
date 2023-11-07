import React from 'react';
import useSelector from 'hooks/use-selector';
import useAction from 'hooks/use-action';
import Button from 'components/button';
import Menu, { MenuCollapse, MenuDivider, MenuItem } from 'components/menu';
import './controls-menu.scss';
import Toggle from 'components/toggle';
import SettingsModal from 'components/settings-modal';
import useModal from 'hooks/use-modal';

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

    const openSettingsModal = useModal(
        <SettingsModal onClose={() => openSettingsModal(false)} />
    );

    const reset = () => {
        _reset();
        window.location.hash = '';
    };

    return (
        <Menu exclusive className="controls">
            <MenuItem>
                <Button
                    primary
                    wide
                    href={`/puzzle/${window.location.hash}`}
                    target="blank"
                >
                    <i className="fad fa-play m-r-12" />
                    Test puzzle
                </Button>
            </MenuItem>
            <MenuCollapse label="View">
                <MenuItem>
                    <Toggle
                        sw
                        checked={debugMode}
                        onChange={() => toggleDebugMode()}
                    >
                        Debug mode
                    </Toggle>
                </MenuItem>
                <MenuItem>
                    <Toggle
                        sw
                        checked={hideSolution}
                        onChange={() => toggleHideSolution()}
                    >
                        Hide solution
                    </Toggle>
                </MenuItem>
                <MenuItem>
                    <Button wide onClick={() => openSettingsModal(true)}>
                        <i className="fad fa-wrench m-r-12" />
                        Player settings
                    </Button>
                </MenuItem>
            </MenuCollapse>
            <MenuCollapse label="Restrictions">
                <MenuItem>
                    <Toggle disabled>Enable perimeter cells</Toggle>
                </MenuItem>
                <MenuItem>
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
                </MenuItem>
                <MenuItem>
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
                </MenuItem>
                <MenuItem>
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
                </MenuItem>
            </MenuCollapse>
            <MenuCollapse label="Solve algorithms" expandedByDefault>
                <MenuItem>
                    <Toggle checked disabled>
                        Naked singles
                    </Toggle>
                </MenuItem>
                <MenuItem>
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
                </MenuItem>
                <MenuItem>
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
                </MenuItem>
                <MenuItem>
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
                </MenuItem>
                <MenuItem>
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
                </MenuItem>
                <MenuItem>
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
                </MenuItem>
                <MenuItem>
                    <Toggle
                        checked={algorithms.xWing}
                        onChange={() =>
                            setAlgorithms({
                                xWing: !algorithms.xWing,
                            })
                        }
                    >
                        X-wings
                    </Toggle>
                </MenuItem>
                <MenuItem>
                    <Toggle
                        checked={algorithms.yWing}
                        onChange={() =>
                            setAlgorithms({
                                yWing: !algorithms.yWing,
                            })
                        }
                    >
                        Y-wings
                    </Toggle>
                </MenuItem>
                <MenuItem>
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
                </MenuItem>
                <MenuItem>
                    <Toggle
                        checked={algorithms.arrows}
                        onChange={() =>
                            setAlgorithms({
                                arrows: !algorithms.arrows,
                            })
                        }
                    >
                        Arrow sudoku
                    </Toggle>
                </MenuItem>
                <MenuItem>
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
                </MenuItem>
                <MenuItem>
                    <Toggle disabled>Sandwich sudoku</Toggle>
                </MenuItem>
                <MenuItem>
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
                </MenuItem>
                <MenuItem>
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
                </MenuItem>
                <MenuItem>
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
                </MenuItem>
                <MenuItem>
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
                </MenuItem>
            </MenuCollapse>
            <MenuCollapse label="Solve configuration">
                <MenuItem>
                    <Toggle
                        checked={lookahead}
                        onChange={() => setLookahead(!lookahead)}
                    >
                        Enable look-ahead solve
                    </Toggle>
                </MenuItem>
                <MenuItem>
                    <Toggle
                        checked={stepSolve}
                        onChange={() => setStepSolve(!stepSolve)}
                    >
                        Step-by-step solve
                    </Toggle>
                </MenuItem>
                <MenuItem>
                    <Button wide onClick={() => triggerSolve()}>
                        <i className="fad fa-stopwatch m-r-12" />
                        Run solve step
                    </Button>
                </MenuItem>
                <MenuItem>
                    <Button wide onClick={() => triggerSolve(true)}>
                        <i className="fad fa-redo m-r-12" />
                        Solve from scratch
                    </Button>
                </MenuItem>
            </MenuCollapse>
            <MenuDivider label="Puzzle" />
            <MenuItem>
                <Button wide onClick={() => reset()}>
                    <i className="fad fa-times m-r-12" />
                    Reset grid
                </Button>
            </MenuItem>
            <MenuItem>
                <Button wide disabled onClick={() => {}}>
                    <i className="fad fa-save m-r-12" />
                    Save draft
                </Button>
            </MenuItem>
            <MenuItem>
                <Button wide primary disabled onClick={() => {}}>
                    <i className="fad fa-check m-r-12" />
                    Publish
                </Button>
            </MenuItem>
        </Menu>
    );
};

export default ControlsMenu;
