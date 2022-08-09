import React from "react";
import {
	Offcanvas,
	ToggleButtonGroup,
	ToggleButton,
	Button
} from "react-bootstrap";
import {
	getStoredWordLengthFromCookieOrDefault,
	SettingsContext
} from "../../../contexts/SettingsContext";
import GameConstants from "../../constants/GameConstants";
import ResetGameConfirmationModal from "../ResetGameConfirmationModal";

import styles from "./Settings.module.scss";

interface ISettingsProps {
	isShown: boolean;
	onShow: () => void;
	onHide: () => void;
	setFocusOnGameBoard: () => void;
	loseFocusOnGameBoard: () => void;
	onConfirmResetGame: () => void;
}

export default function SettingsMenu(props: ISettingsProps) {
	const [showNewGameConfirmationModal, setShowNewGameConfirmationModal] = React.useState(false);
	const [currentWordLength, setCurrentWordLength] = React.useState(
		getStoredWordLengthFromCookieOrDefault()
	);
	const { globalWordLength, setGlobalWordLength } = React.useContext(SettingsContext);

	const handleWordLengthChange = (value: number) => {
		setCurrentWordLength(value);
	};

	const handleShowNewGameConfirmationModal = () => {
		setShowNewGameConfirmationModal(true);
		props.loseFocusOnGameBoard();
	};

	const handleCloseNewGameConfirmationModal = () => {
		setShowNewGameConfirmationModal(false);
		props.setFocusOnGameBoard();
	};

	const handleConfirmSaveSettings = () => {
		// Only persist the settings when the user clicks "Save" and accepts the confirmation.
		setGlobalWordLength(currentWordLength);
		setShowNewGameConfirmationModal(false);
		props.onHide();
		props.setFocusOnGameBoard();
		props.onConfirmResetGame();
	};

	const buildWordLengthOptionButtons = () => {
		const wordLengthOptionButtons: JSX.Element[] = [];

		for (var i = GameConstants.MinGuessLetters; i <= GameConstants.MaxGuessLetters; i++) {
			wordLengthOptionButtons.push(
				<ToggleButton
					id={`tbg-radio-${i}`}
					key={`btn-word-length-${i}`}
                    value={i}
                    variant="secondary"
				>
					{i}
				</ToggleButton>
			);
		}

		return wordLengthOptionButtons;
	};

	return (
		<>
			<Offcanvas
				show={props.isShown}
				onShow={props.onShow}
				onHide={props.onHide}
				id={"offcanvasNavbar-expand-settings"}
				aria-labelledby={"offcanvasNavbarLabel-expand-settings"}
				placement="end"
				restoreFocus={false}
				className="offcanvas-lg"
			>
				<Offcanvas.Header closeButton>
					<Offcanvas.Title id={"offcanvasNavbarLabel-expand-settings"}>
						Settings
					</Offcanvas.Title>
				</Offcanvas.Header>
				<Offcanvas.Body>
					<SettingsContext.Consumer>
						{(value) => (
							<div>
								<div>
									<div>
										<h6>Word Length</h6>
										<ToggleButtonGroup
											type="radio"
											name="options"
											defaultValue={currentWordLength}
											aria-label="Choose the length of the word to guess"
											onChange={handleWordLengthChange}
										>
											{buildWordLengthOptionButtons()}
										</ToggleButtonGroup>
									</div>
								</div>
								<div className={`${styles.saveButtonBlock}`}>
									<Button onClick={handleShowNewGameConfirmationModal}>
										Save
									</Button>
								</div>
								<div className={`${styles.copyrightBlock} text-muted`}>
									<div>
										<hr />
										&copy; {new Date().getFullYear()}{" "}
										<a
											className="text-muted"
											href="https://katdonegan.com"
											title="Personal Website for Kat Donegan"
										>
											Kat Donegan
										</a>
									</div>
									<div>
										<a
											className="text-muted"
											href="https://github.com/donegankat/word-guesser"
											title="GitHub repository for the Word Guesser game"
										>
											Word Guesser GitHub
										</a>
									</div>
								</div>
							</div>
						)}
					</SettingsContext.Consumer>
				</Offcanvas.Body>
			</Offcanvas>

			<ResetGameConfirmationModal
				isShown={showNewGameConfirmationModal}
				onShow={handleShowNewGameConfirmationModal}
				onHide={handleCloseNewGameConfirmationModal}
				onConfirmResetGame={handleConfirmSaveSettings}
			/>
		</>
	);
}