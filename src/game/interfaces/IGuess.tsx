export default interface IGuess {
    letters: string[];
    greenHighlightedSquares: number[];
    yellowHighlightedSquares: number[];
    isSubmitted: boolean;

    /**
     * Whether or not the attempted guess was a valid word. This is a short-lived setting
     * which only serves as a temporary trigger for animations and alerts.
     */
    isInvalidGuess?: boolean;
}