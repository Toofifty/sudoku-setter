export const isEventOver = (e: MouseEvent, ...classNames: string[]) =>
    e
        .composedPath()
        .some((el: any) => classNames.some((c) => el.classList?.contains(c)));
