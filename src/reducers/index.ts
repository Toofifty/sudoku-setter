import { combineReducers } from 'redux';
import { connectRouter } from 'connected-react-router';
import sudoku, { SudokuAction } from './sudoku';

export type RootActionType = SudokuAction;

export default (history: any) =>
    combineReducers({
        router: connectRouter(history),
        sudoku,
    });
