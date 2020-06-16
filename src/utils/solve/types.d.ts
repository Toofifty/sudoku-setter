export type InterCell = {
    value?: number;
    given: boolean;
    marks: number[];
    initialMarks: number[];
    index: number;
    invalidMarks?: number[];
};

export type SolvePayload = {
    board: InterCell[];
    thermos?: number[][];
    killerCages?: { total: number; cage: number[] }[];
    stepSolve: boolean;
    algorithms: {
        hiddenSingles: boolean;
        nakedPairs: boolean;
        hiddenPairs: boolean;
        lockedCandidates: boolean;
        thermos: boolean;
        killerCages: boolean;
        antiKing: boolean;
        antiKnight: boolean;
        uniqueDiagonals: boolean;
        nonSeqNeighbors: boolean;
    };
};
