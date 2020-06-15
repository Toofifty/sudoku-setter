import React from 'react';
import { Link } from 'react-router-dom';
import './navbar.scss';

const Navbar = () => (
    <header className="nav-bar">
        <Link className="nav-bar__brand" to="/">
            Sudokuu
        </Link>
        <section className="nav-bar__section">
            <Link className="nav-bar__link" to="/setter">
                Set
            </Link>
            <Link className="nav-bar__link" to="/puzzle">
                Play
            </Link>
        </section>
    </header>
);

export default Navbar;
