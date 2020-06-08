import { createStore } from 'redux';
import { createBrowserHistory } from 'history';
import createReducers from './reducers';

export const history = createBrowserHistory();

export const store = createStore(
    createReducers(history),
    // @ts-ignore
    window.__REDUX_DEVTOOLS_EXTENSION__?.()
);

export type RootState = ReturnType<ReturnType<typeof createReducers>>;
