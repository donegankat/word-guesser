import React from 'react';

interface IKeyboardEventManagerProps {
    onKeyPressed: (pressedKey: string) => void;
}

export default function MonitorKeyboardEvents(props: IKeyboardEventManagerProps) {
//export default function MonitorKeyboardEvents(onKeyPressed: (pressedKey: string) => void) {
    const [, setPressed] = React.useState([""])
    const onKeyPressedCallback = props.onKeyPressed;

    React.useEffect(() => {
        const handleKeyDown = (event: KeyboardEvent) => {
            const { key } = event
            setPressed(prevPressed => [...prevPressed, key]);

            onKeyPressedCallback(key);
            //onKeyPressed(key);
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
        <></>
    )
}