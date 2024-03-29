import { Offcanvas } from "react-bootstrap";
import Square from "../Square";

import styles from "../Board.module.scss";

interface IHowToPlayProps {
	isShown: boolean;
	onShow: () => void;
	onHide: () => void;
}

export default function HowToPlayMenu(props: IHowToPlayProps) {
	const buildExampleWordRow = (
		exampleNumber: number,
		word: string[],
		correctLettersInCorrectLocationsIndexes: number[],
		correctLettersInWrongLocationsIndexes: number[]
	) => {
		const squares = [];

		for (var i = 0; i < word.length; i++) {
			squares.push(
				<Square
					key={`help-row-index-${exampleNumber}-square-index-${i}`}
					isCorrectLetterInCorrectLocation={correctLettersInCorrectLocationsIndexes.includes(i)}
					isCorrectLetterInWrongLocation={correctLettersInWrongLocationsIndexes.includes(i)}
					isSubmitted={true}
					value={word[i]}
				/>
			);
		}

		return <div className={styles.boardRow}>{squares}</div>;
	};

	return (
		<Offcanvas
			show={props.isShown}
            onShow={props.onShow}
			onHide={props.onHide}
			id={"offcanvasNavbar-expand-how-to-play"}
			aria-labelledby={"offcanvasNavbarLabel-expand-how-to-play"}
			placement="end"
			restoreFocus={false}
			className="offcanvas-lg"
		>
			<Offcanvas.Header closeButton>
				<Offcanvas.Title id={"offcanvasNavbarLabel-expand-how-to-play"}>
					How to Play
				</Offcanvas.Title>
			</Offcanvas.Header>
			<Offcanvas.Body>
				<div>
					<p>Guess the word in six tries.</p>
					<p>
						Each guess must be a valid five-letter word. Hit the enter button to
						submit.
					</p>
					<p>
						After each guess, the color of the tiles will change to show how
						close your guess was to the word.
					</p>
					<p>
						Hints are available to help whenever you need them. The available
						hints will vary by word.
					</p>
					<p>
						You can also load a new word and start over fresh by clicking
						&quot;New Game&quot;.
					</p>

					<hr />

					<div>
						<h4>Examples</h4>
						{buildExampleWordRow(0, ["L", "I", "O", "N", "S"], [3], [])}
						<br />
						<p>The letter N is in the word and in the correct spot.</p>
						{buildExampleWordRow(1, ["T", "I", "G", "E", "R"], [], [0])}
						<br />
						<p>The letter T is in the word but in the wrong spot.</p>
						{buildExampleWordRow(2, ["B", "E", "A", "R", "S"], [], [])}
						<br />
						<p>None of the letters in BEARS exist in the word in any spot.</p>
					</div>
				</div>
			</Offcanvas.Body>
		</Offcanvas>
	);
}