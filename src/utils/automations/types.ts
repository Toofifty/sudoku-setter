import { InputMode } from 'reducers/player';
import { PlayerCell } from 'types';

export type Accessors = {
    /**
     * Read a cell by index
     */
    get: (index: number) => PlayerCell;
    /**
     * Write directly to a cell value (does not generate new history)
     */
    commit: (index: number, cell: PlayerCell) => void;
    /**
     * Change a cell in memory, will only commit when flush() is called
     */
    set: (index: number, cell: PlayerCell) => void;
    /**
     * Write a value into a cell, mocking a player placement. Use
     * only when other automations need to be kicked off again after a
     * value change.
     */
    write: (index: number, value: number) => void;
    /**
     * Flush changes, creating a new point in history
     */
    flush: () => void;
};

export type Automation = (
    accessors: Accessors,
    event: {
        selection: number[];
        value?: number;
        mode: InputMode;
    }
) => void;
