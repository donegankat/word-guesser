import React from 'react';
import IHints from '../interfaces/IHints';
import HintRevealer from './HintRevealer';
import Offcanvas from 'react-bootstrap/Offcanvas'
import { Button } from 'react-bootstrap';
import "./Hints.scss";
import LetterRevealer from './LetterRevealer';

interface IHintsProps {
    word?: string[];
    hints?: IHints;
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
        if (document.activeElement?.parentElement?.parentElement) {
            document.activeElement.parentElement.parentElement.focus();
        }
    }

    const handleShow = () => {
        setShow(true);

        // Force the DOM to lose focus on the hint button so that typing "Enter"
        // submits the current guess.
        if (document.activeElement?.parentElement?.parentElement) {
            document.activeElement.parentElement.parentElement.focus();
        }
    }

    return (
        <>
            <Button variant="outline-primary" onClick={handleShow} className="btn-show-hints" tabIndex={0}>
                Show Hints
            </Button>
            {props.hints &&
                <Offcanvas show={show} onHide={handleClose} placement="bottom" restoreFocus={false} {...props} className="offcanvas-hints h-50">
                    <Offcanvas.Header closeButton>
                        <Offcanvas.Title>Hints</Offcanvas.Title>
                    </Offcanvas.Header>
                    <Offcanvas.Body>
                        {
                            props.word &&
                            <div className='hint-row hint-letters-row'>
                                <span className='hint-label'>Reveal a Letter:&nbsp;</span>
                                <span className='hint-value'><LetterRevealer letters={props.word}></LetterRevealer></span>
                            </div>
                        }
                        {
                            props.hints.syllableCount &&
                            <div className='hint-row'>
                                <span className='hint-label'>Number of Syllables:&nbsp;</span>
                                <span className='hint-value'><HintRevealer value={props.hints.syllableCount}></HintRevealer></span>
                            </div>
                        }
                        {
                            props.hints.definitions && props.hints.definitions[0].definition &&
                            <div className='hint-row'>
                                <span className='hint-label'>Definition:&nbsp;</span>
                                <span className='hint-value'><HintRevealer value={props.hints.definitions[0].definition}></HintRevealer></span>
                            </div>
                        }
                        {
                            props.hints.definitions && props.hints.definitions[0].partOfSpeech &&
                            <div className='hint-row'>
                                <span className='hint-label'>Part of Speech:&nbsp;</span>
                                <span className='hint-value'><HintRevealer value={props.hints.definitions[0].partOfSpeech}></HintRevealer></span>
                            </div>
                        }
                        {
                            props.hints.definitions && props.hints.definitions[0].synonyms &&
                            <div className='hint-row'>
                                <span className='hint-label'>Synonyms:&nbsp;</span>
                                <span className='hint-value'><HintRevealer value={props.hints.definitions[0].synonyms.join(", ")}></HintRevealer></span>
                            </div>
                        }
                        {
                            props.hints.definitions && props.hints.definitions[0].antonyms &&
                            <div className='hint-row'>
                                <span className='hint-label'>Antonyms:&nbsp;</span>
                                <span className='hint-value'><HintRevealer value={props.hints.definitions[0].antonyms.join(", ")}></HintRevealer></span>
                            </div>
                        }
                        {
                            props.hints.frequencyOfOccurrence &&
                            <div className='hint-row'>
                                <span className='hint-label'>Frequency of Word Occurrence:&nbsp;</span>
                                <span className='hint-value'><HintRevealer value={props.hints.frequencyOfOccurrence.toFixed(2) + "%"}></HintRevealer></span>
                            </div>
                        }
                    </Offcanvas.Body>
                </Offcanvas>
            }
        </>
    );
}
