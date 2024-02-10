import useSelector from 'hooks/use-selector';
import useAction from 'hooks/use-action';
import Button from 'components/button';
import Menu, { MenuCollapse, MenuItem } from 'components/menu';
import Toggle from 'components/toggle';
import Tooltip from 'components/tooltip';

import './setter-controls-menu.scss';

const SetterSolveMenu = () => {
    const solveOnChange = useSelector((state) => state.solver.solveOnChange);
    const setSolveOnChange = useAction('solver/toggle-solve-on-change');
    const stepSolve = useSelector((state) => state.solver.stepSolve);
    const setStepSolve = useAction('solver/toggle-step-solve');
    const lookahead = useSelector((state) => state.solver.lookahead);
    const setLookahead = useAction('solver/toggle-lookahead');

    const algorithms = useSelector((state) => state.solver.algorithms);
    const setAlgorithms = useAction('shared/set-algorithms');

    const triggerSolve = useAction('solver/trigger-solve-from-scratch');

    return (
        <Menu exclusive className="controls">
            <MenuItem>
                <Toggle
                    checked={solveOnChange}
                    onChange={() => setSolveOnChange(!solveOnChange)}
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
                <Button primary wide onClick={() => triggerSolve(true)}>
                    <i className="fad fa-badge-check m-r-12" />
                    Solve
                </Button>
            </MenuItem>
            <MenuCollapse label="Sudoku solvers" expandedByDefault>
                <MenuItem>
                    <Tooltip
                        content={
                            <>
                                If a cell only has one candidate, then it must
                                be that value.
                            </>
                        }
                        anchor="left"
                    >
                        <Toggle checked disabled>
                            Naked singles
                        </Toggle>
                    </Tooltip>
                </MenuItem>
                <MenuItem>
                    <Tooltip
                        content={
                            <>
                                If a cell is the only position for a candidate
                                in the row, column, or box, then it must be that
                                value.
                            </>
                        }
                        anchor="left"
                    >
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
                    </Tooltip>
                </MenuItem>
                <MenuItem>
                    <Tooltip
                        content={
                            <>
                                If two cells in a row, column or box share
                                exactly two identical candidates, then those
                                digits cannot appear in any other cell that sees
                                both.
                            </>
                        }
                        anchor="left"
                    >
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
                    </Tooltip>
                </MenuItem>
                <MenuItem>
                    <Tooltip
                        content={
                            <>
                                If two cells in a row, column or box are the
                                only two that can contain two identical
                                candidates, then those cells cannot contain any
                                other digits.
                            </>
                        }
                        anchor="left"
                    >
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
                    </Tooltip>
                </MenuItem>
                <MenuItem>
                    <Tooltip
                        content={
                            <>
                                If <strong>N</strong> cells in a row, column or
                                box share exactly <strong>N</strong> identical
                                candidates, then those digits cannot appear in
                                any other cell that sees both.
                            </>
                        }
                        anchor="left"
                    >
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
                    </Tooltip>
                </MenuItem>
                <MenuItem>
                    <Tooltip
                        content={
                            <>
                                If a candidate is locked into a row or column
                                within a box, then it cannot appear in another
                                box in that row or column.
                            </>
                        }
                        anchor="left"
                    >
                        <Toggle
                            checked={algorithms.lockedCandidates}
                            onChange={() =>
                                setAlgorithms({
                                    lockedCandidates:
                                        !algorithms.lockedCandidates,
                                })
                            }
                        >
                            Locked candidates
                        </Toggle>
                    </Tooltip>
                </MenuItem>
                <MenuItem>
                    <Tooltip
                        content={
                            <>
                                If a candidate is locked into exactly two places
                                in two columns (i.e. forms an <strong>X</strong>
                                ), then it cannot appear elsewhere on the two
                                rows.
                            </>
                        }
                        anchor="left"
                    >
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
                    </Tooltip>
                </MenuItem>
                <MenuItem>
                    <Tooltip
                        content={
                            <>
                                If each of three cells in a L-shape contain
                                exactly two of a set of three candidates, then
                                the candidate that is shared between both ends
                                of the L can be removed from any other cell that
                                sees both.
                            </>
                        }
                        anchor="left"
                    >
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
                    </Tooltip>
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
