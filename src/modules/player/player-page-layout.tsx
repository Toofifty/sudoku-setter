import React from 'react';

import './player-page-layout.scss';

interface PlayerPageLayoutProps {
    board: React.ReactNode;
    controls: React.ReactNode;
}

const PlayerPageLayout = ({ board, controls }: PlayerPageLayoutProps) => (
    <div className="player-page-layout">
        <div className="player-page-layout__board">{board}</div>
        <div className="player-page-layout__controls">{controls}</div>
    </div>
);

export default PlayerPageLayout;
