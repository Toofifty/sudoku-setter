import { InputMode } from 'reducers/player';
import { PlayerCell } from 'types';

export type Getter = (index: number) => PlayerCell;
export type Setter = (index: number, cell: PlayerCell) => void;

export type Automation = (
    accessors: { get: Getter; set: Setter },
    event: {
        selection: number[];
        value?: number;
        mode: InputMode;
    }
) => void;
