import React from 'react';
import { Button, Container, Nav, Navbar } from 'react-bootstrap';
import HowToPlay from './HowToPlay';
import Settings from './Settings';

import './MainNavbar.scss';

export default function MainNavbar() {
    const [showHelpMenu, setHelpMenuShow] = React.useState(false);
    const [showSettingsMenu, setSettingsMenuShow] = React.useState(false);

    const handleHelpMenuClose = () => setHelpMenuShow(false);
    const handleHelpMenuShow = () => setHelpMenuShow(true);

    const handleSettingsMenuClose = () => setSettingsMenuShow(false);
    const handleSettingsMenuShow = () => setSettingsMenuShow(true);

    return (
        <>
            <Navbar bg="dark" variant="dark" key="main-navbar" expand={false} className="mb-3 px-2">
                <Container fluid>
                    <Navbar.Brand href="#">Word Guesser</Navbar.Brand>
                    <Nav className="flex-row justify-content-end flex-grow-1">
                        <Nav.Item aria-controls={'offcanvasNavbar-expand-how-to-play'}>
                            <Button variant="outline-secondary" className="me-3 navbar-toggler navbar-toggle-how-to-play" onClick={handleHelpMenuShow}>
                                <i className="bi bi-question-circle"></i>
                            </Button>
                        </Nav.Item>
                        <Nav.Item aria-controls={'offcanvasNavbar-expand-settings'}>
                            <Button variant="outline-secondary" className="me-0 navbar-toggler navbar-toggle-settings" onClick={handleSettingsMenuShow}>
                                <i className="bi bi-gear"></i>
                            </Button>
                        </Nav.Item>
                    </Nav>
                </Container>
            </Navbar>
            <HowToPlay show={showHelpMenu} onHide={handleHelpMenuClose}></HowToPlay>
            <Settings show={showSettingsMenu} onHide={handleSettingsMenuClose}></Settings>
        </>
    )
}