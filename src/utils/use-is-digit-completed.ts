import useSelector from 'hooks/use-selector';

export const useIsDigitCompleted = () => {
    const givenBoard = useSelector((state) => state.puzzle.board);
    const playerBoard = useSelector((state) => state.player.board);

    return (digit: number) => {
        const isDigit = (cell: { value?: number }) => cell.value === digit;
        return (
            givenBoard.filter(isDigit).length +
                playerBoard.filter(isDigit).length >=
            9
        );
    };
};
