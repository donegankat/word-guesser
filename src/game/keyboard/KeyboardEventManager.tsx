import React from 'react';
import ILetterHistory from '../interfaces/ILetterHistory';
import OnScreenKeyboard from './OnScreenKeyboard';

interface IKeyboardEventManagerProps {
    guessedLetters: ILetterHistory;
    onKeyPressed: (pressedKey: string) => void;
}

export default function MonitorKeyboardEvents(props: IKeyboardEventManagerProps) {
    const [, setPressed] = React.useState([""])
    const onKeyPressedCallback = props.onKeyPressed;

    React.useEffect(() => {
        const handleKeyDown = (event: KeyboardEvent) => {
            const { key } = event
            setPressed(prevPressed => [...prevPressed, key]);

            onKeyPressedCallback(key);
        };

        const handleKeyUp = (event: KeyboardEvent) => {
            const { key } = event
            setPressed(pressed => pressed.filter(k => k !== key))
        };

        document.addEventListener('keydown', handleKeyDown);
        document.addEventListener('keyup', handleKeyUp);

        return () => {
            document.removeEventListener('keydown', handleKeyDown)
            document.removeEventListener('keyup', handleKeyUp)
        }
    }, [onKeyPressedCallback]);

    return (
        <div className='on-screen-keyboard'>
            <OnScreenKeyboard
                onKeyPressed={props.onKeyPressed}
                guessedLetters={props.guessedLetters}
            />
        </div>
    )
}