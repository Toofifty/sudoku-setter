import { combineReducers } from 'redux';
import { connectRouter } from 'connected-react-router';
import sudoku, { SudokuAction } from './sudoku';
import solver, { SolverAction } from './solver';
import ui, { UIAction } from './ui';

export type RootActionType = SudokuAction | SolverAction | UIAction;

export default (history: any) =>
    combineReducers({
        router: connectRouter(history),
        sudoku,
        solver,
        ui,
    });
