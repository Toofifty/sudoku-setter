import cx from 'classnames';
import { useRef, useState } from 'react';
import { Link } from 'react-router-dom';

import Button from 'components/button';
import Toggle from 'components/toggle';
import useAction from 'hooks/use-action';
import useSelector from 'hooks/use-selector';
import './navbar.scss';
import { IconButton } from 'components/icon-button';
import { useOnClickOutside } from 'utils/use-on-click-outside';

const Navbar = () => {
    const ref = useRef<HTMLDivElement>(null);
    const darkMode = useSelector((state) => state.player.settings.darkMode);
    const setSettings = useAction('player/set-settings');

    const [mobileVisible, setMobileVisible] = useState(false);

    useOnClickOutside(ref, () => {
        setMobileVisible(false);
    });

    return (
        <header className="nav-bar">
            <Link className="nav-bar__brand" to="/">
                <i className="fad fa-game-board-alt m-r-12" />
                Sudokuu
            </Link>
            <IconButton
                onClick={() => setMobileVisible(!mobileVisible)}
                icon={mobileVisible ? 'fal fa-times' : 'fal fa-bars'}
            />
            <section
                className={cx(
                    'nav-bar__section',
                    mobileVisible && 'nav-bar__section--visible'
                )}
                ref={ref}
            >
                <Toggle
                    sw
                    className="m-x-8 text--bold"
                    checked={darkMode}
                    onChange={() => setSettings({ darkMode: !darkMode })}
                >
                    Dark mode
                </Toggle>
                <Button className="text--bold m-x-8" to="/setter">
                    <i className="fad fa-sparkles m-r-12" />
                    Create
                </Button>
                <Button className="text--bold m-x-8" to="/puzzle">
                    <i className="fad fa-play m-r-12" />
                    Play
                </Button>
            </section>
        </header>
    );
};

export default Navbar;
