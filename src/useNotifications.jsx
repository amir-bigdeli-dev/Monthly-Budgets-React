import { useState, useRef , } from "react";
import {createPortal} from "react-dom";
import ErrorIcon from "./assets/icons/icons8-error.svg"
import SuccessIcon from "./assets/icons/icons8-success.svg"
import WarningIcon from "./assets/icons/icons8-error(1).svg"
import InfoIcon from "./assets/icons/icons8-info.svg"

const iconMap = {
    error: ErrorIcon,
    success: SuccessIcon,
    warning: WarningIcon,
    info: InfoIcon
}
export default function useNotification() {
    const [notification, setNotification] = useState(null);
    const timerRef = useRef(null);

    function notify(message, type = "error", duration = 3000) {
        if(timerRef.current) clearTimeout(timerRef.current);

        setNotification({ message, type });

        timerRef.current = setTimeout(() => {
            setNotification(null);
        }, duration);
    }
    
    const notificationUI = notification ? createPortal(
        (<div className={`notification notification--${notification.type} `}>
            <img src={iconMap[notification.type]} alt="error icon" className="notification__icon" />
            {notification.message}
        </div>),document.body
    ):null

    return { notificationUI , notify};
}