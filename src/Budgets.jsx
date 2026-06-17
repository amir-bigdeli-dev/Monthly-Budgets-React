import { useState, useEffect, useContext } from "react";
import TransActionsContext from "./contexts.js";

export default function Budgets() {
  const { transactions } = useContext(TransActionsContext);
  const [budgets, setBudgets] = useState(transactions.Budgets);

    useEffect(() => {
        setBudgets(transactions.Budgets);
    },[transactions.Budgets])

    return (
    <div className="budgets">
      <h2 className="budgets__list-title">Budgets</h2>
      <ul className="budgets__list">
          {budgets.map((budget) => (
            <li key={budget.id} className="budgets__list-item">
              <div className="budgets__list-item-title">{budget.title}</div>
              <div className="budgets__list-item-amount">{budget.amount}</div>
            </li>
          ))}
      </ul>
    </div>
  );
}
