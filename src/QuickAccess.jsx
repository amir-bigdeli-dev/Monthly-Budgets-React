import { useState } from "react";
import addIcon from "./assets/icons/add-plus-svgrepo-com.svg"
import closeIcon from "./assets/icons/close-sm-svgrepo-com.svg"

export default function QuickAccess({types}){
    let [isOpen,setIsOpen]=useState(false);
    return(
        <div className="quick-access">
            <ul className="quick-access__list">
                {types.map((type) => (
                    <li key={type} className="quick-access__list-item">{type}</li>
                ))}
            </ul>
            <button className={`quick-access__btn quick-access__btn${isOpen ? '--isOpen' : ''}`} onClick={() => setIsOpen(!isOpen)}>
                <img className="quick-access__btn-icon" src={`${isOpen ? closeIcon : addIcon}`} alt="quick-access-icon" />
            </button>
        </div>
    )
}