import styles from "./Square.module.scss";

interface ISquareProps {
	isCorrectLetterInCorrectLocation: boolean;
	isCorrectLetterInWrongLocation: boolean;
	isSubmitted: boolean;
	value: string;
}

/**
 * Creates an HTML element representing a single square to hold a letter
 * on the game board.
 * @param {*} props
 */
export default function Square(props: ISquareProps) {
	var className = styles.square;

	if (props.isCorrectLetterInCorrectLocation) {
		className += ` ${styles.squareHighlighted} ${styles.squareHighlightedCorrect}`;
	} else if (props.isCorrectLetterInWrongLocation) {
		className += ` ${styles.squareHighlighted} ${styles.squareHighlightedCorrectLetterWrongLocation}`;
	} else if (props.isSubmitted) {
		// If the word has been submitted and is neither correct or correct
		// in the wrong location, highlight it as incorrect.
		className += ` ${styles.squareHighlighted} ${styles.squareHighlightedIncorrect}`;
	}

	return <span className={className}>{props.value}</span>;
}