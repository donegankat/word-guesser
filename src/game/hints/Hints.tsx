import * as React from 'react';
import IHints from '../interfaces/IHints';
import HintRevealer from './HintRevealer';

interface IHintsProps {
    hints?: IHints;
}

/**
 * Creates the board which contains the squares which represent the letters
 * for each guess.
 */
export default class Hints extends React.Component<IHintsProps> {
    // renderHint(guessIndex: number, letterIndex: number) {
    //     const currentGuess = this.props.history[guessIndex];
    //     return (
    //         <Square
    //             key={`row-index-${guessIndex}-square-index-${letterIndex}`}
    //             value={currentGuess.letters[letterIndex]}
    //             isHighlightedGreen={currentGuess.greenHighlightedSquares !== undefined && currentGuess.greenHighlightedSquares.indexOf(letterIndex) > -1}
    //             isHighlightedYellow={currentGuess.yellowHighlightedSquares !== undefined && currentGuess.yellowHighlightedSquares.indexOf(letterIndex) > -1}
    //         />
    //     );
    // }

    render() {
        return this.props.hints ? (
            <div>
                {
                    this.props.hints.syllableCount &&
                    <div className='hint-row'>
                        <span className='hint-label'>Number of Syllables:&nbsp;</span>
                        <span className='hint-value'><HintRevealer value={this.props.hints.syllableCount}></HintRevealer></span>
                    </div>
                }
                {
                    this.props.hints.frequencyOfOccurrence &&
                    <div className='hint-row'>
                        <span className='hint-label'>Frequency of Word Occurrence:&nbsp;</span>
                        <span className='hint-value'><HintRevealer value={this.props.hints.frequencyOfOccurrence.toFixed(2) + "%"}></HintRevealer></span>
                    </div>
                }
                {
                    this.props.hints.definitions && this.props.hints.definitions[0].definition &&
                    <div className='hint-row'>
                        <span className='hint-label'>Definition:&nbsp;</span>
                        <span className='hint-value'><HintRevealer value={this.props.hints.definitions[0].definition}></HintRevealer></span>
                    </div>
                }
                {
                    this.props.hints.definitions && this.props.hints.definitions[0].partOfSpeech &&
                    <div className='hint-row'>
                        <span className='hint-label'>Part of Speech:&nbsp;</span>
                        <span className='hint-value'><HintRevealer value={this.props.hints.definitions[0].partOfSpeech}></HintRevealer></span>
                    </div>
                }
                {
                    this.props.hints.definitions && this.props.hints.definitions[0].synonyms &&
                    <div className='hint-row'>
                        <span className='hint-label'>Synonyms:&nbsp;</span>
                        <span className='hint-value'><HintRevealer value={this.props.hints.definitions[0].synonyms.join(", ")}></HintRevealer></span>
                    </div>
                }
                {
                    this.props.hints.definitions && this.props.hints.definitions[0].antonyms &&
                    <div className='hint-row'>
                        <span className='hint-label'>Antonyms:&nbsp;</span>
                        <span className='hint-value'><HintRevealer value={this.props.hints.definitions[0].antonyms.join(", ")}></HintRevealer></span>
                    </div>
                }
            </div>
        ) : <></>;
    }
}
