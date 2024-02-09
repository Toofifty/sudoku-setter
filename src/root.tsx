import { Provider as ReduxProvider } from 'react-redux';
import { HistoryRouter } from 'redux-first-history/rr6';

import AppContainer from './app-container';
import { history, store } from './store';

const Root = () => (
    <ReduxProvider store={store}>
        <HistoryRouter history={history}>
            <AppContainer />
        </HistoryRouter>
    </ReduxProvider>
);

export default Root;
