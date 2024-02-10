import cx from 'classnames';

import './icon-stack.scss';

interface IconStackProps {
    main: string;
    secondary: string;
}

export const IconStack = ({ main, secondary }: IconStackProps) => (
    <span className="icon-stack">
        <i className={cx(main, 'icon-stack__main')} />
        <i className={cx(secondary, 'icon-stack__secondary')} />
    </span>
);
