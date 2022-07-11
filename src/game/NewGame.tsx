import * as React from "react";
import { Button, Modal } from "react-bootstrap";
import { GameState } from "./constants/GameState";
import { useRouter } from "next/router";

interface INewGameProps {
	currentGameState: number;
	onNewGameButtonClicked: () => void;
	onConfirmationModalClose: () => void;
}

export default function NewGame(props: INewGameProps) {
	const [showConfirmationModal, setShowConfirmationModal] =
		React.useState(false);

	/**
	 * Router is used here to force NextJS to reload a new word on the server-
	 * side using getServerSideProps, which only runs once per request.
	 * By artificially changing the route, we can force it to load a new word
	 * on-demand.
	 */
	const router = useRouter();

	const handleCloseConfirmationModal = () => {
		setShowConfirmationModal(false);
		props.onConfirmationModalClose();
	};

	const handleNewGameButtonClick = (e: React.MouseEvent) => {
		// If there's a chance the player might lose progress because the game
		// is still unfinished, prompt before we reset the game.
		if (props.currentGameState === GameState.Playing) {
			setShowConfirmationModal(true);
		} else {
			// Force the focus off of the "New Game" button.
			// Simply calling .focus() on the game boards isn't enough on its
			// own to make this stubborn button lose focus, so .blur() is also
			// necessary.
			(e.target as HTMLElement).blur();

			handleResetGame();
		}
	};

	const handleResetGame = () => {
		setShowConfirmationModal(false);
		props.onNewGameButtonClicked();
		router.replace(router.asPath);
	};

	return (
		<>
			<Button
				onClick={handleNewGameButtonClick}
				tabIndex={0}
				type="reset"
				autoFocus={false}
				variant="outline-secondary"
			>
				New Game
			</Button>
			<Modal
				show={showConfirmationModal}
				onHide={handleCloseConfirmationModal}
				restoreFocus={false}
				centered={true}
			>
				<Modal.Body>
					Lose all progress on the current game and start over with a new word?
				</Modal.Body>
				<Modal.Footer>
					<Button variant="secondary" onClick={handleCloseConfirmationModal}>
						Cancel
					</Button>
					<Button variant="primary" onClick={handleResetGame}>
						Reset
					</Button>
				</Modal.Footer>
			</Modal>
		</>
	);
}