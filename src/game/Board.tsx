import * as React from "react";
import IGuess from "./interfaces/IGuess";
import Square from "./Square";

import styles from "./Board.module.scss";

interface IBoardProps {
	history: IGuess[];
	maxGuesses: number;
	maxLetters: number;
}

/**
 * Creates the board which contains the squares which represent the letters
 * for each guess.
 */
export default class Board extends React.Component<IBoardProps> {
	renderSquare(guessIndex: number, letterIndex: number) {
		const currentGuess = this.props.history[guessIndex];
		return (
			<Square
				key={`row-index-${guessIndex}-square-index-${letterIndex}`}
				value={currentGuess.letters[letterIndex]}
				isCorrectLetterInCorrectLocation={
					currentGuess.greenHighlightedSquares !== undefined &&
					currentGuess.greenHighlightedSquares.indexOf(letterIndex) > -1
				}
				isCorrectLetterInWrongLocation={
					currentGuess.yellowHighlightedSquares !== undefined &&
					currentGuess.yellowHighlightedSquares.indexOf(letterIndex) > -1
				}
				isSubmitted={currentGuess.isSubmitted}
			/>
		);
	}

	render() {
		const squareRows = [];

		// Build the squares for each letter of each guess dynamically in rows.
		for (let guessRow = 0; guessRow < this.props.maxGuesses; guessRow++) {
			const squares = [];

			for (let guessLetter = 0; guessLetter < this.props.maxLetters; guessLetter++
			) {
				squares.push(this.renderSquare(guessRow, guessLetter));
			}

			squareRows.push(
				<div key={`board-row-${guessRow}`} className={styles.boardRow}>
					{squares}
				</div>
			);
		}

		return <div>{squareRows}</div>;
	}
}
