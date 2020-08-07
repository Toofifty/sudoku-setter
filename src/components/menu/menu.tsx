import React from 'react';
import cx from 'classnames';
import './menu.scss';

interface MenuProps {
    children: React.ReactNode;
    className?: string;
}

const Menu = ({ children, className }: MenuProps) => (
    <ul className={cx('menu', className)}>{children}</ul>
);

interface MenuItemProps {
    children: React.ReactNode;
    className?: string;
}

const MenuItem = ({ children, className }: MenuItemProps) => (
    <li className={cx('menu-item', className)}>{children}</li>
);

interface MenuDividerProps {
    className?: string;
    label?: string;
}

const MenuDivider = ({ className, label }: MenuDividerProps) => (
    <li className={cx('divider', className)} data-content={label} />
);

Menu.Item = MenuItem;
Menu.Divider = MenuDivider;

export default Menu;
