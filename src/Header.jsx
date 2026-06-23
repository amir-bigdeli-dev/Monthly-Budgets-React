import { useState } from "react";
import formatPrice from "./priceFormater.jsx";
import downArrow from "./assets/icons/down-arrow-1-svgrepo-com.svg";
import upArrow from "./assets/icons/down-arrow-1-svgrepo-com (1).svg";
import moneyIcon from "./assets/icons/icons8-money-25.png";
import TransactionsLog from "./TransactionsLog.jsx";

export default function Header({ data }) {
  const [showIncomesLog, setShowIncomesLog] = useState(null);

  const toggleLog = (type) => {
    setShowIncomesLog((current) => (current === type ? null : type));
  };

  return (
    <>
      <div className="Header">
        <div className="Header__total-money">
          <h2 className="Header__total-money-title">Total Money:</h2>
          <p className="Header__total-money-amount">{formatPrice(data.Money)}</p>
        </div>
        <div className="Header__stat">
          <div
            className="Header__stat-label Header__stat-label--incomes"
            onClick={() => setShowIncomesLog('Incomes')}
          >
            <h3 className="Header__stat-label-title">
              Incomes
              <img
                className="Header__stat-label-icon"
                src={downArrow}
                alt="down arrow"
              />
            </h3>
            {formatPrice(data.Incomes)}
          </div>
          <div className="Header__stat-label Header__stat-label--monBudget">
            <h3 className="Header__stat-label-title">
              Monthly Budget{" "}
              <img
                className="Header__stat-label-icon  Header__stat-label-icon-money"
                src={moneyIcon}
                alt="down arrow"
              />
            </h3>
            {formatPrice(data.MonthlyBudget)}
          </div>
          <div className="Header__stat-label Header__stat-label--expenses" onClick={() => setShowIncomesLog('Expenses')}>
            <h3 className="Header__stat-label-title">
              Expenses
              <img
                className="Header__stat-label-icon"
                src={upArrow}
                alt="down arrow"
              />
            </h3>
            {formatPrice(data.Expenses)}
          </div>
        </div>
      </div>
      {showIncomesLog ? <TransactionsLog action={showIncomesLog} status={(isOpen) => !isOpen && setShowIncomesLog(null)}/> : null}
    </>
  );
}
