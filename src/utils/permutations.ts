import { isSimilarArray } from './array';
import { range } from './misc';

/**
 * Get all permutations of `items` numbers, between
 * `min` and `max` that add to the given `sum`
 */
export const permutationsWithSum = (
    sum: number,
    items: number,
    noRepeats: boolean = false,
    min: number = 1,
    max: number = 9
): number[][] => {
    if (items === 1) {
        return sum >= min && sum <= max ? [[sum]] : [];
    }

    const permutations: number[][] = [];
    for (let n of range(min, max)) {
        if (n === sum) {
            permutations.push([n]);
            continue;
        }
        if (n > sum) {
            continue;
        }
        permutationsWithSum(sum - n, items - 1, noRepeats, min, max).forEach(
            (lower) => {
                const lowerPermutation = [n, ...lower];
                if (
                    permutations.every(
                        (permutation) =>
                            !isSimilarArray(permutation, lowerPermutation)
                    ) &&
                    (!noRepeats || !lower.includes(n))
                ) {
                    permutations.push(lowerPermutation);
                }
            }
        );
    }

    return permutations;
};
