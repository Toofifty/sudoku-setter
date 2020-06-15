import React from 'react';
import { Provider as ReduxProvider } from 'react-redux';
import { ConnectedRouter } from 'connected-react-router';
import AppContainer from 'app-container';
import { store, history } from './store';

const Root = () => (
    <ReduxProvider store={store}>
        <ConnectedRouter history={history}>
            <AppContainer />
        </ConnectedRouter>
    </ReduxProvider>
);

export default Root;
