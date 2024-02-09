import { SolutionCell } from 'types';
import { DispatchFn } from 'store';

import { load, persist } from './persist';
import { GetAction, _, action, merge } from './merge';

export interface SolverState {
    solution: SolutionCell[];
    algorithms: {
        hiddenSingles: boolean;
        nakedPairs: boolean;
        hiddenPairs: boolean;
        nakedTuples: boolean;
        lockedCandidates: boolean;
        xWing: boolean;
        yWing: boolean;
        thermos: boolean;
        arrows: boolean;
        killerCages: boolean;
        antiKing: boolean;
        antiKnight: boolean;
        uniqueDiagonals: boolean;
        nonSeqNeighbors: boolean;
    };
    dirty: boolean;
    solveOnChange: boolean;
    lookahead: boolean;
    stepSolve: boolean;
}

const defaultState = (): SolverState => ({
    solution: Array(81)
        .fill(null)
        .map(() => ({
            candidates: [1, 2, 3, 4, 5, 6, 7, 8, 9],
            invalidCandidates: [],
        })),
    algorithms: {
        hiddenSingles: true,
        nakedPairs: true,
        hiddenPairs: true,
        nakedTuples: true,
        lockedCandidates: true,
        xWing: true,
        yWing: true,
        thermos: true,
        arrows: true,
        killerCages: true,
        antiKing: false,
        antiKnight: false,
        uniqueDiagonals: false,
        nonSeqNeighbors: false,
    },
    dirty: false,
    lookahead: false,
    ...load('solver', {
        stepSolve: false,
        solveOnChange: true,
    }),
});

const clear = () => ({
    solution: Array(81)
        .fill(null)
        .map(() => ({
            candidates: [1, 2, 3, 4, 5, 6, 7, 8, 9],
            invalidCandidates: [],
        })),
});

const setSolution = action(
    _ as SolverState,
    _ as SolutionCell[],
    'solver/set-solution',
    (state, solution) => ({ ...state, solution, dirty: false })
);

const resetSolution = action(
    _ as SolverState,
    _ as undefined,
    'solver/reset-solution',
    (state) => ({ ...state, ...clear() })
);

const setAlgorithms = action(
    _ as SolverState,
    _ as Partial<SolverState['algorithms']>,
    'solver/set-algorithms',
    (state, algorithms) => ({
        ...state,
        algorithms: { ...state.algorithms, ...algorithms },
    })
);

const triggerSolve = action(
    _ as SolverState,
    _ as boolean | undefined,
    'solver/trigger-solve',
    (state, force) => ({
        ...state,
        dirty: force || state.solveOnChange,
    })
);

const triggerSolveFromScratch = action(
    _ as SolverState,
    _ as boolean | undefined,
    'solver/trigger-solve-from-scratch',
    (state) => ({
        ...state,
        ...clear(),
        dirty: true,
    })
);

const toggleLookahead = action(
    _ as SolverState,
    _ as boolean,
    'solver/toggle-lookahead',
    (state, lookahead) => ({
        ...state,
        lookahead,
    })
);

const setSolved = action(
    _ as SolverState,
    _ as undefined,
    'solver/set-solved',
    (state) => ({ ...state, dirty: false })
);

const toggleStepSolve = action(
    _ as SolverState,
    _ as boolean,
    'solver/toggle-step-solve',
    (state, stepSolve) => ({
        ...state,
        ...clear(),
        stepSolve,
    }),
    persist('solver', 'solveOnChange', 'stepSolve')
);

const toggleSolveOnChange = action(
    _ as SolverState,
    _ as boolean,
    'solver/toggle-solve-on-change',
    (state, solveOnChange, dispatch: DispatchFn) => {
        if (solveOnChange) {
            dispatch({
                type: 'solver/trigger-solve',
                payload: true,
            });
        }

        return {
            ...state,
            ...clear(),
            solveOnChange,
        };
    },
    persist('solver', 'solveOnChange', 'stepSolve')
);

const invalidateCandidates = action(
    _ as SolverState,
    _ as { index: number; candidates: number[] }[],
    'solver/invalidate-candidates',
    (state, candidateLists) => {
        const newSolution = [...state.solution];
        candidateLists.forEach(({ index, candidates }) => {
            newSolution[index].invalidCandidates.push(
                ...candidates.filter(
                    (n) => !newSolution[index].invalidCandidates.includes(n)
                )
            );
        });

        return { ...state, solution: newSolution };
    }
);

export type SolverAction =
    | GetAction<typeof setSolution>
    | GetAction<typeof resetSolution>
    | GetAction<typeof setAlgorithms>
    | GetAction<typeof triggerSolve>
    | GetAction<typeof triggerSolveFromScratch>
    | GetAction<typeof toggleLookahead>
    | GetAction<typeof setSolved>
    | GetAction<typeof toggleStepSolve>
    | GetAction<typeof toggleSolveOnChange>
    | GetAction<typeof invalidateCandidates>;

export default merge<SolverState>(
    defaultState(),
    setSolution,
    resetSolution,
    setAlgorithms,
    triggerSolve,
    triggerSolveFromScratch,
    toggleLookahead,
    setSolved,
    toggleStepSolve,
    toggleSolveOnChange,
    invalidateCandidates
);
