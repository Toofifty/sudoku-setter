import { applyMiddleware, compose, createStore } from 'redux';
import { createBrowserHistory } from 'history';
import { RouterState } from 'connected-react-router';

import { PuzzleState } from 'reducers/puzzle';
import { UIState } from 'reducers/ui';
import { SolverState } from 'reducers/solver';
import { PlayerState } from 'reducers/player';
import { SetterState } from 'reducers/setter';

import createReducers, { RootActionType } from './reducers';

export const history = createBrowserHistory();

export const queueDispatchMiddleware =
    (store: any) => (next: any) => (action: RootActionType) => {
        const queue: (RootActionType | (() => void))[] = [];

        const flush = () => {
            queue.forEach((action) => {
                if (typeof action === 'function') return action();
                return store.dispatch(action);
            });
        };

        const dispatch = (action: RootActionType | (() => void)) => {
            queue.push(action);
        };

        const res = next({ ...action, dispatch });
        flush();

        return res;
    };

export type DispatchFn = (action: RootActionType | (() => void)) => void;
export type WithDispatch = { dispatch: DispatchFn };

export const store = createStore(
    createReducers(history),
    compose(
        applyMiddleware(queueDispatchMiddleware),
        (window as any).__REDUX_DEVTOOLS_EXTENSION__?.() ?? ((a: any) => a)
    )
);

export type RootState = {
    router: RouterState<any>;
    puzzle: PuzzleState;
    player: PlayerState;
    setter: SetterState;
    solver: SolverState;
    ui: UIState;
};
