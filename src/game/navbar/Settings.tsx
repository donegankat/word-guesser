import { Offcanvas } from "react-bootstrap";

interface ISettingsProps {
    show: boolean;
    onHide: () => void;
}

export default function Settings(props: ISettingsProps) {
    return (
        <Offcanvas
            show={props.show}
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