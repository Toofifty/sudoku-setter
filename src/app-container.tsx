import React, { useEffect } from 'react';
import Router from 'router';
import useSelector from 'hooks/use-selector';
import Navbar from 'components/navbar/navbar';
import KeyListener from 'components/key-listener';

const AppContainer = () => {
    const darkMode = useSelector((state) => state.player.settings.darkMode);

    useEffect(() => {
        if (darkMode && !document.body.classList.contains('theme-dark')) {
            document.body.classList.add('theme-dark');
        }

        if (!darkMode && document.body.classList.contains('theme-dark')) {
            document.body.classList.remove('theme-dark');
        }
    }, [darkMode]);

    return (
        <div style={{ flexGrow: 1, display: 'flex', flexDirection: 'column' }}>
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
