import styles from './Square.module.scss';

interface ISquareProps {
  isHighlightedGreen: boolean;
  isHighlightedYellow: boolean;
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

  if (props.isHighlightedGreen) {
    className += ' ' + styles.squareHighlightedCorrect;
  } else if (props.isHighlightedYellow) {
    className += ' ' + styles.squareHighlightedCorrectLetterWrongLocation;
  } else if (props.isSubmitted) {
    // If the word has been submitted and is neither correct or correct
    // in the wrong location, highlight it as incorrect.
    className += ' ' + styles.squareHighlightedIncorrect;
  }

  return (
    <span className={className}>
      {props.value}
    </span>
  );
}