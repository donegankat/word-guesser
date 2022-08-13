import React from "react";
import {
	Offcanvas,
	ToggleButtonGroup,
	ToggleButton,
	Button
} from "react-bootstrap";
import {
	getGlobalSettings,
	updateGlobalSettings
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
	const globalSettings = getGlobalSettings();

	const [currentWordLength, setCurrentWordLength] = React.useState(
		globalSettings.wordLength
	);
	const [currentWordMinFrequency, setCurrentWordMinFrequency] = React.useState(
		globalSettings.wordMinFrequency
	);

	const handleWordLengthChange = (value: number) => {
		setCurrentWordLength(value);
	};

	const handleWordMinFrequencyChange = (value: number) => {
		setCurrentWordMinFrequency(value);
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
		updateGlobalSettings({
			wordLength: currentWordLength,
			wordMinFrequency: currentWordMinFrequency
		});

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

	/**
	 * Not currenly implemented because the Words API documentation is wrong and this
	 * option is broken.
	 */
	const buildWordMinFrequencyOptionButtons = () => {
		const wordMinFrequencyOptionButtons: JSX.Element[] = [];
		const options = [
			{ label: "Very rare", value: GameConstants.MinWordFrequency },
			{ label: "+", value: GameConstants.MinWordFrequency + 1 },
			{ label: "++", value: GameConstants.MinWordFrequency + 2 },
			{ label: "+++", value: GameConstants.DefaultMinWordFrequency },
			{ label: "++++", value: GameConstants.MaxWordFrequency - 2 },
			{ label: "Very common", value: GameConstants.MaxWordFrequency - 1 }
		];
		for (var option of options) {
			wordMinFrequencyOptionButtons.push(
				<ToggleButton
					id={`tbg-radio-${option.value}`}
					key={`btn-word-length-${option.value}`}
					value={option.value}
					variant="secondary"
					className={styles.frequencyOptionButton}
				>
					{option.label}
				</ToggleButton>
			);
		}

		return wordMinFrequencyOptionButtons;
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
					<div>
						<div>
							<div className={styles.settingBlock}>
								<h6>Word Length</h6>
								<div className={`${styles.settingDescription} text-muted`}>
									How many letters are in the word
								</div>
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
							{/* Unfortunately, the Words API has bad documentation, and this option doesn't actually work. */}
							{/* <div className={styles.settingBlock}>
								<h6>Minimum Word Frequency</h6>
								<div className={`${styles.settingDescription} text-muted`}>
									How commonly used the word is
								</div>
								<ToggleButtonGroup
									type="radio"
									name="frequencyOptions"
									defaultValue={currentWordMinFrequency}
									aria-label="Choose how common the word to guess is"
									onChange={handleWordMinFrequencyChange}
								>
									{buildWordMinFrequencyOptionButtons()}
								</ToggleButtonGroup>
							</div> */}
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