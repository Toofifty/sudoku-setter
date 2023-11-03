import { InputMode } from 'reducers/player';
import * as automations from './automations';
import { Getter, Setter } from './types';

type Settings = {
    [K in keyof typeof automations]: boolean;
};

export const runAutomations = (
    settings: Settings,
    accessors: { get: Getter; set: Setter },
    event: {
        selection: number[];
        value?: number;
        mode: InputMode;
    }
) => {
    Object.entries(automations).forEach(([key, automation]) => {
        if (settings[key as keyof typeof automations]) {
            automation(accessors, {
                ...event,
                // selection is copied to allow automations to mutate locally
                selection: [...event.selection],
            });
        }
    });
};
