export type FilledCell = {
    value: number;
    given: boolean;
};

export type PencilledCell = {
    pencils: number[];
    given: boolean;
};

export type ICell = FilledCell | PencilledCell;

export type Position = { x: number; y: number };
