import React from 'react';
import { Link } from 'react-router-dom';
import useSelector from 'hooks/use-selector';
import useAction from 'hooks/use-action';
import Toggle from 'components/toggle';
import Button from 'components/button';
import './navbar.scss';

const Navbar = () => {
    const darkMode = useSelector((state) => state.player.settings.darkMode);
    const setSettings = useAction('player/set-settings');

    return (
        <header className="nav-bar">
            <Link className="nav-bar__brand" to="/">
                <i className="fa fa-game-board-alt m-r-12" />
                Sudokuu
            </Link>
            <section className="nav-bar__section">
                <Toggle
                    sw
                    className="m-x-8 text--bold"
                    checked={darkMode}
                    onChange={() => setSettings({ darkMode: !darkMode })}
                >
                    Dark mode
                </Toggle>
                <Button className="text--bold m-x-8" to="/setter">
                    <i className="fa fa-sparkles m-r-12" />
                    Create
                </Button>
                <Button className="text--bold m-x-8" to="/puzzle">
                    <i className="fa fa-play m-r-12" />
                    Play
                </Button>
            </section>
        </header>
    );
};

export default Navbar;
