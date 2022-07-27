import React from 'react';
import { Button, Container, Image, Modal, Nav, Navbar } from 'react-bootstrap';
import HowToPlayMenu from './HowToPlayMenu';
import SettingsMenu from './Settings/SettingsMenu';
import IHints from '../interfaces/IHints';
import HintsMenu from './HintsMenu';
import { useRouter } from 'next/router';
import { GameState } from '../constants/GameState';
import ResetGameConfirmationModal from './ResetGameConfirmationModal';

import styles from './MainNavbar.module.scss';

interface IMainNavbarProps {
    word?: string[];
    hints?: IHints;
    currentGameState: number;
    setFocusOnGameBoard: () => void;
    loseFocusOnGameBoard: () => void;
}

export default function MainNavbar(props: IMainNavbarProps) {
    const [showHelpMenu, setHelpMenuShow] = React.useState(false);
    const [showHintsMenu, setHintsMenuShow] = React.useState(false);
    const [showSettingsMenu, setSettingsMenuShow] = React.useState(false);
    const [showNewGameConfirmationModal, setShowNewGameConfirmationModal] = React.useState(false);

	/**
	 * Router is used here to force NextJS to reload a new word on the server-
	 * side using getServerSideProps, which only runs once per request.
	 * By artificially changing the route, we can force it to load a new word
	 * on-demand.
	 */
	const router = useRouter();

    const handleHelpMenuShow = () => {
        setHelpMenuShow(true);
        props.loseFocusOnGameBoard();
    }

    const handleHelpMenuClose = () => {
        setHelpMenuShow(false);
        props.setFocusOnGameBoard();
    }

    const handleHintsMenuShow = () => {
        setHintsMenuShow(true);
        props.loseFocusOnGameBoard();
    }

    const handleHintsMenuClose = () => {
        setHintsMenuShow(false);
        props.setFocusOnGameBoard();
    }

    const handleSettingsMenuShow = () => {
        setSettingsMenuShow(true);
        props.loseFocusOnGameBoard();
    }
    
    const handleSettingsMenuClose = () => {
        setSettingsMenuShow(false);
        props.setFocusOnGameBoard();
    }

    const handleShowNewGameConfirmationModal = () => {
        setShowNewGameConfirmationModal(true);
        props.loseFocusOnGameBoard();
    }

    const handleCloseNewGameConfirmationModal = () => {
        setShowNewGameConfirmationModal(false);
        props.setFocusOnGameBoard();
    }

	const handleNewGameButtonClick = (e: React.MouseEvent) => {
		// If there's a chance the player might lose progress because the game
		// is still unfinished, prompt before we reset the game.
		if (props.currentGameState === GameState.Playing) {
			setShowNewGameConfirmationModal(true);
		} else {
            // Force the focus off of the "New Game" button.
			// Simply calling .focus() on the game boards isn't enough on its
			// own to make this stubborn button lose focus, so .blur() is also
			// necessary.
			(e.target as HTMLElement).parentElement?.blur();
			
            handleResetGame();
		}
	};

	const handleResetGame = () => {
		setShowNewGameConfirmationModal(false);
        props.setFocusOnGameBoard();
		router.replace(router.asPath);
    };

    return (
        <>
            <Navbar bg="dark" variant="dark" key="main-navbar" expand={false} className="mb-3 px-2">
                <Container fluid className="p-0 px-sm-2">
                    <Nav className="flex-row justify-content-start flex-grow-1">
                        <Nav.Item aria-controls={'offcanvasNavbar-expand-hints'}>
                            <Button
                                variant="outline-secondary"
                                className={`me-1 ${styles.navbarToggler}`}
                                title="Hints"
                                onClick={handleHintsMenuShow}
                            >
                                <i className="bi bi-lightbulb"></i>
                            </Button>
                        </Nav.Item>
                        <Nav.Item aria-controls={'offcanvasNavbar-expand-hints'}>
                            <Button
                                variant="outline-secondary"
                                className={`me-1 ${styles.navbarToggler}`}
                                type="reset"
                                title="New Game"
                                onClick={handleNewGameButtonClick}
                            >
                                <i className="bi bi-plus-circle"></i>
                            </Button>
                        </Nav.Item>
                    </Nav>
                    <Navbar.Brand href="#" className="me-0 py-0">
                        Word{' '}
                        <Image
                            alt="Word Guesser Logo"
                            src="/logo192.png"
                            width="30"
                            height="30"
                            className="align-text-bottom"
                            />
                        {' '}Guesser
                    </Navbar.Brand>
                    <Nav className="flex-row justify-content-end flex-grow-1">
                        <Nav.Item aria-controls={'offcanvasNavbar-expand-how-to-play'}>
                            <Button
                                variant="outline-secondary"
                                className={`me-1 ${styles.navbarToggler}`}
                                title="How To Play"
                                onClick={handleHelpMenuShow}
                            >
                                <i className="bi bi-question-circle"></i>
                            </Button>
                        </Nav.Item>
                        <Nav.Item aria-controls={'offcanvasNavbar-expand-settings'}>
                            <Button
                                variant="outline-secondary"
                                className={`me-0 ${styles.navbarToggler}`}
                                title="Settings"
                                onClick={handleSettingsMenuShow}
                            >
                                <i className="bi bi-gear"></i>
                            </Button>
                        </Nav.Item>
                    </Nav>
                </Container>
            </Navbar>
            <HowToPlayMenu
                isShown={showHelpMenu}
                onShow={handleHelpMenuShow}
                onHide={handleHelpMenuClose}
            />
            <SettingsMenu
                isShown={showSettingsMenu}
                onShow={handleSettingsMenuShow}
                onHide={handleSettingsMenuClose}
                setFocusOnGameBoard={props.setFocusOnGameBoard}
                loseFocusOnGameBoard={props.loseFocusOnGameBoard}
                onConfirmResetGame={handleResetGame}
            />
            <HintsMenu
                isShown={showHintsMenu}
                word={props.word}
                hints={props.hints}
                onShow={handleHintsMenuShow}
                onHide={handleHintsMenuClose}
            />
            <ResetGameConfirmationModal
                isShown={showNewGameConfirmationModal}
                onShow={handleShowNewGameConfirmationModal}
                onHide={handleCloseNewGameConfirmationModal}
                onConfirmResetGame={handleResetGame}
            />
        </>
    )
}