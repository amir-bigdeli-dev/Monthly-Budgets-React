import formatPrice from "./priceFormater.jsx";
export default function Header({stat}) {
    return(
        <div className="Header">
            <div className="Header__total-money">
                <h2 className="Header__total-money-title">Total Money:</h2>
                <p className="Header__total-money-amount">{formatPrice(stat.total)}</p>
            </div>
            <div className="Header__stat">
                <div className="Header__stat-label Header__stat-label--incomes"><h3 className="Header__stat-label--icon">Incomes</h3>{formatPrice(stat.income)}</div>
                <div className="Header__stat-label Header__stat-label--monBudget"><h3 className="Header__stat-label--icon">Monthly Budget</h3>{formatPrice(stat.monBudget)}</div>
                <div className="Header__stat-label Header__stat-label--expenses"><h3 className="Header__stat-label--icon">Expense</h3>{formatPrice(stat.expenses)}</div>
            </div>
        </div>
    )
}