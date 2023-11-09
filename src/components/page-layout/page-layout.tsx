import React from 'react';
import cx from 'classnames';
import './page-layout.scss';

interface PageLayoutProps {
    board: React.ReactNode;
    controls: React.ReactNode;
    leftControls?: React.ReactNode;
    mobileControls?: React.ReactNode;
}

const PageLayout = ({
    board,
    controls,
    leftControls,
    mobileControls,
}: PageLayoutProps) => (
    <div className="page-layout">
        {leftControls && (
            <div className="page-layout__left-controls">{leftControls}</div>
        )}
        <div className="page-layout__board">{board}</div>
        <div
            className={cx(
                'page-layout__controls',
                mobileControls && 'hide-mobile'
            )}
        >
            {controls}
        </div>
        {mobileControls && (
            <div className="hide-desktop page-layout__controls page-layout__controls--mobile">
                {mobileControls}
            </div>
        )}
    </div>
);

export default PageLayout;
