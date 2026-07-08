import {useContext, useState} from "react";
import formatPrice from "./priceFormater.jsx";
import downArrow from "./assets/icons/down-arrow-1-svgrepo-com.svg";
import upArrow from "./assets/icons/down-arrow-1-svgrepo-com (1).svg";
import moneyIcon from "./assets/icons/wallet-wallet-svgrepo-com.svg";
import TransactionsLog from "./TransactionsLog.jsx";
import TransActionsContext from "./contexts.js";
import priceFormater from "./priceFormater.jsx";

export default function Header({ data , appRef }) {
  const [showIncomesLog, setShowIncomesLog ] = useState(null);
  const {TransactionsCalculator,isDesktop} = useContext(TransActionsContext)

  const toggleLog = (type) => {
    setShowIncomesLog((current) => (current === type ? null : type));
  };
  
  const MonthlyBudget = TransactionsCalculator.MonthlyBudget || 0;
  const Expenses = TransactionsCalculator.Expenses || 0;
  const RemainPercent = MonthlyBudget > 0 ? 100*((MonthlyBudget - Expenses) / MonthlyBudget) : 0;
  const RemainPercentFormatted = RemainPercent.toFixed(0) + "%";

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
          <div className="Header__stat-label Header__stat-label--monBudget" style={{'--monthly-progress-height': `${RemainPercentFormatted}`}} data-progress-text={RemainPercentFormatted} title={priceFormater(MonthlyBudget - TransactionsCalculator.Budgets)}>
            <h3 className="Header__stat-label-title">
              Monthly Budget{" "}
              <img
                className="Header__stat-label-icon  Header__stat-label-icon-money"
                src={moneyIcon}
                alt="down arrow"
              />
            </h3>
            <h4>{formatPrice(data.MonthlyBudget)}</h4>
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
      {showIncomesLog && !isDesktop ? <TransactionsLog action={showIncomesLog} status={(isOpen) => !isOpen && setShowIncomesLog(null)} appRef={appRef}/> : null}
    </>
  );
}
