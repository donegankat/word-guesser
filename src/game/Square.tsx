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
  var className = 'square';

  if (props.isHighlightedGreen) {
    className += ' square-highlighted-green';
  } else if (props.isHighlightedYellow) {
    className += ' square-highlighted-yellow';
  } else if (props.isSubmitted) {
    // If the word has been submitted and is neither correct or correct
    // in the wrong location, highlight it as incorrect.
    className += ' square-highlighted-incorrect';
  }

  return (
    <span className={className}>
      {props.value}
    </span>
  );
}