import React from 'react';
import './box.scss';

interface BoxProps {
    children: React.ReactNode;
}

const Box = ({ children }: BoxProps) => <div className="box" />;

export default Box;
