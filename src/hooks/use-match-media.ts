import { useState, useEffect } from 'react';

export const useMatchMedia = (mediaQuery: string) => {
    const [matches, setMatches] = useState(
        () => window.matchMedia(mediaQuery).matches
    );

    useEffect(() => {
        const mediaQueryList = window.matchMedia(mediaQuery);
        const listener = (event: MediaQueryListEvent) =>
            setMatches(event.matches);

        mediaQueryList.addEventListener('change', listener);

        return () => {
            mediaQueryList.removeEventListener('change', listener);
        };
    }, [mediaQuery]);

    return matches;
};
