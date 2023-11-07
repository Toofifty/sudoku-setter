import { range } from './misc';

export const intersection = <T>(...arrays: T[][]) => {
    const [head, ...tail] = arrays;
    if (head === undefined) {
        return [];
    }
    return head.filter((item) => tail.every((array) => array.includes(item)));
};

export const isSubset = <T>(subset: T[], test: T[]) =>
    subset.length <= test.length && subset.every((n) => test.includes(n));

export const isEqualArray = <T>(arr1: T[], arr2: T[]) =>
    arr1.length === arr2.length &&
    range(0, arr1.length).every((n) => arr1[n] === arr2[n]);

export const isSimilarArray = <T>(arr1: T[], arr2: T[]) =>
    arr1.length === arr2.length && arr1.every((n) => arr2.includes(n));

export const except = <T>(arr: T[], item: T) => arr.filter((v) => v !== item);
