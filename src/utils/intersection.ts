export const intersection = <T>(...arrays: T[][]) => {
    const [head, ...tail] = arrays;
    if (head === undefined) {
        return [];
    }
    return head.filter((item) => tail.every((array) => array.includes(item)));
};
