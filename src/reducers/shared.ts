import { RootState, WithDispatch, DispatchFn } from 'store';
import { RootActionType } from 'reducers';

type Reducer<T extends { payload: any }> = (
    state: RootState,
    dispatch: DispatchFn,
    payload: T['payload']
) => RootState;

type SetCellValue = {
    type: 'shared/set-cell-value';
    payload: { index: number; value?: number };
};

const setCellValue: Reducer<SetCellValue> = (
    state,
    dispatch,
    { index, value }
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

export type SharedAction = SetCellValue;

export default (
    state: RootState | undefined,
    action: RootActionType & WithDispatch
) => {
    if (!state) return state;
    switch (action.type) {
        case 'shared/set-cell-value':
            return setCellValue(state, action.dispatch, action.payload);
        default:
            return state;
    }
};
