import React from "react";
import { Offcanvas } from "react-bootstrap";

interface ISettingsProps {
    isShown: boolean;
    onShow: () => void;
    onHide: () => void;
}

export default function SettingsMenu(props: ISettingsProps) {
	
    return (
        <Offcanvas
            show={props.isShown}
            onShow={props.onShow}
            onHide={props.onHide}
            id={'offcanvasNavbar-expand-settings'}
            aria-labelledby={'offcanvasNavbarLabel-expand-settings'}
            placement="end"
            restoreFocus={false}
            className="offcanvas-lg"
        >
            <Offcanvas.Header closeButton>
                <Offcanvas.Title id={'offcanvasNavbarLabel-expand-settings'}>
                    Settings
                </Offcanvas.Title>
            </Offcanvas.Header>
            <Offcanvas.Body>
            <div>
                    Not yet implemented. Check back later! :D
                </div>
            </Offcanvas.Body>
        </Offcanvas>
    )
}