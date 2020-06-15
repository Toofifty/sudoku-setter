import React from 'react';
import Router from 'router';
import Navbar from 'components/navbar/navbar';

const AppContainer = () => (
    <>
        <Navbar />
        <div className="app">
            <Router />
        </div>
    </>
);

export default AppContainer;
