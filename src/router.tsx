import React from 'react';
import { Switch, Route, Redirect } from 'react-router';
import SetterPage from 'modules/setter/setter-page';

const Router = () => (
    <Switch>
        <Route path="/setter" component={SetterPage} />
        <Route path="/" render={() => <Redirect to="/setter" />} />
    </Switch>
);

export default Router;
