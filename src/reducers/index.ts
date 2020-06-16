import { connectRouter } from 'connected-react-router';
import { RootState, WithDispatch } from 'store';
import sudoku, { SudokuAction } from './sudoku';
import solver, { SolverAction } from './solver';
import ui, { UIAction } from './ui';
import shared, { SharedAction } from './shared';

export type RootActionType =
    | SudokuAction
    | SolverAction
    | UIAction
    | SharedAction;

export default (history: any) => (
    state: RootState | undefined,
    action: RootActionType & WithDispatch
) => ({
    ...shared(state, action),
    router: connectRouter(history)(state?.router, action as any),
    sudoku: sudoku(state?.sudoku, action as any),
    solver: solver(state?.solver, action as any),
    ui: ui(state?.ui, action as any),
});
