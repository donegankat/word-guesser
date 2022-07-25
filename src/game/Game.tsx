import * as React from "react";
import Board from "./Board";
import GameConstants from "./constants/GameConstants";
import { GameState } from "./constants/GameState";
import IGuess from "./interfaces/IGuess";
import IHints, { IHintWordFrequency } from "./interfaces/IHints";
import IWord from "./interfaces/IWord";
import MonitorKeyboardEvents from "./keyboard/KeyboardEventManager";
import ILetterHistory from "./interfaces/ILetterHistory";
import MainNavbar from "./navbar/MainNavbar";

import styles from "./Game.module.scss";

interface IGameProps {
	winningWord: IWord;
}

interface IGameState {
    canSubmit: boolean;
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

		this.state = this.resetGameState(props.winningWord);

		// This binding is necessary to make `this` work in the callback
		this.handleKeyPress = this.handleKeyPress.bind(this);
		this.loseFocusOnGameBoard = this.loseFocusOnGameBoard.bind(this);
		this.setFocusOnGameBoard = this.setFocusOnGameBoard.bind(this);
	}

	/**
	 * Handles when the component props update.
	 * If a new winning word prop is passed to this component, this resets the game
	 * state and all data.
	 */
	componentDidUpdate(prevProps: IGameProps) {
		// If we were passed a new winning word, reset the entire game state.
		if (prevProps.winningWord !== this.props.winningWord) {
			this.setState(this.resetGameState(this.props.winningWord));
		}
	}

	/**
	 * Returns a fresh game state with all properties reset.
	 * Used on initial game load and on each reset.
	 * @param winningWord
	 * @returns
	 */
	resetGameState(winningWord: IWord): IGameState {
        return {
            canSubmit: true,
			gameState: GameState.Playing,
			guessHistory: Array.from({ length: GameConstants.MaxGuesses }, () => ({
				letters: [],
				greenHighlightedSquares: [],
				yellowHighlightedSquares: [],
				isSubmitted: false
			})),
			guessedLetters: {
				correctLettersCorrectLocation: [],
				correctLettersWrongLocation: [],
				incorrectLetters: []
			},
			currentGuessIndex: 0,
			winningWord: winningWord,
			hints: this.loadHints(winningWord)
		};
	}

	/**
	 *
	 * @param winningWord Handles when a new winning word is loaded and builds the hints for the new word.
	 * @returns
	 */
	loadHints(winningWord: IWord): IHints {
		return {
			definitions: winningWord.results.map((res) => {
				return {
					definition: res.definition,
					partOfSpeech: res.partOfSpeech,
					synonyms: res.synonyms,
					antonyms: res.antonyms
				};
			}),
			syllableCount: winningWord.syllables.count,

			// According to the Words API documentation, the frequency ranges from
			// approx. 1-7, so we should scale that from 1% to 100%.
			// https://www.wordsapi.com/docs/#frequency
			// https://stackoverflow.com/a/11107254
			wordFrequency: winningWord.frequency
				? this.getWordFrequency(winningWord.frequency)
				: undefined
		};
	}

	getWordFrequency(wordFrequency: number): IHintWordFrequency {
		const frequencyOfOccurrence = ((wordFrequency - 1) / 6) * 100;
		return {
			frequencyOfOccurrence: frequencyOfOccurrence,
			frequencyDescription: this.getWordFrequencyDescription(frequencyOfOccurrence)
		};
	}

	getWordFrequencyDescription(frequencyOfOccurrence: number): string {
		// Roughly equate each of the 7 possible frequency whole numbers with a
		// description of how rare it is using the same formula we use to turn the
		// 1-7 frequency scale to a percentage. Frequencies can have decimals, and
		// that's ok; for the purposes of coming up with a description, we don't
		// care.
		if (frequencyOfOccurrence > ((6 - 1) / 6) * 100) return "extremely common";
		if (frequencyOfOccurrence > ((5 - 1) / 6) * 100) return "very common";
		if (frequencyOfOccurrence > ((4 - 1) / 6) * 100) return "somewhat common";
		if (frequencyOfOccurrence > ((3 - 1) / 6) * 100) return "somewhat uncommon";
		if (frequencyOfOccurrence > ((2 - 1) / 6) * 100) return "very uncommon";
		return "extremely uncommon";
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

        var canSubmit = this.state.canSubmit;
		var history = this.state.guessHistory;
		var currentGuessIndex = this.state.currentGuessIndex;
		var currentGuess = history[currentGuessIndex];
		var currentLetterIndex = currentGuess?.letters?.length;
		var currentGameState = this.state.gameState;

		// Only proceed if the game is still playable.
		if (currentGameState !== GameState.Playing) return;

		if (key === "enter") {
			// See if we're able to submit the current guess.
			if (canSubmit && currentGuess.letters.length === this.props.winningWord.word.length) {
                this.submitGuess();
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
			if (
				((keyCode >= 65 && keyCode <= 90) || (keyCode >= 97 && keyCode <= 122)) &&
				currentLetterIndex < this.props.winningWord.word.length
			) {
				currentGuess.letters.push(key);
				history[currentGuessIndex] = currentGuess;

				this.setState({
					guessHistory: history
				});
			}
		}
	}

	/**
	 * Callback to handle the event when the user clicks a button that needs to have its focus
     * handled after the click.
	 */
	setFocusOnGameBoard() {
		// Force the focus back to the game board so that subsequent "Enter"s don't cause
		// another click on the button. Having the "Enter" key re-click the button could
        // cause annoying behavior like a game reset or showing the hints again.
        var board = document.getElementById("game-container");
		if (board && board.firstElementChild && board.firstElementChild.firstElementChild)
            (board.firstElementChild.firstElementChild as HTMLElement).focus();
        
        this.setState({
            canSubmit: true
        });
    }

    /**
     * Callback to handle when the user clicks a button that needs to force focus off of the game
     * board so as to avoid accidental submits.
     */
    loseFocusOnGameBoard() {
        this.setState({
            canSubmit: false
        });
    }

	/**
	 * Renders the game.
	 */
	render() {
		const history = this.state.guessHistory;
		const currentGuessIndex = this.state.currentGuessIndex;
		const currentGuess = history[currentGuessIndex];
		const gameStatus = this.state.gameState;
		const winningWord = this.state.winningWord;
		const hints = this.state.hints;
		var guessedLetters = this.state.guessedLetters;

        var status;
        var statusClassName = "";

		if (gameStatus === GameState.Winner) {
			status = "You won!";
            statusClassName = styles.gameStatusShown;
		} else if (gameStatus === GameState.Loser) {
			status = `You lost. Answer: ${winningWord?.word.toLocaleUpperCase()}`;
            statusClassName = styles.gameStatusShown;
        } else if (currentGuess.isInvalidGuess) {
            status = "Invalid guess";
            statusClassName = styles.gameStatusShown;
        }

        return (
            <>
                <MainNavbar
                    word={winningWord?.word?.toLocaleUpperCase().split("")}
                    hints={hints}
                    currentGameState={gameStatus}
                    loseFocusOnGameBoard={this.loseFocusOnGameBoard}
					setFocusOnGameBoard={this.setFocusOnGameBoard}
				></MainNavbar>
				<div className="game-wrapper">
					<div id="game-container" className={styles.game}>
						<div className={styles.gameBoard} tabIndex={0}>
							<Board
								history={history}
								maxGuesses={GameConstants.MaxGuesses}
								maxLetters={this.props.winningWord.word.length}
							/>
						</div>
						<div className="flex-row-break"></div>
						<div className={styles.gameControls}>
							<div className={styles.gameStatus}>
								<span className={statusClassName}>{status}</span>
							</div>
							<MonitorKeyboardEvents
								onKeyPressed={this.handleKeyPress}
								guessedLetters={guessedLetters}
							/>
						</div>
					</div>
                </div>
            </>
		);
	}

    /**
     * Attempts to submit a guess. If the guess is a valid word, this increments the guess
     * history and updates the guessed words/letters.
     * If the guess is not a valid word, this communicates to the user that their guess was
     * invalid.
     * @returns 
     */
    async submitGuess() {
        var history = this.state.guessHistory;
		var currentGuessIndex = this.state.currentGuessIndex;
		var currentGuess = history[currentGuessIndex];
        
        const isValidGuess: boolean = await this.checkGuessValidity(currentGuess.letters.join(""));
        if (!isValidGuess) {
            currentGuess.isInvalidGuess = true;
            history[currentGuessIndex] = currentGuess;
            
            this.setState({
                guessHistory: history
            });

            // Once we've alerted the user that their guess was invalid, remove the
            // CSS class that causes the row to stand out.
            setTimeout(() => {
                currentGuess.isInvalidGuess = false;
                history[currentGuessIndex] = currentGuess;

                this.setState({
                    guessHistory: history
                });
            }, 1000);
            return;
        }

        // Evaluate the accuracy of the current guess and move on to the next guess.
        history[currentGuessIndex] = this.evaluateGuessLetterAccuracy(currentGuess);

        this.setState({
            guessHistory: history
        });

        var gameState = this.calculateGameStatus(
            history[currentGuessIndex],
            currentGuessIndex
        );

        this.setState({
            gameState: gameState
        });

        // Only move on to the next guess if we have more guesses available and if
        // the user hasn't won yet.
        var nextGuessIndex =
            gameState === GameState.Playing
                ? currentGuessIndex + 1
                : currentGuessIndex;

        this.setState({
            currentGuessIndex: nextGuessIndex
        });
    }

	/**
	 * Evaluates the accuracy of the current guess on submit, and colors the
	 * squares green or yellow as appropriate.
	 * @param guess
	 * @returns
	 */
	evaluateGuessLetterAccuracy(guess: IGuess): IGuess {
		if (!this.state.winningWord) return guess;

		guess.isSubmitted = true;

		const winningWord = this.state.winningWord.word.split("");
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
				guessedLetters.correctLettersCorrectLocation.push(
					guess.letters[i].toLocaleUpperCase()
				);
			} else {
				// Find all instances of the current letter in the winning word.
				const allMatchingWinningLetters = winningWord.filter(
					(letter) => letter === winningWord[i]
				);

				// Now find all instances of the current letter in the guess.
				var allMatchingGuessLetters: number[] = [];
				var matchingGuessIterator = -1;
				while (
					(matchingGuessIterator = guess.letters.indexOf(
						winningWord[i],
						matchingGuessIterator + 1
					)) >= 0
				) {
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
					guessedLetters.correctLettersWrongLocation.push(
						guess.letters[yellowMatchIndex].toLocaleUpperCase()
					);
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
			if (
				guessedLetters.correctLettersCorrectLocation.indexOf(guessedLetter) === -1 &&
				guessedLetters.correctLettersWrongLocation.indexOf(guessedLetter) === -1
			) {
				guessedLetters.incorrectLetters.push(guessedLetter);
			}
		}

		// Correct letters in the correct location always trump the correct letters
		// in the wrong location for on-screen keyboard highlighting, so if the user
		// has found a green letter, never mark that letter as yellow again.
		guessedLetters.correctLettersWrongLocation =
			guessedLetters.correctLettersWrongLocation.filter(function (letter) {
				return (
					guessedLetters.correctLettersCorrectLocation.indexOf(letter) === -1
				);
			});

		this.setState({
			guessedLetters: {
				// Dedupe each list of letters.
				correctLettersCorrectLocation: Array.from(
					new Set(guessedLetters.correctLettersCorrectLocation)
				),
				correctLettersWrongLocation: Array.from(
					new Set(guessedLetters.correctLettersWrongLocation)
				),
				incorrectLetters: Array.from(new Set(guessedLetters.incorrectLetters))
			}
		});

		return guess;
    }
    
    async checkGuessValidity(wordToCheck: string) {
        const bodyData = {
            wordToCheck: wordToCheck
        };

        const isValidGuess = await fetch('/api/checkGuessValidity', {
            method: "POST",
            body: JSON.stringify(bodyData)
        })
        .then(response => response.json())
        .then((jsonResponse: { isValidGuess: boolean }) => {
            console.log(jsonResponse);
            return jsonResponse.isValidGuess;
        })
        .catch(err => {
            console.error("FAILED TO CHECK VALIDITY", wordToCheck, err);
            throw err;
        });

        return isValidGuess;
    }

	/**
	 * Determines the current state of the game, whether the user has won or lost.
	 * @param {*} squares
	 */
	calculateGameStatus(currentGuess: IGuess, currentGuessIndex: number): number {
		if (
			currentGuess.greenHighlightedSquares?.length === this.props.winningWord.word.length
		) {
			console.log("WIN", currentGuess, currentGuessIndex);
			return GameState.Winner;
		} else if (currentGuessIndex >= GameConstants.MaxGuesses - 1) {
			console.log("LOSE", currentGuess, currentGuessIndex);
			return GameState.Loser;
		}

		return GameState.Playing;
	}
}