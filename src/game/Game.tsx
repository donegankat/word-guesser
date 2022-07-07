import * as React from 'react';
import Board from './Board';
import GameConstants from './constants/GameConstants';
import { GameState } from './constants/GameState';
import Hints from './hints/Hints';
import IGuess from './interfaces/IGuess';
import IHints from './interfaces/IHints';
import IWord from './interfaces/IWord';
import MonitorKeyboardEvents from './keyboard/KeyboardEventManager';
import NewGame from './NewGame';
import { Firestore } from 'firebase/firestore';
import ILetterHistory from './interfaces/ILetterHistory';
import { firestoreDb } from '../config/firebaseInit';

import styles from './Game.module.scss';

interface IGameProps {
    isDebugMode: boolean;
    shouldLoadDebugFromRemote: boolean;
}

interface IGameState {
    gameState: number;
    guessHistory: IGuess[];
    guessedLetters: ILetterHistory;
    currentGuessIndex: number;
    winningWord?: IWord;
    hints?: IHints;
}

/**
 * Manages the entire game, including the Board, Squares, loading words and hints,
 * and manages all actions and game states.
 */
export class Game extends React.Component<IGameProps, IGameState> {
    constructor(props: IGameProps) {
        super(props);

        this.state = {
            gameState: GameState.Playing,
            guessHistory: Array.from({ length: GameConstants.MaxGuesses }, () => ({
                letters: [],
                greenHighlightedSquares: [],
                yellowHighlightedSquares: [],
                isSubmitted: false
            })),
            guessedLetters: {
                correctLettersInCorrectLocation: [],
                correctLettersInWrongLocation: [],
                incorrectLetters: []
            },
            currentGuessIndex: 0
        };

        // This binding is necessary to make `this` work in the callback
        this.handleKeyPress = this.handleKeyPress.bind(this);
        this.onClickResetGame = this.onClickResetGame.bind(this);
    }

    /**
     * Handles when the component mounts.
     */
    componentDidMount() {
        const winningWord = this.state.winningWord;
        if (winningWord === null || winningWord === undefined) {
            this.loadWinningWord();
        }
    }

    /**
     * Loads a new winning word.
     */
    loadWinningWord() {
        const bodyData = {
            wordLength: GameConstants.MaxLetters,
            isDebugMode: this.props.isDebugMode,
            shouldLoadDebugFromRemote: this.props.shouldLoadDebugFromRemote
        };

        fetch('/api/wordsApi', {
            method: "POST",
            body: JSON.stringify(bodyData)
        })
        .then(response => response.json())
        .then((jsonResponse: IWord) => {
            this.handleWordLoaded(jsonResponse);
        })
        .catch(err => {
            console.error("FAILED TO LOAD WORD", err);
        });
    }

    /**
     * Handles when a new winning word is loaded and builds the hints for the new word.
     * @param word 
     */
    handleWordLoaded(word: IWord) {
        this.setState({
            gameState: GameState.Playing,
            winningWord: word,
            hints: {
                definitions: word.results.map((res) => {
                    return {
                        definition: res.definition,
                        partOfSpeech: res.partOfSpeech,
                        synonyms: res.synonyms,
                        antonyms: res.antonyms
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
     * Handles the event when a key is pressed.
     * @param key 
     * @returns 
     */
    handleKeyPress(key: string) {
        if (!key) return;

        // Always lower-case to make for equal string comparisons.
        key = key.toLocaleLowerCase();

        var history = this.state.guessHistory;
        var currentGuessIndex = this.state.currentGuessIndex;
        var currentGuess = history[currentGuessIndex];
        var currentLetterIndex = currentGuess?.letters?.length;
        var currentGameState = this.state.gameState;

        // Only proceed if the game is still playable.
        if (currentGameState !== GameState.Playing) return;

        if (key === "enter") {
            // See if we're able to submit the current guess.
            if (currentGuess.letters.length === GameConstants.MaxLetters) {
                // Evaluate the accuracy of the current guess and move on to the next guess.
                history[currentGuessIndex] = this.evaluateGuess(currentGuess);

                this.setState({
                    guessHistory: history
                });

                var gameState = this.calculateGameStatus(history[currentGuessIndex], currentGuessIndex);

                this.setState({
                    gameState: gameState
                });

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
                guessHistory: history
            });
        } else if (key.length === 1) {
            var keyCode = key.charCodeAt(0);

            // If the entered key was a valid letter guess and if the user isn't maxed out
            // already on letters for the current guess, add the newly entered letter to the
            // guess.
            if (((keyCode >= 65 && keyCode <= 90) || (keyCode >= 97 && keyCode <= 122)) && currentLetterIndex < GameConstants.MaxLetters) {
                currentGuess.letters.push(key);
                history[currentGuessIndex] = currentGuess;

                this.setState({
                    guessHistory: history
                });
            }
        }
    }

    /**
     * Resets the game and loads a new word to play.
     */
    onClickResetGame() {
        // Force the focus back to the game board so that subsequent "Enter"s don't
        // cause another reset.
        var board = document.getElementsByClassName("game-board");
        if (board && board[0] && board[0].firstElementChild)
            (board[0] as HTMLElement).focus();

        this.setState({
            gameState: GameState.Playing,
            guessHistory: Array.from({ length: GameConstants.MaxGuesses }, () => ({
                letters: [],
                greenHighlightedSquares: [],
                yellowHighlightedSquares: [],
                isSubmitted: false
            })),
            guessedLetters: {
                correctLettersInCorrectLocation: [],
                correctLettersInWrongLocation: [],
                incorrectLetters: []
            },
            currentGuessIndex: 0,
            winningWord: undefined,
            hints: undefined
        });

        this.loadWinningWord();
    }

    /**
     * Renders the Game.
     */
    render() {
        const history = this.state.guessHistory;
        const gameStatus = this.state.gameState;
        const winningWord = this.state.winningWord;
        const hints = this.state.hints;
        var guessedLetters = this.state.guessedLetters;

        var status;

        if (gameStatus === GameState.Winner) {
            status = 'You won!';
        } else if (gameStatus === GameState.Loser) {
            status = `You lost. Answer: ${winningWord?.word.toLocaleUpperCase()}`;
        }

        return (
            <div className="game-wrapper">
                <div id="game-container" className={styles.game}>
                    <div className={styles.gameBoard} tabIndex={0}>
                        <Board
                            history={history}
                            maxGuesses={GameConstants.MaxGuesses}
                            maxLetters={GameConstants.MaxLetters}
                        />
                    </div>
                    <div className="flex-row-break"></div>
                    <div className={styles.gameControls}>
                        <div className={styles.gameStatus}>{status}</div>
                        <MonitorKeyboardEvents
                            onKeyPressed={this.handleKeyPress}
                            guessedLetters={guessedLetters}
                        />
                        <div className={styles.gameActions}>
                            <NewGame
                                onNewGameButtonClicked={this.onClickResetGame}
                                currentGameState={gameStatus}
                            />
                            <Hints word={winningWord?.word?.toLocaleUpperCase().split("")} hints={hints} />
                        </div>
                    </div>
                </div>
            </div>
        );
    }

    /**
     * Evaluates the accuracy of the current guess on submit, and colors the
     * squares green or yellow as appropriate.
     * @param guess 
     * @returns 
     */
    evaluateGuess(guess: IGuess): IGuess {
        if (!this.state.winningWord) return guess;

        guess.isSubmitted = true;

        const winningWord = this.state.winningWord.word.split('');
        const guessedLetters = this.state.guessedLetters;

        // Check each letter in order. This accounts for cases where the winning
        // word has duplicate letters.
        for (let i = 0; i < winningWord.length; i++) {
            // Low-hanging fruit; check to see if the current letter is an exact
            // match.
            if (guess.letters[i] === winningWord[i]) {
                guess.greenHighlightedSquares.push(i);

                // Track the letter itself so we can highlight it on the on-screen
                // keyboard.
                guessedLetters.correctLettersInCorrectLocation.push(guess.letters[i].toLocaleUpperCase());
            } else {
                // Find all instances of the current letter in the winning word.
                const allMatchingWinningLetters = winningWord.filter(letter => letter === winningWord[i]);

                // Now find all instances of the current letter in the guess.
                var allMatchingGuessLetters: number[] = [];
                var matchingGuessIterator = -1;
                while ((matchingGuessIterator = guess.letters.indexOf(winningWord[i], matchingGuessIterator + 1)) >= 0) {
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
                for (var k = 0; k < allMatchingGuessLetters.length; k++) {
                    var yellowMatchIndex = allMatchingGuessLetters[k];

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

                    // Track the letter itself so we can highlight it on the on-screen
                    // keyboard.
                    guessedLetters.correctLettersInWrongLocation.push(guess.letters[yellowMatchIndex].toLocaleUpperCase());
                }

                guess.yellowHighlightedSquares.push(...lettersToHighlightYellow);
            }
        }

        // Now that all letters have been evaluated for correctness, make 1 more
        // pass to see which letters were totally incorrect.
        for (var l = 0; l < guess.letters.length; l++) {
            // Mark all letters that aren't correct at all as incorrect on the
            // on-screen keyboard.
            const guessedLetter = guess.letters[l].toLocaleUpperCase();
            if (guessedLetters.correctLettersInCorrectLocation.indexOf(guessedLetter) === -1 && guessedLetters.correctLettersInWrongLocation.indexOf(guessedLetter) === -1) {
                guessedLetters.incorrectLetters.push(guessedLetter);
            }
        }

        // Correct letters in the correct location always trump the correct letters
        // in the wrong location for on-screen keyboard highlighting, so if the user
        // has found a green letter, never mark that letter as yellow again.
        guessedLetters.correctLettersInWrongLocation = guessedLetters.correctLettersInWrongLocation.filter(function (letter) {
            return guessedLetters.correctLettersInCorrectLocation.indexOf(letter) === -1;
        });

        this.setState({
            guessedLetters: {
                // Dedupe each list of letters.
                correctLettersInCorrectLocation: Array.from(new Set(guessedLetters.correctLettersInCorrectLocation)),
                correctLettersInWrongLocation: Array.from(new Set(guessedLetters.correctLettersInWrongLocation)),
                incorrectLetters: Array.from(new Set(guessedLetters.incorrectLetters))
            }
        });

        console.log("EVALUATED", guess);
        return guess;
    }

    /**
     * Determines the current state of the game, whether the user has won or lost.
     * @param {*} squares
     */
    calculateGameStatus(currentGuess: IGuess, currentGuessIndex: number): number {
        if (currentGuess.greenHighlightedSquares?.length === GameConstants.MaxLetters) {
            console.log("WIN", currentGuess, currentGuessIndex);
            return GameState.Winner;
        } else if (currentGuessIndex >= GameConstants.MaxGuesses - 1) {
            console.log("LOSE", currentGuess, currentGuessIndex);
            return GameState.Loser;
        }

        return GameState.Playing;
    }
}