import React from 'react';
import { range } from 'utils';
import './control-box.scss';

const ControlBox = () => (
    <div className="control-box menu">
        <div className="control-box__section">
            <div className="control-box__input-mode">
                <button className="btn btn-primary">1</button>
                <button className="btn btn-primary">123</button>
                <button className="btn btn-primary">123</button>
            </div>
            <div className="control-box__numbers">
                {range(1, 10).map((n) => (
                    <button
                        className="btn btn-primary control-box__number-btn"
                        key={n}
                    >
                        {n}
                    </button>
                ))}
            </div>
            <div className="control-box__actions">
                <button className="btn btn-primary">
                    <i className="icon icon-refresh flip-horiz" />
                </button>
                <button className="btn btn-primary">
                    <i className="icon icon-refresh" />
                </button>
                <button className="btn btn-primary">
                    <i className="icon icon-delete" />
                </button>
            </div>
        </div>
        <div className="control-box__section">
            <button className="btn btn-primary alone">
                <i className="icon icon-more-horiz" />
            </button>
            <div className="control-box__colors"></div>
            <button className="btn btn-primary alone">
                <i className="icon icon-check" />
            </button>
        </div>
    </div>
);

export default ControlBox;
