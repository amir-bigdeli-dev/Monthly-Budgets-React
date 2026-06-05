import { useState } from "react";
import addIcon from "./assets/icons/add-plus-svgrepo-com.svg"

export default function QuickAccess(){
    let [isOpen,setIsOpen]=useState(false);
    return(
        <div className="quick-access">
            <button className="quick-access__btn" onClick={() => setIsOpen(!isOpen)}>
                <img className="quick-access__btn-icon" src={addIcon} alt="add-icon" />
            </button>
        </div>
    )
}