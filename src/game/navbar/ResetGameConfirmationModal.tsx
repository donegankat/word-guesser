import React from "react";
import { Button, Modal } from "react-bootstrap";

interface IResetGameConfirmationModalProps {
	isShown: boolean;
	onShow: () => void;
    onHide: () => void;
    onConfirmResetGame: () => void;
}

export default function ResetGameConfirmationModal(props: IResetGameConfirmationModalProps) {
	const handleShowNewGameConfirmationModal = () => {
		props.onShow();
	};

	const handleCloseNewGameConfirmationModal = () => {
		props.onHide();
	};

    const handleConfirmResetGame = () => {
		props.onHide();
        props.onConfirmResetGame();
	};

	return (
		<Modal
			show={props.isShown}
			restoreFocus={false}
			centered={true}
			onShow={handleShowNewGameConfirmationModal}
			onHide={handleCloseNewGameConfirmationModal}
		>
			<Modal.Body>
				Lose all progress on the current game and start over with a new word?
			</Modal.Body>
			<Modal.Footer>
				<Button
					variant="secondary"
					onClick={handleCloseNewGameConfirmationModal}
				>
					Cancel
				</Button>
				<Button variant="primary" onClick={handleConfirmResetGame}>
					Reset
				</Button>
			</Modal.Footer>
		</Modal>
	);
}