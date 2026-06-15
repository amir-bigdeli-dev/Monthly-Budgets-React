import { useState, useEffect, useRef } from "react";
import addIcon from "./assets/icons/add-plus-svgrepo-com.svg";
import closeIcon from "./assets/icons/close-sm-svgrepo-com.svg";
import incomesIcon from "./assets/icons/down-arrow-1-svgrepo-com.svg";
import expensesIcon from "./assets/icons/down-arrow-1-svgrepo-com (1).svg";
import moneyIcon from "./assets/icons/icons8-money-25.png";
import budgetsIcon from "./assets/icons/budget-cost-svgrepo-com.svg";

export default function QuickAccess({ types, onSelect }) {
  let [isOpen, setIsOpen] = useState(false);

  const iconMap = {
    Incomes: incomesIcon,
    Expenses: expensesIcon,
    Budgets: budgetsIcon,
    Money: moneyIcon,
  };
  const quickAccessRef = useRef(null);
  useEffect(() => {
    function closeQuickAccess(e) {
      if (
        quickAccessRef.current &&
        !quickAccessRef.current.contains(e.target)
      ) {
        setIsOpen(false);
      }
    }

    document.addEventListener("mousedown", closeQuickAccess);
    return () => {
      document.removeEventListener("mousedown", closeQuickAccess);
    };
  }, []);

  return (
    <div className="quick-access" ref={quickAccessRef}>
      {isOpen ? (
        <ul className="quick-access__list">
          {types.map((type) => (
            <li
              key={type}
              className="quick-access__list-item"
              onClick={() => {
                setIsOpen(false);
                onSelect(type);
              }}
            >
              <img
                className="quick-access__list-item-icon"
                src={iconMap[type]}
                alt={`${type}Icon`}
              />
              {type}
            </li>
          ))}
        </ul>
      ) : null}
      <button
        className={`quick-access__btn quick-access__btn${isOpen ? "--isOpen" : ""}`}
        onClick={() => setIsOpen(!isOpen)}
      >
        <img
          className="quick-access__btn-icon"
          src={`${isOpen ? closeIcon : addIcon}`}
          alt="quick-access-icon"
        />
      </button>
    </div>
  );
}
