import { RootState, DispatchFn } from 'store';
import { _, action, merge, GetAction } from './merge';

// put reducers here if:
// - they require reading root state (or state from another slice)
// - they dispatch actions into two or more slices

const setCellValue = action(
    _ as RootState,
    _ as { index: number; value?: number },
    'shared/set-cell-value',
    (state, { index, value }, dispatch: DispatchFn) => {
        // TODO: switch where to place the digit based on sudoku mode
        dispatch({ type: 'puzzle/set-given', payload: { index, value } });

        // TODO: check if solving enabled
        const prevValue = state.sudoku.board[index].value;
        // solve from scratch if value changed (or deleted)
        const fromScratch = !!prevValue && value !== prevValue;
        dispatch({ type: 'solver/trigger-solve', payload: fromScratch });

        return state;
    }
);

const setRestrictions = action(
    _ as RootState,
    _ as Partial<RootState['sudoku']['restrictions']>,
    'shared/set-restrictions',
    (state, restrictions, dispatch: DispatchFn) => {
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
    }
);

const setAlgorithms = action(
    _ as RootState,
    _ as Partial<RootState['solver']['algorithms']>,
    'shared/set-algorithms',
    (state, algorithms, dispatch: DispatchFn) => {
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
    }
);

const reset = action(
    _ as RootState,
    _ as undefined,
    'shared/reset',
    (state, _, dispatch: DispatchFn) => {
        // TODO: if in player mode, don't reset the puzzle
        dispatch({ type: 'puzzle/reset', payload: undefined });
        dispatch(() => {
            window.location.hash = '';
        });

        // reset solution
        dispatch({ type: 'solver/reset-solution', payload: undefined });

        return state;
    }
);

export type SharedAction =
    | GetAction<typeof setCellValue>
    | GetAction<typeof setRestrictions>
    | GetAction<typeof setAlgorithms>
    | GetAction<typeof reset>;

export default merge<RootState>(
    undefined,
    setCellValue,
    setRestrictions,
    setAlgorithms,
    reset
);
