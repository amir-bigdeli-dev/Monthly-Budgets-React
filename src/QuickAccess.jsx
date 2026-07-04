import { useState, useEffect, useRef ,useContext } from "react";
import addIcon from "./assets/icons/add-plus-svgrepo-com.svg";
import closeIcon from "./assets/icons/close-sm-svgrepo-com.svg";
import incomesIcon from "./assets/icons/down-arrow-1-svgrepo-com.svg?react";
import expensesIcon from "./assets/icons/down-arrow-1-svgrepo-com (1).svg?react";
import moneyIcon from "./assets/icons/wallet-wallet-svgrepo-com.svg?react";
import budgetsIcon from "./assets/icons/budget-cost-svgrepo-com.svg?react";
import monthlyBudgetIcon from "./assets/icons/icons8-calendar(2).svg?react";
import historyIcon from "./assets/icons/history-svgrepo-com.svg?react"
import TransActionsContext from "./contexts.js";


export default function QuickAccess({onSelect, type_label , desktopMode }) {
  let [isOpen, setIsOpen] = useState(false);
  const actions = ["Incomes", "Money", "Expenses", "Budgets", "MonthlyBudget","Transactions"];
  const {transactions} = useContext(TransActionsContext);
  const [DisabledAlert, setDisabledAlert] = useState("");
  const DisableAlertRef = useRef("")

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
    if(desktopMode) return ;
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
  
  function isActionDisabled(type) {
    if(type === "Money" || type === "Transactions") return true;
    const hasMoney = transactions.Money.length > 0;
    const hasMonthlyBudget = transactions.MonthlyBudget.length > 0;
    
    if(!hasMoney) return false;
    if(type === "Budgets") return hasMonthlyBudget;

    return true;

  }
  
  function DisabledItemsAlert(type){
    const hasMoney = transactions.Money.length > 0;
    if(!hasMoney) setDisabledAlert("Please enter the Money amount first!")
    if(type === "Budgets") setDisabledAlert("Please define Monthly Budget amount first!")

    if(DisableAlertRef.current){
      clearTimeout(DisableAlertRef.current)
    }
    DisableAlertRef.current = setTimeout(() => {
        setDisabledAlert("")
    },3000)
  }
  if (desktopMode) {
   return (
       <div className="quick-access" ref={quickAccessRef}>
         {DisabledAlert ?
             <div className="errorAlert errorAlert__quickAccess">{DisabledAlert}</div>
             :null
         }
             <ul className="quick-access__list">
               {actions.map((type) =>{
                 const Icon = iconMap[type];
                 const isSVG = typeof Icon === "function"
                 const isDisabled = isActionDisabled(type);
                 return(
                     <li
                         key={type}
                         className={`quick-access__list-item ${!isDisabled ? "quick-access__list-item--disabled" : ""}`}
                         onClick={isDisabled ? () => {
                           setIsOpen(false);
                           onSelect(type);
                         } : () => DisabledItemsAlert(type)}
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
                       <span className="quick-access__list-item-text">
              {type_label[type]}
            </span>
                     </li>
                 )})}
             </ul>
         {!desktopMode ? <button
             className={`quick-access__btn quick-access__btn${isOpen ? "--isOpen" : ""}`}
             onClick={!desktopMode ? () => setIsOpen(!isOpen) : null}
         >
           <img
               className="quick-access__btn-icon"
               src={`${isOpen ? closeIcon : addIcon}`}
               alt="quick-access-icon"
           />
         </button> : null}
       </div>
   )
  }
  return (
    <div className="quick-access" ref={quickAccessRef}>
      {DisabledAlert ?
       <div className="errorAlert errorAlert__quickAccess">{DisabledAlert}</div>
          :null
      }
      {isOpen ? (
        <ul className="quick-access__list">
          {actions.map((type) =>{ 
            const Icon = iconMap[type];
            const isSVG = typeof Icon === "function"
            const isDisabled = isActionDisabled(type);
            return(
            <li
              key={type}
              className={`quick-access__list-item ${!isDisabled ? "quick-access__list-item--disabled" : ""}`}
              onClick={isDisabled ? () => {
                setIsOpen(false);
                onSelect(type);
              } : () => DisabledItemsAlert(type)}
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
        onClick={!desktopMode ? () => setIsOpen(!isOpen) : null}
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
