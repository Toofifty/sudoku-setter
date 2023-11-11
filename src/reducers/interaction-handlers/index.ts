import { SetterInputMode } from 'reducers/setter';
import { InteractionHandler } from './types';
import { selectionInteractionHandler } from './selection';
import { thermoInteractionHandler } from './thermo';

export const interactionHandlers: Record<SetterInputMode, InteractionHandler> =
    {
        digit: selectionInteractionHandler,
        thermo: thermoInteractionHandler,
        arrow: selectionInteractionHandler,
        cage: selectionInteractionHandler,
    };
