import * as React from 'react';
import { Button, Modal } from 'react-bootstrap';
import { GameState } from './constants/GameState';
import { useRouter } from 'next/router';

interface INewGameProps {
    currentGameState: number;
    onNewGameButtonClicked: () => void;
}

export default function NewGame(props: INewGameProps) {
    const [show, setShow] = React.useState(false);
    const handleClose = () => setShow(false);

    /**
     * Router is used here to force NextJS to reload a new word on the server-
     * side using getServerSideProps, which only runs once per request.
     * By artificially changing the route, we can force it to load a new word
     * on-demand.
     */
    const router = useRouter();

    const handleNewGameButtonClick = () => {
        // If there's a chance the player might lose progress because the game
        // is still unfinished, prompt before we reset the game.
        if (props.currentGameState === GameState.Playing) {
            setShow(true);
        } else {
            props.onNewGameButtonClicked();
            router.replace(router.asPath);
        }
    }

    const handleResetGame = () => {
        setShow(false);
        props.onNewGameButtonClicked();
        router.replace(router.asPath);
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