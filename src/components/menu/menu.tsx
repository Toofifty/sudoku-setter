import {
    createContext,
    forwardRef,
    useContext,
    useEffect,
    useState,
} from 'react';
import cx from 'classnames';

import './menu.scss';
import Button from 'components/button';

const MenuContext = createContext<{
    exclusive: boolean;
    selected: string | undefined;
    setSelected: (value: string | undefined) => void;
}>(undefined!);

interface MenuProps {
    children: React.ReactNode;
    noPadding?: boolean;
    exclusive?: boolean;
    className?: string;
    style?: React.CSSProperties;
}

const Menu = forwardRef<HTMLUListElement, MenuProps>(
    ({ children, exclusive = false, className, noPadding, style }, ref) => {
        const [selected, setSelected] = useState<string>();

        return (
            <MenuContext.Provider value={{ exclusive, selected, setSelected }}>
                <ul
                    ref={ref}
                    className={cx(
                        'menu',
                        noPadding && 'menu--no-padding',
                        className
                    )}
                    style={style}
                >
                    {children}
                </ul>
            </MenuContext.Provider>
        );
    }
);

interface MenuItemProps {
    children: React.ReactNode;
    label?: string;
    className?: string;
}

export const MenuItem = ({ children, label, className }: MenuItemProps) => (
    <li className={cx('menu-item', className)}>
        {label && <div className="divider" data-content={label} />}
        {children}
    </li>
);

interface MenuDividerProps {
    className?: string;
    label?: string;
}

export const MenuDivider = ({ className, label }: MenuDividerProps) => (
    <li className={cx('divider', className)} data-content={label} />
);

interface MenuCollapseProps {
    children: React.ReactNode;
    className?: string;
    label?: string;
    expandedByDefault?: boolean;
}

export const MenuCollapse = ({
    children,
    className,
    label,
    expandedByDefault = false,
}: MenuCollapseProps) => {
    const { exclusive, selected, setSelected } = useContext(MenuContext);
    const [locallyExpanded, setLocallyExpanded] = useState(expandedByDefault);

    const [contentHeight, setContentHeight] = useState(0);

    const expanded = exclusive ? selected === label : locallyExpanded;

    const toggle = () => {
        if (exclusive) {
            setSelected(selected === label ? undefined : label);
        } else {
            setLocallyExpanded(!locallyExpanded);
        }
    };

    useEffect(() => {
        if (exclusive && expandedByDefault) {
            setSelected(label);
        }
    }, [exclusive, expandedByDefault, label, setSelected]);

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
            <Button className="collapse__button" onClick={toggle}>
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

export default Menu;
