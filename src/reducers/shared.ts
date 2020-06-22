import { RootState, DispatchFn } from 'store';
import { _, action, merge, GetAction } from './merge';
import { isPlayModeSelector } from 'utils/selectors';

// put reducers here if:
// - they require reading root state (or state from another slice)
// - they dispatch actions into two or more slices

const setCellValue = action(
    _ as RootState,
    _ as { index: number; value?: number },
    'shared/set-cell-value',
    (state, { index, value }, dispatch: DispatchFn) => {
        const isPlayMode = isPlayModeSelector(state);
        if (isPlayMode) {
            dispatch({
                type: 'player/set-cell-value',
                payload: [{ index, value }],
            });
        } else {
            dispatch({ type: 'puzzle/set-given', payload: { index, value } });
        }

        // TODO: check if solving enabled
        const prevValue = state.puzzle.board[index].value;
        // solve from scratch if value changed (or deleted)
        const fromScratch = !!prevValue && value !== prevValue;
        dispatch({ type: 'solver/trigger-solve', payload: fromScratch });

        return state;
    }
);

const setSelectionValue = action(
    _ as RootState,
    _ as number | undefined,
    'shared/set-selection-value',
    (state, value, dispatch: DispatchFn) => {
        const isPlayMode = isPlayModeSelector(state);
        let fromScratchSolve = false;
        if (isPlayMode) {
            if (state.ui.selection.length === 0) return state;

            dispatch({
                type: 'player/set-cell-value',
                payload: state.ui.selection.map((index) => ({ index, value })),
            });
            fromScratchSolve = state.ui.selection.some((index) => {
                const prevValue = state.puzzle.board[index].value;
                return !!prevValue && value !== prevValue;
            });
        } else {
            if (state.ui.focused === undefined) return state;

            dispatch({
                type: 'puzzle/set-given',
                payload: { index: state.ui.focused, value },
            });
            const prevValue = state.puzzle.board[state.ui.focused].value;
            fromScratchSolve = !!prevValue && value !== prevValue;
        }

        // TODO: check if solving enabled
        dispatch({ type: 'solver/trigger-solve', payload: fromScratchSolve });

        return state;
    }
);

const setRestrictions = action(
    _ as RootState,
    _ as Partial<RootState['puzzle']['restrictions']>,
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
                if (value && algorithm in state.puzzle.restrictions) {
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

const createThermo = action(
    _ as RootState,
    _ as number[],
    'shared/create-thermo',
    (state, thermo, dispatch: DispatchFn) => {
        dispatch({ type: 'puzzle/create-thermo', payload: thermo });
        dispatch({ type: 'solver/trigger-solve', payload: false });

        return state;
    }
);

const deleteThermo = action(
    _ as RootState,
    _ as number,
    'shared/delete-thermo',
    (state, index, dispatch: DispatchFn) => {
        dispatch({ type: 'puzzle/delete-thermo', payload: index });
        dispatch({ type: 'solver/trigger-solve', payload: true });

        return state;
    }
);

const createKillerCage = action(
    _ as RootState,
    _ as { total: number; cage: number[] },
    'shared/create-killer-cage',
    (state, killerCage, dispatch: DispatchFn) => {
        dispatch({ type: 'puzzle/create-killer-cage', payload: killerCage });
        dispatch({ type: 'solver/trigger-solve', payload: false });

        return state;
    }
);

const deleteKillerCage = action(
    _ as RootState,
    _ as number,
    'shared/delete-killer-cage',
    (state, index, dispatch: DispatchFn) => {
        dispatch({ type: 'puzzle/delete-killer-cage', payload: index });
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

const undo = action(
    _ as RootState,
    _ as undefined,
    'shared/undo',
    (state, _, dispatch: DispatchFn) => {
        const isPlayMode = isPlayModeSelector(state);
        if (isPlayMode) {
            dispatch({ type: 'player/undo', payload: undefined });
        } else {
            dispatch({ type: 'puzzle/undo', payload: undefined });
        }
        dispatch({ type: 'solver/trigger-solve', payload: true });

        return state;
    }
);

const redo = action(
    _ as RootState,
    _ as undefined,
    'shared/redo',
    (state, _, dispatch: DispatchFn) => {
        const isPlayMode = isPlayModeSelector(state);
        if (isPlayMode) {
            dispatch({ type: 'player/redo', payload: undefined });
        } else {
            dispatch({ type: 'puzzle/redo', payload: undefined });
        }
        dispatch({ type: 'solver/trigger-solve', payload: true });

        return state;
    }
);

export type SharedAction =
    | GetAction<typeof setCellValue>
    | GetAction<typeof setSelectionValue>
    | GetAction<typeof setRestrictions>
    | GetAction<typeof setAlgorithms>
    | GetAction<typeof createThermo>
    | GetAction<typeof deleteThermo>
    | GetAction<typeof createKillerCage>
    | GetAction<typeof deleteKillerCage>
    | GetAction<typeof reset>
    | GetAction<typeof undo>
    | GetAction<typeof redo>;

export default merge<RootState>(
    undefined,
    setCellValue,
    setSelectionValue,
    setRestrictions,
    setAlgorithms,
    createThermo,
    deleteThermo,
    createKillerCage,
    deleteKillerCage,
    reset,
    undo,
    redo
);
