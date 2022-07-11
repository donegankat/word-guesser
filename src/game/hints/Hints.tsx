import React from 'react';
import IHints from '../interfaces/IHints';
import HintRevealer from './HintRevealer';
import Offcanvas from 'react-bootstrap/Offcanvas'
import { Button } from 'react-bootstrap';
import LetterRevealer from './LetterRevealer';

import styles from './Hints.module.scss';

interface IHintsProps {
    word?: string[];
    hints?: IHints;
    onShowHideHints: () => void;
}

/**
 * Creates the "Hints" button and flyout panel with revealable hints.
 */
export default function Hints(props: IHintsProps) {
    const [show, setShow] = React.useState(false);

    const handleClose = () => {
        setShow(false);

        // Force the DOM to lose focus on the hint button so that typing "Enter"
        // submits the current guess.
        props.onShowHideHints();
    }

    const handleShow = () => {
        setShow(true);

        // Force the DOM to lose focus on the hint button so that typing "Enter"
        // submits the current guess.
        props.onShowHideHints();
    }

    return (
        <>
            <Button variant="outline-primary" onClick={handleShow} className={styles.btnShowHints} tabIndex={0}>
                Show Hints
            </Button>
            {props.hints &&
                <Offcanvas show={show} onHide={handleClose} placement="bottom" restoreFocus={false} className={`${styles.offcanvasHints} h-50`}>
                    <Offcanvas.Header closeButton>
                        <Offcanvas.Title>Hints</Offcanvas.Title>
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
