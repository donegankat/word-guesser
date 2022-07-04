import React from "react";
import Keyboard from "react-simple-keyboard";
import "react-simple-keyboard/build/css/index.css";
import "./OnScreenKeyboard.scss";

interface IOnScreenKeyboardManagerProps {
    onKeyPressed: (pressedKey: string) => void;
}

export default function OnScreenKeyboard(props: IOnScreenKeyboardManagerProps) {
    const [layout] = React.useState("default");
    const keyboard = React.useRef(null);

    const onKeyPress = (button: string) => {
        if (button === "←") button = "backspace";
        else if (button === "ENTER") button = "enter";

        props.onKeyPressed(button);
    };

    return (
        <div>
            <Keyboard
                keyboardRef={r => (keyboard.current = r)}
                layoutName={layout}
                layout={{
                    'default': [
                        'Q W E R T Y U I O P',
                        'A S D F G H J K L',
                        '← Z X C V B N M ENTER'
                    ]
                }}
                onKeyPress={onKeyPress}
                theme={"hg-theme-default hg-layout-default on-screen-keyboard-theme"}
                buttonTheme={[
                    {
                        class: "btn-on-screen-keyboard btn-enter",
                        buttons: "ENTER"
                    },
                    {
                        class: "btn-on-screen-keyboard btn-backspace",
                        buttons: "←"
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