import {useState,useEffect,useContext,useRef} from "react";
import TransActionsContext from "./contexts.js";
import priceFormater from "./priceFormater.jsx";
import BudgetsRightArrowIcon from "./assets/icons/right-arrow-backup-2-svgrepo-com.svg";

export default function Budgets() {
    const {TransactionsCalculator,transactions} = useContext(TransActionsContext);
    const [budgets, setBudgets] = useState(transactions.Budgets);
    const [titleToolTip,setTitleToolTip] = useState(null)

    const budgetsAmountNum = (item) => (Number(item.replace(/[^0-9]/g,"")))

    const BudgetRemainCal = ({category,amount}) => {
        const expenses = transactions.Expenses
            .filter(expense => expense.category === category)
            .reduce((acc, expense) => acc + (budgetsAmountNum(expense.amount) || 0), 0);

        return (budgetsAmountNum(amount) - expenses)
    };

    const titleTimerRef = useRef(null)
    function ShowFullTitle(title,e) {
        if(titleTimerRef.current) {
            clearTimeout(titleTimerRef.current)
            titleTimerRef.current = null
        }
        const element = e.currentTarget
        if(element.scrollWidth <= element.clientWidth) return;
        setTitleToolTip(title)
        titleTimerRef.current = setTimeout(() => {
            setTitleToolTip(null)
        },3000)
    }
    useEffect(() => {
        setBudgets(transactions.Budgets);
    },[transactions.Budgets])
    
  return (
    <div className="budgets">
      <h2 className="budgets__list-title">Budgets</h2>
      <ul className="budgets__list">
          {budgets.map((item,index) => (
              <li className={`budgets__list-item ${titleToolTip === item.id ? "list-item__title-tooltip" : ""}`} data-full-title={item.category}  key={item.id} style={{"--background-color":item.color, "--remain-percent":`${(BudgetRemainCal(item) * 100 ) / budgetsAmountNum(item.amount)}%`}}>
                  <span className="list-item__counter">{index + 1}</span>
                  <h3 className={`list-item__title`}  onClick={(e) => ShowFullTitle(item.id,e)} title={item.category}>{item.category}</h3>
                  <span className="list-item__percent">{item.percent}</span>
                  <span className="list-item__amount">{priceFormater(budgetsAmountNum(item.amount))}</span>
                  <span className={`list-item__remain ${BudgetRemainCal(item) < 0 ? "list-item__remain--overFlow" : ""}`}>{BudgetRemainCal(item)}</span>
                  <span className="list-item__arrow"><img src={BudgetsRightArrowIcon} alt="right-arrow"/></span>
              </li>
          ))}
      </ul>
    </div>
  );
}
