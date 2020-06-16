import { RootState, WithDispatch, DispatchFn } from 'store';
import { RootActionType } from 'reducers';

// put reducers here if:
// - they require reading root state (or state from another slice)
// - they dispatch actions into two or more slices

type Reducer<T extends { payload: any }> = (
    state: RootState,
    payload: T['payload'],
    dispatch: DispatchFn
) => RootState;

type SetCellValue = {
    type: 'shared/set-cell-value';
    payload: { index: number; value?: number };
};

const setCellValue: Reducer<SetCellValue> = (
    state,
    { index, value },
    dispatch
) => {
    // TODO: switch where to place the digit based on sudoku mode
    dispatch({ type: 'puzzle/set-given', payload: { index, value } });

    // TODO: check if solving enabled
    const prevValue = state.sudoku.board[index].value;
    // solve from scratch if value changed (or deleted)
    const fromScratch = !!prevValue && value !== prevValue;
    dispatch({ type: 'solver/trigger-solve', payload: fromScratch });

    return state;
};

type SetRestrictions = {
    type: 'shared/set-restrictions';
    payload: Partial<RootState['sudoku']['restrictions']>;
};

const setRestrictions: Reducer<SetRestrictions> = (
    state,
    restrictions,
    dispatch
) => {
    dispatch({ type: 'puzzle/set-restrictions', payload: restrictions });

    // enable/disable relevant algorithms automatically
    // TODO: check if solving enabled
    const algorithms = Object.entries(restrictions).reduce(
        (acc, [restriction, value]) => {
            if (restriction in state.solver.algorithms) {
                return { acc, [restriction]: value };
            }
            return acc;
        },
        {} as any
    );
    dispatch({ type: 'solver/set-algorithms', payload: algorithms });
    dispatch({ type: 'solver/trigger-solve', payload: true });

    return state;
};

type SetAlgorithms = {
    type: 'shared/set-algorithms';
    payload: Partial<RootState['solver']['algorithms']>;
};

const setAlgorithms: Reducer<SetAlgorithms> = (state, algorithms, dispatch) => {
    dispatch({ type: 'solver/set-algorithms', payload: algorithms });

    // enable relevant restrictions automatically
    const restrictions = Object.entries(algorithms).reduce(
        (acc, [algorithm, value]) => {
            if (value && algorithm in state.sudoku.restrictions) {
                return { acc, [algorithm]: true };
            }
            return acc;
        },
        {} as any
    );
    dispatch({ type: 'puzzle/set-restrictions', payload: restrictions });
    dispatch({ type: 'solver/trigger-solve', payload: true });

    return state;
};

type Reset = {
    type: 'shared/reset';
    payload: undefined;
};

const reset: Reducer<Reset> = (state, _, dispatch) => {
    // TODO: if in player mode, don't reset the puzzle
    dispatch({ type: 'puzzle/reset', payload: undefined });
    dispatch(() => {
        window.location.hash = '';
    });

    // reset solution
    dispatch({ type: 'solver/reset-solution', payload: undefined });

    return state;
};

export type SharedAction =
    | SetCellValue
    | SetRestrictions
    | SetAlgorithms
    | Reset;

export default (
    state: RootState | undefined,
    action: RootActionType & WithDispatch
) => {
    if (!state) return state;
    switch (action.type) {
        case 'shared/set-cell-value':
            return setCellValue(state, action.payload, action.dispatch);
        case 'shared/set-restrictions':
            return setRestrictions(state, action.payload, action.dispatch);
        case 'shared/set-algorithms':
            return setAlgorithms(state, action.payload, action.dispatch);
        case 'shared/reset':
            return reset(state, action.payload, action.dispatch);
        default:
            return state;
    }
};
