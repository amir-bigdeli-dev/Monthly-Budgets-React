import { useState, useEffect, useRef } from "react";
import addIcon from "./assets/icons/add-plus-svgrepo-com.svg";
import closeIcon from "./assets/icons/close-sm-svgrepo-com.svg";
import incomesIcon from "./assets/icons/down-arrow-1-svgrepo-com.svg?react";
import expensesIcon from "./assets/icons/down-arrow-1-svgrepo-com (1).svg?react";
import moneyIcon from "./assets/icons/wallet-wallet-svgrepo-com.svg?react";
import budgetsIcon from "./assets/icons/budget-cost-svgrepo-com.svg?react";
import monthlyBudgetIcon from "./assets/icons/monthly-budget-icon.png";
import historyIcon from "./assets/icons/history-svgrepo-com.svg?react"

export default function QuickAccess({onSelect, type_label }) {
  let [isOpen, setIsOpen] = useState(false);
  const actions = ["Incomes", "Money", "Expenses", "Budgets", "MonthlyBudget","Transactions"];

  const iconMap = {
    Incomes: incomesIcon,
    Expenses: expensesIcon,
    Budgets: budgetsIcon,
    Money: moneyIcon,
    MonthlyBudget: monthlyBudgetIcon,
    Transactions: historyIcon
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
          {actions.map((type) =>{ 
            const Icon = iconMap[type];
            const isSVG = typeof Icon === "function"
            return(
            <li
              key={type}
              className="quick-access__list-item"
              onClick={() => {
                setIsOpen(false);
                onSelect(type);
              }}
            >
              {isSVG ? (
                  <Icon className="quick-access__list-item-icon" />
              ):
              <img
                className="quick-access__list-item-icon"
                src={iconMap[type]}
                alt={`${type}Icon`}
              />
              }
              {type_label[type]}
            </li>
          )})}
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
