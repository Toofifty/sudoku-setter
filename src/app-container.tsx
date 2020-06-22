import React from 'react';
import Router from 'router';
import Navbar from 'components/navbar/navbar';
import KeyListener from 'components/key-listener';

const AppContainer = () => (
    <KeyListener>
        <Navbar />
        <div className="app">
            <Router />
        </div>
    </KeyListener>
);

export default AppContainer;
