import React from 'react';
import { Switch, Route, Redirect } from 'react-router';
import SetterPage from 'modules/setter';
import PlayerPage from 'modules/player';

const Router = () => (
    <Switch>
        <Route path="/setter" component={SetterPage} />
        <Route path="/puzzle" component={PlayerPage} />
        <Route path="/" render={() => <Redirect to="/setter" />} />
    </Switch>
);

export default Router;
