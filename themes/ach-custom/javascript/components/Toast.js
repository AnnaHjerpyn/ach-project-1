import React, {useState} from 'react';
import { Toast } from "react-bootstrap";

const ToastMessage = ({ message }) => {
    const [show, toggleShow] = useState(true);

    return (
        <>
            {!show && <Button onClick={() => toggleShow(true)}>Show Toast</Button>}
            <Toast show={show} onClose={() => toggleShow(false)}>
                <Toast.Body>
                   <strong>{message}</strong>
                </Toast.Body>
            </Toast>
        </>
    );
};

export default ToastMessage
