import React from 'react';
import useSelector from 'hooks/use-selector';
import useAction from 'hooks/use-action';
import Button from 'components/button';
import Menu from 'components/menu';
import './controls-menu.scss';
import Toggle from 'components/toggle';

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
        <Menu className="controls">
            <Menu.Item className="m-y-1">
                <Button
                    primary
                    wide
                    href={`puzzle/${window.location.hash}`}
                    target="blank"
                >
                    <i className="fa fa-play m-r-12" />
                    Test puzzle
                </Button>
            </Menu.Item>
            <Menu.Divider label="View" />
            <Menu.Item className="m-y-1">
                <Toggle
                    sw
                    checked={debugMode}
                    onChange={() => toggleDebugMode()}
                >
                    Debug mode
                </Toggle>
            </Menu.Item>
            <Menu.Item className="m-y-1">
                <Toggle
                    sw
                    checked={hideSolution}
                    onChange={() => toggleHideSolution()}
                >
                    Hide solution
                </Toggle>
            </Menu.Item>
            <Menu.Divider label="Solving algorithms" />
            <Menu.Item className="m-y-1">
                <Toggle checked disabled>
                    Naked singles
                </Toggle>
            </Menu.Item>
            <Menu.Item className="m-y-1">
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
            <Menu.Item className="m-y-1">
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
            <Menu.Item className="m-y-1">
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
            <Menu.Item className="m-y-1">
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
            <Menu.Item className="m-y-1">
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
            <Menu.Item className="m-y-1">
                <Toggle
                    checked={algorithms.killerCages}
                    onChange={() =>
                        setAlgorithms({
                            killerCages: !algorithms.killerCages,
                        })
                    }
                >
                    Killer cages sudoku
                </Toggle>
            </Menu.Item>
            <Menu.Item className="m-y-1">
                <Toggle disabled>Sandwich sudoku</Toggle>
            </Menu.Item>
            <Menu.Item className="m-y-1">
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
            <Menu.Item className="m-y-1">
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
            <Menu.Item className="m-y-1">
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
            <Menu.Item className="m-y-1">
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
            <Menu.Divider />
            <Menu.Item className="m-y-1">
                <Toggle
                    checked={lookahead}
                    onChange={() => setLookahead(!lookahead)}
                >
                    Enable look-ahead solve
                </Toggle>
            </Menu.Item>
            <Menu.Item className="m-y-1">
                <Toggle
                    checked={stepSolve}
                    onChange={() => setStepSolve(!stepSolve)}
                >
                    Step-by-step solve
                </Toggle>
            </Menu.Item>
            <Menu.Item className="m-y-1">
                <Button wide onClick={() => triggerSolve()}>
                    <i className="fa fa-stopwatch m-r-12" />
                    Run solve step
                </Button>
            </Menu.Item>
            <Menu.Item className="m-y-1">
                <Button wide onClick={() => triggerSolve(true)}>
                    <i className="fa fa-redo m-r-12" />
                    Solve from scratch
                </Button>
            </Menu.Item>
            <li className="divider" data-content="Restrictions" />
            <Menu.Item className="m-y-1">
                <Toggle disabled>Enable perimeter cells</Toggle>
            </Menu.Item>
            <Menu.Item className="m-y-1">
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
            <Menu.Item className="m-y-1">
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
            <Menu.Item className="m-y-1">
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
            <li className="divider" data-content="Puzzle" />
            <Menu.Item className="m-y-1">
                <Button wide onClick={() => reset()}>
                    <i className="fa fa-times m-r-12" />
                    Reset grid
                </Button>
            </Menu.Item>
        </Menu>
    );
};

export default ControlsMenu;
