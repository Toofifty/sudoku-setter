import React from 'react';
import useSelector from 'hooks/use-selector';
import useAction from 'hooks/use-action';
import Button from 'components/button';
import Menu, { MenuCollapse, MenuItem } from 'components/menu';
import Toggle from 'components/toggle';
import './setter-controls-menu.scss';

const SetterSolveMenu = () => {
    const stepSolve = useSelector((state) => state.solver.stepSolve);
    const setStepSolve = useAction('solver/toggle-step-solve');
    const lookahead = useSelector((state) => state.solver.lookahead);
    const setLookahead = useAction('solver/toggle-lookahead');

    const algorithms = useSelector((state) => state.solver.algorithms);
    const setAlgorithms = useAction('shared/set-algorithms');

    const triggerSolve = useAction('solver/trigger-solve');

    return (
        <Menu exclusive className="controls">
            <MenuItem>
                <Toggle
                    checked={lookahead}
                    onChange={() => setLookahead(!lookahead)}
                >
                    Solve on change
                </Toggle>
            </MenuItem>
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
            <MenuCollapse label="Sudoku solvers" expandedByDefault>
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
            </MenuCollapse>
            <MenuCollapse label="Variant solvers">
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
        </Menu>
    );
};

export default SetterSolveMenu;
