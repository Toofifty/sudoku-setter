import React from 'react';
import { SetterInputMode } from 'reducers/setter';
import Button from 'components/button';

import './setter-input-mode-select.scss';

interface SetterInputModeSelectProps {
    inputMode: SetterInputMode;
    onChange: (mode: SetterInputMode) => void;
}

const SetterInputModeSelect = ({
    inputMode,
    onChange,
}: SetterInputModeSelectProps) => (
    <div className="input-mode-select">
        <Button
            className="input-mode-select__mode-button"
            onClick={() => onChange('digit')}
            primary={inputMode === 'digit'}
        >
            9
        </Button>
        <Button
            className="input-mode-select__mode-button"
            onClick={() => onChange('thermo')}
            primary={inputMode === 'thermo'}
        >
            <i className="fad fa-temperature-up" />
        </Button>
        <Button
            className="input-mode-select__mode-button"
            onClick={() => onChange('arrow')}
            primary={inputMode === 'arrow'}
        >
            <i className="fad fa-bullseye-arrow" />
        </Button>
        <Button
            className="input-mode-select__mode-button"
            onClick={() => onChange('cage')}
            primary={inputMode === 'cage'}
        >
            <i className="fad fa-border-none" />
        </Button>
    </div>
);

export default SetterInputModeSelect;
