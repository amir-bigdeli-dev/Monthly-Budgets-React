import { useState, useRef } from "react";

export default function useTitleTooltip() {
    const [titleToolTip, setTitleToolTip] = useState(null);
    const titleTimerRef = useRef(null);

    function ShowFullTitle(title, e) {
        e.stopPropagation();
        if (titleTimerRef.current) {
            clearTimeout(titleTimerRef.current);
            titleTimerRef.current = null;
        }
        const element = e.currentTarget;
        if (element.scrollWidth <= element.clientWidth) return;
        setTitleToolTip(title);
        titleTimerRef.current = setTimeout(() => {
            setTitleToolTip(null);
        }, 3000);
    }

    return { titleToolTip, ShowFullTitle };
}