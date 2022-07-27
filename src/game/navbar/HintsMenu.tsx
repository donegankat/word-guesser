import React from "react";
import { Offcanvas } from "react-bootstrap";
import IHints from "../interfaces/IHints";
import LetterRevealer from "./hints/LetterRevealer";
import HintRow from "./hints/HintRow";

import styles from "./hints/Hints.module.scss";

interface IHintsProps {
	word?: string[];
	hints?: IHints;
	isShown: boolean;
	onShow: () => void;
	onHide: () => void;
}

/**
 * Creates the "Hints" button and flyout panel with revealable hints.
 */
export default function HintsMenu(props: IHintsProps) {
	const hasDefinition: boolean =
		props.hints && props.hints.definitions && props.hints.definitions[0]
			? true
			: false;

	return (
		<>
			{props.hints && (
				<Offcanvas
					show={props.isShown}
					onShow={props.onShow}
					onHide={props.onHide}
					id={"offcanvasNavbar-expand-hints"}
					aria-labelledby={"offcanvasNavbarLabel-expand-hints"}
					placement="bottom"
					restoreFocus={false}
					className={`${styles.offcanvasHints} h-50`}
				>
					<Offcanvas.Header closeButton>
						<Offcanvas.Title id={"offcanvasNavbarLabel-expand-hints"}>
							Hints
						</Offcanvas.Title>
					</Offcanvas.Header>
					<Offcanvas.Body>
						{props.word && (
							<div className={`${styles.hintRow} ${styles.hintLettersRow}`}>
								<h6 className={styles.hintLabel}>Reveal a Letter</h6>
								<div className={`${styles.hintValue} ${styles.hintLettersGrid}`}>
									<LetterRevealer letters={props.word}></LetterRevealer>
								</div>
							</div>
						)}
						{hasDefinition && props.hints.definitions[0].definition && (
							<HintRow
								label="Definition"
								hintValue={props.hints.definitions[0].definition}
							/>
						)}
						{hasDefinition && props.hints.definitions[0].partOfSpeech && (
							<HintRow
								label="Part of Speech"
								hintValue={props.hints.definitions[0].partOfSpeech}
							/>
						)}
						{hasDefinition && props.hints.definitions[0].synonyms && (
							<HintRow
								label="Synonyms"
								hintValue={props.hints.definitions[0].synonyms.join(", ")}
							/>
						)}
						{hasDefinition && props.hints.definitions[0].antonyms && (
							<HintRow
								label="Antonyms"
								hintValue={props.hints.definitions[0].antonyms.join(", ")}
							/>
						)}
						{props.hints.syllableCount && (
							<HintRow
								label="Number of Syllables"
								hintValue={props.hints.syllableCount}
							/>
						)}
						{props.hints.wordFrequency && (
							<HintRow
								label="Frequency of Word Occurrence"
                                hintValue={`${props.hints.wordFrequency.frequencyOfOccurrence.toFixed(2)}% (${props.hints.wordFrequency.frequencyDescription})`}
							/>
						)}
					</Offcanvas.Body>
				</Offcanvas>
			)}
		</>
	);
}
