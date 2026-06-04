import formatPrice from "./priceFormater.jsx";
import downArrow from "./assets/icons/down-arrow-1-svgrepo-com.svg";

export default function Header({ stat }) {
  return (
    <div className="Header">
      <div className="Header__total-money">
        <h2 className="Header__total-money-title">Total Money:</h2>
        <p className="Header__total-money-amount">{formatPrice(stat.total)}</p>
      </div>
      <div className="Header__stat">
        <div className="Header__stat-label Header__stat-label--incomes">
          <h3 className="Header__stat-label-title">Incomes <img className="Header__stat-label-icon" src={downArrow} alt="down arrow"/></h3>
          {formatPrice(stat.income)}
        </div>
        <div className="Header__stat-label Header__stat-label--monBudget">
          <h3 className="Header__stat-label-title">Monthly Budget</h3>
          {formatPrice(stat.monBudget)}
        </div>
        <div className="Header__stat-label Header__stat-label--expenses">
          <h3 className="Header__stat-label-title">Expense</h3>
          {formatPrice(stat.expenses)}
        </div>
      </div>
    </div>
  );
}
