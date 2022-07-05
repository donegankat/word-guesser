import React from "react";
import Keyboard from "react-simple-keyboard";
import "react-simple-keyboard/build/css/index.css";
import ILetterHistory from "../interfaces/ILetterHistory";
import "./OnScreenKeyboard.scss";

interface IOnScreenKeyboardManagerProps {
    onKeyPressed: (pressedKey: string) => void;
    guessedLetters: ILetterHistory;
}

const backspaceChar = "&#9003;";

export default function OnScreenKeyboard(props: IOnScreenKeyboardManagerProps) {
    const [layout] = React.useState("default");
    const keyboard = React.useRef(null);

    const onKeyPress = (button: string) => {
        if (button === backspaceChar) button = "backspace";
        else if (button === "SUBMIT") button = "enter";

        props.onKeyPressed(button);
    };

    const setLetterColors = (guessedLetters: ILetterHistory) => {
        const baseLetterKeyClass = "hg-button hg-standardBtn btn-on-screen-keyboard btn-letter";
        const allLetters = document.querySelectorAll(".btn-on-screen-keyboard.btn-letter");

        // Start by resetting all keys back to the base state.
        allLetters.forEach((letterKey) => {
            letterKey.className = baseLetterKeyClass;
        });

        // Now set each keyboard letter to an appropriate color depending on its
        // correctness.
        if (guessedLetters.correctLettersInCorrectLocation) {
            for(var greenLetter of guessedLetters.correctLettersInCorrectLocation) {
                var greenLetterKey = document.querySelector(`.btn-on-screen-keyboard.btn-letter[data-skbtn="${greenLetter}"]`)
                if (greenLetterKey)
                    greenLetterKey.className = `${baseLetterKeyClass} btn-correct-letter-correct-location`;
            }
        }
    
        if (guessedLetters.correctLettersInWrongLocation) {
            for(var yellowLetter of guessedLetters.correctLettersInWrongLocation) {
                var yellowLetterKey = document.querySelector(`.btn-on-screen-keyboard.btn-letter[data-skbtn="${yellowLetter}"]`)
                if (yellowLetterKey)
                    yellowLetterKey.className = `${baseLetterKeyClass} btn-correct-letter-wrong-location`;
            }
        }
    
        if (guessedLetters.incorrectLetters) {
            for(var incorrectLetter of guessedLetters.incorrectLetters) {
                var incorrectLetterKey = document.querySelector(`.btn-on-screen-keyboard.btn-letter[data-skbtn="${incorrectLetter}"]`)
                if (incorrectLetterKey)
                    incorrectLetterKey.className = `${baseLetterKeyClass} btn-incorrect-letter`;
            }
        }
    }

    setLetterColors(props.guessedLetters);

    return (
        <div>
            <Keyboard
                keyboardRef={r => (keyboard.current = r)}
                layoutName={layout}
                layout={{
                    'default': [
                        'Q W E R T Y U I O P',
                        'A S D F G H J K L',
                        'Z X C V B N M',
                        `${backspaceChar} SUBMIT`
                    ]
                }}
                onKeyPress={onKeyPress}
                theme={"hg-theme-default hg-layout-default on-screen-keyboard-theme"}
                buttonTheme={[
                    {
                        class: "btn-on-screen-keyboard btn-enter",
                        buttons: "SUBMIT"
                    },
                    {
                        class: "btn-on-screen-keyboard btn-backspace",
                        buttons: backspaceChar
                    },
                    {
                        class: "btn-on-screen-keyboard btn-letter",
                        buttons: "Q W E R T Y U I O P A S D F G H J K L Z X C V B N M"
                    }
                ]}
            />
        </div>
    );
}