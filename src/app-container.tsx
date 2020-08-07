import React from 'react';
import Router from 'router';
import useSelector from 'hooks/use-selector';
import Navbar from 'components/navbar/navbar';
import KeyListener from 'components/key-listener';

const AppContainer = () => {
    const darkMode = useSelector((state) => state.player.settings.darkMode);

    return (
        <div
            style={{ flexGrow: 1, display: 'flex', flexDirection: 'column' }}
            className={darkMode ? 'theme-dark' : ''}
        >
            <Navbar />
            <KeyListener>
                <div className="app">
                    <Router />
                </div>
            </KeyListener>
        </div>
    );
};

export default AppContainer;
