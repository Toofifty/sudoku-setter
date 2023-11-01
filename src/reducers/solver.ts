import { SolutionCell } from 'types';

export interface SolverState {
    solution: SolutionCell[];
    algorithms: {
        hiddenSingles: boolean;
        nakedPairs: boolean;
        hiddenPairs: boolean;
        nakedTuples: boolean;
        lockedCandidates: boolean;
        yWing: boolean;
        thermos: boolean;
        killerCages: boolean;
        antiKing: boolean;
        antiKnight: boolean;
        uniqueDiagonals: boolean;
        nonSeqNeighbors: boolean;
    };
    dirty: boolean;
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
        yWing: true,
        thermos: true,
        killerCages: true,
        antiKing: false,
        antiKnight: false,
        uniqueDiagonals: false,
        nonSeqNeighbors: false,
    },
    dirty: false,
    lookahead: false,
    stepSolve: false,
});

//

type Reducer<T extends { payload?: any }> = (
    state: SolverState,
    payload: T['payload']
) => SolverState;

const clear = () => ({
    solution: Array(81)
        .fill(null)
        .map(() => ({
            candidates: [1, 2, 3, 4, 5, 6, 7, 8, 9],
            invalidCandidates: [],
        })),
});

//

type SetSolution = { type: 'solver/set-solution'; payload: SolutionCell[] };

const setSolution: Reducer<SetSolution> = (state, solution) => ({
    ...state,
    solution,
    dirty: false,
});

type ResetSolution = { type: 'solver/reset-solution'; payload: undefined };

const resetSolution: Reducer<ResetSolution> = (state) => ({
    ...state,
    ...clear(),
});

type SetAlgorithms = {
    type: 'solver/set-algorithms';
    payload: Partial<SolverState['algorithms']>;
};

const setAlgorithms: Reducer<SetAlgorithms> = (state, algorithms) => ({
    ...state,
    algorithms: { ...state.algorithms, ...algorithms },
});

type TriggerSolve = {
    type: 'solver/trigger-solve';
    payload?: boolean;
};

const triggerSolve: Reducer<TriggerSolve> = (state, fromScratch) => ({
    ...state,
    ...(fromScratch ? clear() : {}),
    dirty: true,
});

type ToggleLookahead = {
    type: 'solver/toggle-lookahead';
    payload: boolean;
};

const toggleLookahead: Reducer<ToggleLookahead> = (state, lookahead) => ({
    ...state,
    lookahead,
});

type SetSolved = {
    type: 'solver/set-solved';
    payload: undefined;
};

const setSolved: Reducer<SetSolved> = (state) => ({ ...state, dirty: false });

type ToggleStepSolve = {
    type: 'solver/toggle-step-solve';
    payload: boolean;
};

const toggleStepSolve: Reducer<ToggleStepSolve> = (state, stepSolve) => ({
    ...state,
    ...clear(),
    stepSolve,
});

type InvalidateCandidates = {
    type: 'solver/invalidate-candidates';
    payload: { index: number; candidates: number[] }[];
};

const invalidateCandidates: Reducer<InvalidateCandidates> = (
    state,
    candidateLists
) => {
    const newSolution = [...state.solution];
    candidateLists.forEach(({ index, candidates }) => {
        newSolution[index].invalidCandidates.push(
            ...candidates.filter(
                (n) => !newSolution[index].invalidCandidates.includes(n)
            )
        );
    });

    return { ...state, solution: newSolution };
};

export type SolverAction =
    | SetSolution
    | ResetSolution
    | SetAlgorithms
    | TriggerSolve
    | SetSolved
    | ToggleLookahead
    | ToggleStepSolve
    | InvalidateCandidates;

export default (state = defaultState(), action: SolverAction) => {
    switch (action.type) {
        case 'solver/set-solution':
            return setSolution(state, action.payload);
        case 'solver/reset-solution':
            return resetSolution(state, action.payload);
        case 'solver/set-algorithms':
            return setAlgorithms(state, action.payload);
        case 'solver/trigger-solve':
            return triggerSolve(state, action.payload);
        case 'solver/set-solved':
            return setSolved(state, action.payload);
        case 'solver/toggle-lookahead':
            return toggleLookahead(state, action.payload);
        case 'solver/toggle-step-solve':
            return toggleStepSolve(state, action.payload);
        case 'solver/invalidate-candidates':
            return invalidateCandidates(state, action.payload);
        default:
            return state;
    }
};
