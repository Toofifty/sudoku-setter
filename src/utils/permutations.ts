import { isSimilarArray } from './array';
import { range } from './misc';

/**
 * Get all permutations of the given set
 */
export const permutations = <T>(of: T[]) => {
    const perms: T[][] = [];

    for (const item of of) {
        perms.push([item]);
        const others = of.filter((i) => i !== item);
        permutations(others).forEach((lower) => {
            const lowerPermutation = [item, ...lower];
            if (
                perms.every(
                    (permutation) =>
                        !isSimilarArray(permutation, lowerPermutation)
                )
            ) {
                perms.push(lowerPermutation);
            }
        });
    }

    return perms;
};

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

    const perms: number[][] = [];
    for (const n of range(min, max)) {
        if (n === sum) {
            perms.push([n]);
            continue;
        }
        if (n > sum) {
            continue;
        }
        permutationsWithSum(sum - n, items - 1, noRepeats, min, max).forEach(
            (lower) => {
                const lowerPermutation = [n, ...lower];
                if (
                    perms.every(
                        (permutation) =>
                            !isSimilarArray(permutation, lowerPermutation)
                    ) &&
                    (!noRepeats || !lower.includes(n))
                ) {
                    perms.push(lowerPermutation);
                }
            }
        );
    }

    return perms;
};
