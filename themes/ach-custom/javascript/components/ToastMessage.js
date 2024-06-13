import React, {useState, useEffect} from 'react';
import {Toast, Button} from 'react-bootstrap';
import '../../css/src/Components/_toast.scss';

const ToastMessage = ({message, duration = 3000}) => {
    const [show, toggleShow] = useState(true);

    useEffect(() => {
        if (show) {
            const timer = setTimeout(() => {
                toggleShow(false);
            }, duration);
            return () => clearTimeout(timer);
        }
    }, [show, duration]);

    return (
        <>
            <div className="custom-toast-container">
                <Toast
                    className="custom-toast"
                    show={show}
                    onClose={() => toggleShow(false)}
                >
                    <Toast.Body>
                        <strong>{message}</strong>
                    </Toast.Body>
                </Toast>
            </div>
        </>
    );
};

export default ToastMessage;
