import {useState,useEffect,useContext} from "react";
import TransActionsContext from "./contexts.js";

export default function Budgets() {
    const {TransactionsCalculator,transactions} = useContext(TransActionsContext);
    const [budgets, setBudgets] = useState(transactions.Budgets);
    
    useEffect(() => {
        setBudgets(transactions.Budgets);
    },[transactions.Budgets])
  return (
    <div className="budgets">
      <h2 className="budgets__list-title">Budgets</h2>
      <ul className="budgets__list">
          {budgets.map((item,index) => (
              <li className="budgets__list-item" key={item.id}>
                  <span className="list-item__counter">{index + 1}</span>
                  <h3 className="list-item__title">{item.category}</h3>
                  <span className="list-item__percent">{20}</span>
                  <span className="list-item__amount">{item.amount}</span>
                  <span className="list-item__remain">{item.amount}</span>
              </li>
          ))}
      </ul>
    </div>
  );
}
