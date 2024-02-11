import { DispatchFn, RootState } from 'store';
import { isPlayModeSelector } from 'utils/selectors';
import { Arrow, KillerCage, Thermo } from 'utils/sudoku-types';

import { GetAction, _, action, merge } from './merge';
import { SetterInputMode } from './setter';
import { InteractionData } from './interaction-handlers/types';
import { interactionHandlers } from './interaction-handlers';

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
                payload: {
                    selection: [index],
                    value,
                },
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
            const { selection } = state.ui;
            if (selection.length === 0) return state;

            // ignore changes to given cells
            const filteredSelection = selection.filter(
                (index) => !state.puzzle.board[index].value
            );

            dispatch({
                type: 'player/set-cell-value',
                payload: {
                    selection: filteredSelection,
                    value,
                },
            });

            dispatch({
                type: 'player/calculate-errors',
                payload: {
                    givens: state.puzzle.board,
                },
            });

            fromScratchSolve = selection.some((index) => {
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

const swapPencilMarks = action(
    _ as RootState,
    _ as unknown,
    'shared/swap-pencil-marks',
    (state, _, dispatch) => {
        const selection = state.ui.selection;
        if (selection.length > 0) {
            dispatch({ type: 'player/swap-pencil-marks', payload: selection });
        }
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

const setSetterInputMode = action(
    _ as RootState,
    _ as SetterInputMode,
    'shared/set-setter-input-mode',
    (state, inputMode, dispatch: DispatchFn) => {
        if (inputMode !== 'digit') {
            dispatch({ type: 'ui/clear-focus', payload: undefined });
        }

        dispatch({ type: 'setter/set-input-mode', payload: inputMode });
        dispatch({
            type: 'ui/set-interaction-handler',
            payload: interactionHandlers[inputMode],
        });
        return state;
    }
);

const createThermo = action(
    _ as RootState,
    _ as Thermo,
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

const createArrow = action(
    _ as RootState,
    _ as Arrow,
    'shared/create-arrow',
    (state, arrow, dispatch: DispatchFn) => {
        dispatch({ type: 'puzzle/create-arrow', payload: arrow });
        dispatch({ type: 'solver/trigger-solve', payload: false });

        return state;
    }
);

const deleteArrow = action(
    _ as RootState,
    _ as number,
    'shared/delete-arrow',
    (state, index, dispatch: DispatchFn) => {
        dispatch({ type: 'puzzle/delete-arrow', payload: index });
        dispatch({ type: 'solver/trigger-solve', payload: true });

        return state;
    }
);

const createKillerCage = action(
    _ as RootState,
    _ as KillerCage,
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

            dispatch({
                type: 'player/calculate-errors',
                payload: {
                    givens: state.puzzle.board,
                },
            });
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

const interactStart = action(
    _ as RootState,
    _ as InteractionData,
    'shared/interact-start',
    (state, interaction, dispatch: DispatchFn) => {
        state.ui.interactionHandler.onInteractStart?.(
            { state, dispatch },
            interaction
        );
        return state;
    }
);

const interactMove = action(
    _ as RootState,
    _ as InteractionData,
    'shared/interact-move',
    (state, interaction, dispatch: DispatchFn) => {
        state.ui.interactionHandler.onInteractMove?.(
            { state, dispatch },
            interaction
        );
        return state;
    }
);

const interactEnd = action(
    _ as RootState,
    _ as InteractionData,
    'shared/interact-end',
    (state, interaction, dispatch: DispatchFn) => {
        state.ui.interactionHandler.onInteractEnd?.(
            { state, dispatch },
            interaction
        );
        return state;
    }
);

const interactLeave = action(
    _ as RootState,
    _ as undefined,
    'shared/interact-leave',
    (state, _, dispatch: DispatchFn) => {
        state.ui.interactionHandler.onInteractLeave?.({ state, dispatch });
        return state;
    }
);

export type SharedAction =
    | GetAction<typeof setCellValue>
    | GetAction<typeof setSelectionValue>
    | GetAction<typeof swapPencilMarks>
    | GetAction<typeof setRestrictions>
    | GetAction<typeof setAlgorithms>
    | GetAction<typeof setSetterInputMode>
    | GetAction<typeof createThermo>
    | GetAction<typeof deleteThermo>
    | GetAction<typeof createArrow>
    | GetAction<typeof deleteArrow>
    | GetAction<typeof createKillerCage>
    | GetAction<typeof deleteKillerCage>
    | GetAction<typeof reset>
    | GetAction<typeof undo>
    | GetAction<typeof redo>
    | GetAction<typeof interactStart>
    | GetAction<typeof interactMove>
    | GetAction<typeof interactEnd>
    | GetAction<typeof interactLeave>;

export default merge<RootState>(
    undefined,
    setCellValue,
    setSelectionValue,
    swapPencilMarks,
    setRestrictions,
    setAlgorithms,
    setSetterInputMode,
    createThermo,
    deleteThermo,
    createArrow,
    deleteArrow,
    createKillerCage,
    deleteKillerCage,
    reset,
    undo,
    redo,
    interactStart,
    interactMove,
    interactEnd,
    interactLeave
);
