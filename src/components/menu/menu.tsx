import React, { useState } from 'react';
import cx from 'classnames';
import './menu.scss';
import Button from 'components/button';

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

interface MenuCollapseProps {
    children: React.ReactNode;
    className?: string;
    label?: string;
    expandedByDefault?: boolean;
}

const MenuCollapse = ({
    children,
    className,
    label,
    expandedByDefault = false,
}: MenuCollapseProps) => {
    const [expanded, setExpanded] = useState(expandedByDefault);

    const [contentHeight, setContentHeight] = useState(0);

    const computeContentHeight = (instance: HTMLUListElement | null) => {
        if (instance) {
            const height = Array.from(instance.children).reduce(
                (total, child) => total + child.getBoundingClientRect().height,
                0
            );
            setContentHeight(height);
        }
    };

    return (
        <li
            className={cx(
                'collapse',
                className,
                expanded && 'collapse--expanded'
            )}
        >
            <Button
                className="collapse__button"
                onClick={() => setExpanded(!expanded)}
            >
                <span>{label}</span>
                {expanded ? (
                    <i className="fa fa-chevron-up" />
                ) : (
                    <i className="fa fa-chevron-down" />
                )}
            </Button>
            <ul
                className="collapse__list"
                ref={computeContentHeight}
                style={{ maxHeight: expanded ? contentHeight + 12 : 0 }}
            >
                {children}
            </ul>
        </li>
    );
};

Menu.Item = MenuItem;
Menu.Divider = MenuDivider;
Menu.Collapse = MenuCollapse;

export default Menu;
