import {useState, useRef, useEffect, useContext} from "react";
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
export default function useNotification(isDesktop) {
    const [notification, setNotification] = useState(null);
    const timerRef = useRef(null);
    const notificationRef = useRef(null)
    useEffect(() => {
        if (notification && notificationRef.current) {
            notificationRef.current.scrollIntoView({ behavior: "smooth", block: "center" });
        }
    }, [notification]);

    function notify(message, type = "error", duration = 3000,Ref) {
        if(timerRef.current) clearTimeout(timerRef.current);
        setNotification({ message, type , Ref});

        timerRef.current = setTimeout(() => {
            setNotification(null);
        }, duration);
    }
    
    const notificationUI = notification ? createPortal(
        (<div className={`notification notification--${notification.type}  notification${notification.Ref && !isDesktop ? '--form' : ''}`}>
            <img src={iconMap[notification.type]} alt="error icon" className="notification__icon" />
            {notification.message}
        </div>),!isDesktop && notification.Ref || document.body
    ):null

    return { notificationUI , notify};
}