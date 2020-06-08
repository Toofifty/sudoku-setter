import { combineReducers } from 'redux';
import { connectRouter } from 'connected-react-router';

export type RootActionType = void;

export default (history: any) =>
    combineReducers({
        router: connectRouter(history),
    });
