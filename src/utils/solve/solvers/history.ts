import { naturalJoin } from 'utils/misc';
import { getCoord } from 'utils/sudoku';

export type SolveStep =
    | {
          /** Algorithm applied */
          algorithm: string;
          /** Indices of affected cells */
          affected: number[];
          /** Indices of cells used by the algorithm to produce this result */
          culprits?: number[];
      } & (
          | {
                /** Digit placed */
                digit: number;
            }
          | {
                /** Candidates removed */
                removedCandidates: number[];
                /** Extra reason for removal */
                reason: string;
            }
      );

export type SolveHistory = SolveStep[];

/**
 * Print history to console for debugging
 */
export const print = (history: SolveHistory) => {
    history.forEach((step) => {
        if ('digit' in step) {
            step.affected.forEach((index) => {
                console.log(
                    `solve(${step.algorithm}): ${
                        step.digit
                    } can be placed at ${getCoord(index)}`
                );
            });
        } else {
            const candidates = naturalJoin(step.removedCandidates.map(String));
            const affected = naturalJoin(step.affected.map(getCoord));
            const culprits = step.culprits
                ? naturalJoin(step.culprits.map(getCoord))
                : undefined;
            console.log(
                `solve(${
                    step.algorithm
                }): ${candidates} can be removed from ${affected} due to ${
                    step.reason
                }${culprits ? ` at ${culprits}` : ''}`
            );
        }
    });
};
