export const range = (min: number, max: number): number[] =>
    Array(max - min)
        .fill(0)
        .map((_, i) => i + min);
