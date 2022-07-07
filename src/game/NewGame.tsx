import * as React from 'react';
import { Button, Modal } from 'react-bootstrap';
import { GameState } from './constants/GameState';

interface INewGameProps {
    currentGameState: number;
    onNewGameButtonClicked: () => void;
}

export default function NewGame(props: INewGameProps) {
    const [show, setShow] = React.useState(false);
    const handleClose = () => setShow(false);

    const handleNewGameButtonClick = () => {
        // If there's a chance the player might lose progress because the game is still
        // unfinished, prompt before we reset the game.
        if (props.currentGameState === GameState.Playing) {
            setShow(true);
        } else {
            props.onNewGameButtonClicked();
        }
    }

    const handleResetGame = () => {
        setShow(false);
        props.onNewGameButtonClicked();
    }

    return (
        <>
            <Button onClick={handleNewGameButtonClick} tabIndex={0} type="reset" autoFocus={false} variant="outline-secondary">New Game</Button>
            <Modal show={show} onHide={handleClose} restoreFocus={false} centered={true}>
                <Modal.Body>
                    Lose all progress on the current game and start over with a new word?
                </Modal.Body>
                <Modal.Footer>
                    <Button variant="secondary" onClick={handleClose}>
                        Cancel
                    </Button>
                    <Button variant="primary" onClick={handleResetGame}>
                        Reset
                    </Button>
                </Modal.Footer>
            </Modal>
        </>
    )
}