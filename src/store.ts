import { createStore, applyMiddleware, compose } from 'redux';
import { createBrowserHistory } from 'history';
import createReducers, { RootActionType } from './reducers';
import { RouterState } from 'connected-react-router';
import { PuzzleState } from 'reducers/puzzle';
import { UIState } from 'reducers/ui';
import { SolverState } from 'reducers/solver';

export const history = createBrowserHistory();

export const queueDispatchMiddleware = (store: any) => (next: any) => (
    action: RootActionType
) => {
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
        (window as any).__REDUX_DEVTOOLS_EXTENSION__?.()
    )
);

export type RootState = {
    router: RouterState<any>;
    puzzle: PuzzleState;
    solver: SolverState;
    ui: UIState;
};
