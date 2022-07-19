import React from "react";
import { Offcanvas } from "react-bootstrap";
import IHints from "../interfaces/IHints";
import LetterRevealer from "../hints/LetterRevealer";
import HintRevealer from "../hints/HintRevealer";

import styles from '../hints/Hints.module.scss';

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

    return (
        <>
			{props.hints &&
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
                        {
                            props.word &&
                            <div className={`${styles.hintRow} ${styles.hintLettersRow}`}>
                                <span className={styles.hintLabel}>Reveal a Letter:&nbsp;</span>
                                <span className={styles.hintValue}><LetterRevealer letters={props.word}></LetterRevealer></span>
                            </div>
                        }
                        {
                            props.hints.syllableCount &&
                            <div className={styles.hintRow}>
                                <span className={styles.hintLabel}>Number of Syllables:&nbsp;</span>
                                <span className={styles.hintValue}><HintRevealer value={props.hints.syllableCount}></HintRevealer></span>
                            </div>
                        }
                        {
                            props.hints.definitions && props.hints.definitions[0].definition &&
                            <div className={styles.hintRow}>
                                <span className={styles.hintLabel}>Definition:&nbsp;</span>
                                <span className={styles.hintValue}><HintRevealer value={props.hints.definitions[0].definition}></HintRevealer></span>
                            </div>
                        }
                        {
                            props.hints.definitions && props.hints.definitions[0].partOfSpeech &&
                            <div className={styles.hintRow}>
                                <span className={styles.hintLabel}>Part of Speech:&nbsp;</span>
                                <span className={styles.hintValue}><HintRevealer value={props.hints.definitions[0].partOfSpeech}></HintRevealer></span>
                            </div>
                        }
                        {
                            props.hints.definitions && props.hints.definitions[0].synonyms &&
                            <div className={styles.hintRow}>
                                <span className={styles.hintLabel}>Synonyms:&nbsp;</span>
                                <span className={styles.hintValue}><HintRevealer value={props.hints.definitions[0].synonyms.join(", ")}></HintRevealer></span>
                            </div>
                        }
                        {
                            props.hints.definitions && props.hints.definitions[0].antonyms &&
                            <div className={styles.hintRow}>
                                <span className={styles.hintLabel}>Antonyms:&nbsp;</span>
                                <span className={styles.hintValue}><HintRevealer value={props.hints.definitions[0].antonyms.join(", ")}></HintRevealer></span>
                            </div>
                        }
                        {
                            props.hints.frequencyOfOccurrence &&
                            <div className={styles.hintRow}>
                                <span className={styles.hintLabel}>Frequency of Word Occurrence:&nbsp;</span>
                                <span className={styles.hintValue}><HintRevealer value={props.hints.frequencyOfOccurrence.toFixed(2) + "%"}></HintRevealer></span>
                            </div>
                        }
                    </Offcanvas.Body>
                </Offcanvas>
            }
        </>
    );
}