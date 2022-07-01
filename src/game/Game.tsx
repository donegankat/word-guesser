import { KeyObject } from 'crypto';
import * as React from 'react';
import Board from './Board';
import GameConstants from './constants/GameConstants';
import { GameState } from './constants/GameState';
import Hints from './hints/Hints';
import IGuess from './interfaces/IGuess';
import IHints from './interfaces/IHints';
import IWord from './interfaces/IWord';
import MonitorKeyboardEvents from './KeyboardEventManager';
import LoadWord from './WordApiManager';

interface IGameProps {
}

interface IGameState {
    history: IGuess[];
    currentGuessIndex: number;
    winningWord?: IWord;
    hints?: IHints;
}

/**
 * Manages the entire game, including the Board, Squares, and move history, and manages all actions and game states.
 */
export class Game extends React.Component<IGameProps, IGameState> {
    constructor(props: IGameProps) {
        super(props);

        this.state = {
            history: Array.from({ length: GameConstants.MaxGuesses }, () => ({
                letters: [],
                greenHighlightedSquares: [],
                yellowHighlightedSquares: []
            })),
            currentGuessIndex: 0
        };
        
        // This binding is necessary to make `this` work in the callback
        this.handleKeyPress = this.handleKeyPress.bind(this);
        //this.handleWordLoaded = this.handleWordLoaded.bind(this);
    }

    componentDidMount() {
        const winningWord = this.state.winningWord;
        if (winningWord === null || winningWord === undefined) {
            LoadWord({
                wordLength: GameConstants.MaxLetters,
                isDebugMode: true
            }).then(word => this.handleWordLoaded(word));
        }

        //KeyboardEventManager({ onKeyPress: this.handleKeyPress });

        // ManageGameEvents({
        //     onWordLoaded: this.handleWinningWordFetched,
        //     onKeyPressed: this.handleKeyPress
        // })

    }

    handleWordLoaded(word: IWord) {
        this.setState({
            winningWord: word,
            hints: {
                definitions: word.results.map((res) => {
                    return {
                        definition: res.definition,
                        partOfSpeech: res.partOfSpeech
                    }
                }),
                syllableCount: word.syllables.count,

                // According to the Words API documentation, the frequency ranges from
                // approx. 1-7, so we should scale that from 1% to 100%.
                // https://www.wordsapi.com/docs/#frequency
                // https://stackoverflow.com/a/11107254
                frequencyOfOccurrence: word.frequency ? ((word.frequency - 1) / 6) * 100 : undefined
            }
        });

        console.log("WORD FETCHED", word, this.state);
    }

    /**
     * Handles when a square is clicked.
     * @param {*} i
     */
    handleClick(guess: string) {
        const history = this.state.history.slice(0, this.state.currentGuessIndex + 1);
        const current = history[history.length - 1];


        // Ignore the click if there's already a winner or the space is taken.
        // if (
        //   this.calculateGameStatus(guesses).gameStatus === GameState.Winner ||
        //   guesses[i]
        // ) {
        //   return;
        // }

        // guesses[i] = guess;

        // this.setState({
        //   history: history.concat([
        //     {
        //       guesses: guesses,
        //     },
        //   ]),
        //   guessNumber: history.length
        // });
    }

    handleKeyPress(key: string) {
        // Only proceed if the game is still playable.
        if (!key) return;

        // Always lower-case to make for equal string comparisons.
        key = key.toLocaleLowerCase();

        var history = this.state.history;
        var currentGuessIndex = this.state.currentGuessIndex;
        var currentGuess = history[currentGuessIndex];
        var currentLetterIndex = currentGuess?.letters?.length;

        if (this.calculateGameStatus(currentGuess, currentGuessIndex) !== GameState.Playing) return;
        //console.log("KEYPRESS", key, this)

        if (key === "enter") {

            // See if we're able to submit the current guess.
            if (currentGuess.letters.length === GameConstants.MaxLetters) {
                // Evaluate the accuracy of the current guess and move on to the next guess.
                history[currentGuessIndex] = this.evaluateGuess(currentGuess);

                this.setState({
                    history: history
                });

                var gameState = this.calculateGameStatus(history[currentGuessIndex], currentGuessIndex);

                // Only move on to the next guess if we have more guesses available and if
                // the user hasn't won yet.
                var nextGuessIndex = gameState === GameState.Playing ? currentGuessIndex + 1 : currentGuessIndex;
                this.setState({
                    currentGuessIndex: nextGuessIndex
                });
            }
        } else if (key === "backspace") {
            // Delete a letter from the current guess.
            currentGuess.letters.pop();
            history[currentGuessIndex] = currentGuess;

            this.setState({
                history: history
            });
        } else if (key.length === 1) {
            var keyCode = key.charCodeAt(0);

            // If the entered key was a valid letter guess and if the user isn't maxxed out
            // already on letters for the current guess, add the newly entered letter to the
            // guess.
            if (((keyCode >= 65 && keyCode <= 90) || (keyCode >= 97 && keyCode <= 122)) && currentLetterIndex < GameConstants.MaxLetters) {
                currentGuess.letters.push(key);
                history[currentGuessIndex] = currentGuess;

                this.setState({
                    history: history
                });
            }
        }
    }

    /**
     * Renders the Game.
     */
    render() {
        const history = this.state.history;
        const currentGuessIndex = this.state.currentGuessIndex;
        const currentGuess = history[currentGuessIndex];
        const gameStatus = this.calculateGameStatus(currentGuess, currentGuessIndex);
        const hints = this.state.hints;

        // Iterate over the entire move history and build a list of previous moves that the user can click to
        // go back to.
        //const moveHistory = this.buildMoveHistory(history, currentMove);

        let status;

        if (gameStatus === GameState.Winner) {
            status = 'You won!';
        } else if (gameStatus === GameState.Loser) {
            status = 'You lost';
        } else {
            //status = 'Next player: ' + (this.state.xIsNext ? 'X' : 'O');
        }

        return (
            <div className="game">
                <MonitorKeyboardEvents onKeyPressed={this.handleKeyPress}></MonitorKeyboardEvents>
                {/* <GameEventManager
                    onKeyPressed={this.handleKeyPress}
                    onWordLoaded={this.handleWordLoaded}
                /> */}
                <div className="game-board">
                    <Board
                        history={history}
                        maxGuesses={GameConstants.MaxGuesses}
                        maxLetters={GameConstants.MaxLetters}
                    />
                </div>
                <div className="flex-row-break"></div>
                <div className="game-info">
                    <div className="game-status">{status}</div>
                    <Hints hints={hints} />
                </div>
            </div>
        );
    }
    
    evaluateGuess(guess: IGuess): IGuess {
        if (!this.state.winningWord) return guess;

        const winningWord = this.state.winningWord.word.split('');//["T", "H", "E", "E", "E"];

        // Check each letter in order. This accounts for cases where the winning
        // word has duplicate letters.
        for (let i = 0; i < winningWord.length; i++) {
            // Low-hanging fruit; check to see if the current letter is an exact
            // match.
            if (guess.letters[i] === winningWord[i]) {
                guess.greenHighlightedSquares.push(i);
            } else {
                // Find all instances of the current letter in the winning word.
                const allMatchingWinningLetters = winningWord.filter(letter => letter === winningWord[i]);

                // Now find all instances of the current letter in the guess.
                var allMatchingGuessLetters: number[] = [];
                var matchingGuessIterator = -1;
                while((matchingGuessIterator = guess.letters.indexOf(winningWord[i], matchingGuessIterator + 1)) >= 0) {
                    allMatchingGuessLetters.push(matchingGuessIterator);
                }

                var lettersToHighlightGreen: number[] = [];
                var lettersToHighlightYellow: number[] = [];
                var highlightedLetterCount = 0;

                // Find all greens to highlight first. Only highlight yellows if
                // there are leftover matching letters in incorrect positions.
                for (var j = 0; j < allMatchingGuessLetters.length; j++) {
                    var matchIndex = allMatchingGuessLetters[j];

                    if (guess.letters[matchIndex] === winningWord[matchIndex]) {
                        lettersToHighlightGreen.push(matchIndex);
                        highlightedLetterCount++;
                    }
                }

                // See which letters (if any) we should highlight yellow. We'll
                // only highlight as many yellows as is appropriate, so for example,
                // if the winning word is "THERE" and the guess was "EERIE", we'll
                // always highlight the last "E" because it's green and that always
                // wins out. In addition, we'll highlight the 1st "E" yellow because
                // there are 2 "E"s in "THERE" and therefore 1 other "E" is correct.
                // We will not highlight the 2nd "E" because the winning word doesn't
                // contain 3 "E"s.
                for (var j = 0; j < allMatchingGuessLetters.length; j++) {
                    var yellowMatchIndex = allMatchingGuessLetters[j];

                    // Skip any letters we've already highlighted green.
                    if (lettersToHighlightGreen.includes(yellowMatchIndex)) {
                        continue;
                    }

                    // If we've already highlighted as many matching letters as there
                    // are in the entire word, we're done, even if more instances of
                    // this same letter exist in the guess (e.g. if the winning word
                    // is "THERE" and the user guesses "THEEE", only 2/3 "E"s would
                    // be highlighted).
                    if (highlightedLetterCount >= allMatchingWinningLetters.length) {
                        break;
                    }

                    lettersToHighlightYellow.push(yellowMatchIndex);
                    highlightedLetterCount++;
                }

                guess.yellowHighlightedSquares.push(...lettersToHighlightYellow);
            }
        }

        console.log("EVALUATED", guess);
        return guess;
    }

    /**
     * Determines the current state of the game. If there's a winner, this returns the winning player and the
     * list of Squares that resulted in the win. If all squares are filled but there's no winner, the state is
     * a draw.
     * @param {*} squares
     */
    calculateGameStatus(currentGuess: IGuess, currentGuessIndex: number): number {
        //var currentGuessIndex = this.state.currentGuessIndex;

        // If the current guess index already equals or exceeds the max number of
        // guesses, that means the user submitted their last guess and it still
        // wasn't correct.
        // if (currentGuessIndex >= Constants.MaxGuesses) {
        //     return GameState.Loser;
        // }

        //var currentGuess = this.state.history[currentGuessIndex];

        if (currentGuessIndex >= GameConstants.MaxGuesses) {
            console.log("LOSE", currentGuess, currentGuessIndex);
            return GameState.Loser;
        } else if (currentGuess.greenHighlightedSquares?.length === GameConstants.MaxLetters) {
            console.log("WIN", currentGuess, currentGuessIndex);
            return GameState.Winner;
        } 

        return GameState.Playing;
    }
}