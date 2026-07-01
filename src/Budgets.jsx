import {useState,useEffect,useContext,useRef} from "react";
import TransActionsContext from "./contexts.js";
import priceFormater from "./priceFormater.jsx";
import BudgetsRightArrowIcon from "./assets/icons/right-arrow-backup-2-svgrepo-com.svg";
import TrashIcon from "./assets/icons/trash-bin-trash-svgrepo-com.svg";
import EditIcon from "./assets/icons/edit-3-svgrepo-com (1).svg";
import RedTrashIcon from "./assets/icons/red-trash-bin.svg";
import TransactionForm from "./TransactionForm.jsx";
import useTitleTooltip from "./useTitleTooltip.js";

export default function Budgets() {
    const {transactions,removeItems} = useContext(TransActionsContext);
    const [budgets, setBudgets] = useState(transactions.Budgets);
    const { titleToolTip, ShowFullTitle } = useTitleTooltip();
    const [expensesShow,setExpensesShow] = useState(null);
    const [itemToRemove,setItemToRemove] = useState(null);
    const [itemToEdit,setItemToEdit] = useState(null)


    const budgetsAmountNum = (item) => (Number(item.replace(/[^0-9]/g,"")))

    const BudgetRemainCal = ({category,amount}) => {
        const expenses = transactions.Expenses
            .filter(expense => expense.category === category)
            .reduce((acc, expense) => acc + (budgetsAmountNum(expense.amount) || 0), 0);

        return (budgetsAmountNum(amount) - expenses)
    };

 
    function ShowExpenses(category) {
        setExpensesShow(expensesShow === category ? null : category)
    }
    useEffect(() => {
        setBudgets(transactions.Budgets);
    },[transactions.Budgets])

    function ItemRemove(Id,type,e) {
        e.stopPropagation()
        setItemToRemove({Id , type})
    }

    function ConfirmItemRemove(expenseToRemove,e) {
        e.stopPropagation()
        removeItems(expenseToRemove)
        setItemToRemove(null)
    }
  return (
    <div className="budgets">
        {itemToEdit ? <TransactionForm formType="Budgets" onClose={() => setItemToEdit(null)} ItemValues={itemToEdit}/> : null}
        {itemToRemove ? <div className="expenseToRemoveAlert" onClick={(e) => e.stopPropagation()}>
            <p>Are you sure you want to delete this expense?</p>
            <div className="expenseToRemoveAlert__actions">
                <button className="expenseToRemoveAlert__actions-confirm" onClick={(e) => ConfirmItemRemove(itemToRemove,e)}>Confirm</button>
                <button className="expenseToRemoveAlert__actions-cancel" onClick={() => setItemToRemove(null)}>Cancel</button>
            </div>
        </div> : null}
      <h2 className="budgets__list-title">Budgets</h2>
      <ul className="budgets__list">
          {budgets.map((item,index) => (
              <div className="list-items-container" key={item.id}>
              <li onClick={() => ShowExpenses(item.category)} className={`budgets__list-item ${titleToolTip === item.id ? "list-item__title-tooltip" : ""}`} data-full-title={item.category}  key={item.id} style={{"--background-color":item.color, "--remain-percent":`${(BudgetRemainCal(item) * 100 ) / budgetsAmountNum(item.amount)}%`}}>
                  <span className="list-item__counter">{index + 1}</span>
                  <h3 className={`list-item__title`}  onClick={(e) => ShowFullTitle(item.id,e)} title={item.category}>{item.category}</h3>
                  <span className="list-item__percent">{item.percent}</span>
                  <span className="list-item__amount">{priceFormater(budgetsAmountNum(item.amount))}</span>
                  <span className={`list-item__remain ${BudgetRemainCal(item) < 0 ? "list-item__remain--overFlow" : ""}`}>{BudgetRemainCal(item)}</span>
                  <span className="list-item__arrow"><img src={BudgetsRightArrowIcon} alt="right-arrow"/></span>
              </li>
                  {expensesShow === item.category && <div className="list-item__expenses">
                      <div className="budget-actions">
                          <span className="budget-actions__edit" onClick={() => setItemToEdit(item)}>edit<img src={EditIcon} alt="edit-icon"/></span>
                          <span className="budget-actions__delete" onClick={(e) => ItemRemove(item.id,"Budgets",e)}>delete<img src={RedTrashIcon} alt="trash-icon"/></span>
                      </div>
                      {transactions.Expenses.filter(expense => expense.category === item.category).length === 0 ? <p className="no-expenses">No expenses for this budget yet.</p> :
                  <ul className="items-container__expenses-list">
                        {transactions.Expenses.filter(expense => expense.category === item.category).map((expense,index) => (
                            <li key={expense.id} className={`expenses-list__item ${titleToolTip === expense.id ? "expenses-item__title-tooltip" : ""}`} data-full-title={expense.title}>
                                <span className="expenses-list-item-counter">{index + 1}</span>
                                <h3 className={`expenses-list-item__title`} onClick={(e) => ShowFullTitle(expense.id,e)}>{expense.title}</h3>
                                <span className="expenses-list-item__date">{expense.date}</span>
                                <span className="list-item__amount">{priceFormater(budgetsAmountNum(expense.amount))}</span>
                                <span className="expenses-list-item__trash" onClick={(e) => {ItemRemove(expense.id,"Expenses",e)}}><img src={TrashIcon} alt="trash"/></span>
                            </li>
                        ))}
                  </ul>
                      }
                  </div>}
              </div>
          ))}
      </ul>
    </div>
  );
}
