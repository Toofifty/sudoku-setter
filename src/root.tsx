import React from 'react';
import { Provider as ReduxProvider } from 'react-redux';
import { ConnectedRouter } from 'connected-react-router';
import Router from './router';
import { store, history } from './store';

const Root = () => (
    <ReduxProvider store={store}>
        <ConnectedRouter history={history}>
            <Router />
        </ConnectedRouter>
    </ReduxProvider>
);

export default Root;
