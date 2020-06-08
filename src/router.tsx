import React from 'react';
import { Switch, Route } from 'react-router';
import Main from './pages/main';

const Router = () => (
    <Switch>
        <Route path="*" component={Main} />
    </Switch>
);

export default Router;
