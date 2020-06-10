import { combineReducers } from 'redux';
import { connectRouter } from 'connected-react-router';
import sudoku, { SudokuAction } from './sudoku';
import ui, { UIAction } from './ui';

export type RootActionType = SudokuAction | UIAction;

export default (history: any) =>
    combineReducers({
        router: connectRouter(history),
        sudoku,
        ui,
    });
