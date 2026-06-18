import formatPrice from "./priceFormater.jsx";
import downArrow from "./assets/icons/down-arrow-1-svgrepo-com.svg";
import upArrow from "./assets/icons/down-arrow-1-svgrepo-com (1).svg";
import moneyIcon from "./assets/icons/icons8-money-25.png";

export default function Header({ data }) {
  return (
    <div className="Header">
      <div className="Header__total-money">
        <h2 className="Header__total-money-title">Total Money:</h2>
        <p className="Header__total-money-amount">{formatPrice(data.Money)}</p>
      </div>
      <div className="Header__stat">
        <div className="Header__stat-label Header__stat-label--incomes">
          <h3 className="Header__stat-label-title">
            Incomes{" "}
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
        <div className="Header__stat-label Header__stat-label--expenses">
          <h3 className="Header__stat-label-title">
            Expense{" "}
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
  );
}
