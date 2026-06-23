import priceFormater from "./priceFormater.jsx";
import TrashIcon from "./assets/icons/trash-bin-trash-svgrepo-com.svg";
import {createPortal} from "react-dom";
import {useRef,useEffect, useState ,useContext} from "react";
import Select from "react-select";
import closeIcon from "./assets/icons/close-sm-svgrepo-com.svg"
import TransActionsContext from "./contexts.js";
import sortItems from "./sort_Items.js";
import TransactionForm from "./TransactionForm.jsx";


export default function TransactionsLog({transactions , status}){
    const sortOptions = ["Date", "Amount", "Category"];
    const [action,setAction] = useState('Expenses')
    const budgetsAmountNum = (item) => (Number(item.replace(/[^0-9]/g,"")));
    const { removeItems } = useContext(TransActionsContext)
    const [itemToRemove,setItemToRemove] = useState(null);
    const [sortBy,setSortBy] = useState("date");


    const LogRef = useRef(null)

    useEffect(() => {
        function closeLog(e) {
            if(LogRef.current && !LogRef.current.contains(e.target)) {
                status()
            }
        }

        document.addEventListener("mousedown", closeLog)
        document.addEventListener("touchcancel", closeLog)

        return() => {
            document.removeEventListener("mousedown", closeLog)
            document.removeEventListener("touchcancel", closeLog)
        }
    },[status])
    return createPortal(
        <div className="transactionsLog" ref={LogRef}>
            {itemToRemove ? <div className="expenseToRemoveAlert" onClick={(e) => e.stopPropagation()}>
                <p>Are you sure you want to delete this expense?</p>
                <div className="expenseToRemoveAlert__actions">
                    <button className="expenseToRemoveAlert__actions-confirm" onClick={(e) => {removeItems(itemToRemove);setItemToRemove(null)}}>Confirm</button>
                    <button className="expenseToRemoveAlert__actions-cancel" onClick={() => setItemToRemove(null)}>Cancel</button>
                </div>
                </div> : null}
            <span className="transactionsLog__close" onClick={() => {status()}}><img className="actionsForm__close-icon" src={closeIcon} alt="close-icon"/></span>
            <h2 className="transactionsLog__title">Transactions Log</h2>
            <div className="transactionsLog__actionBar">
                <span onClick={() => setAction('Incomes')} className={`charts__type-label ${action === "Incomes" ? 'charts__type-label charts__type-label--incomes-active':""}`}>Incomes</span>
                <span onClick={() => setAction('Expenses')} className={`charts__type-label ${action === "Expenses" ? 'charts__type-label charts__type-label--expenses-active':""}`}>Expenses</span>
                <Select
                    onChange={(selectedOption) => setSortBy(selectedOption.value)}
                    defaultValue={{ value: 'Date', label: 'Date' }}
                    id="transactionsLog__actionBar-sortby"
                    options={sortOptions.map(v => ({ value: v, label: v }))}
                    styles={{
                        control: (base) => ({
                            ...base,
                            borderRadius: "0.5rem",
                            padding: "0.2rem",
                            minHeight: "2rem",
                            height: "2rem",
                        }),
                        menu: (base) => ({
                            ...base,
                            borderRadius: "0.5rem",
                        }),
                        option: (base, state) => ({
                            ...base,
                            backgroundColor: state.isSelected
                                ? "#908af6"
                                : state.isFocused
                                    ? "#e8e7ff"
                                    : "white",
                            color: state.isSelected ? "white" : "black",
                            borderRadius: "0.5rem",
                            textAlign: "center",
                        }),
                        dropdownIndicator: (base) => ({
                            ...base,
                            padding: "0",
                            color: "#908af6",
                        }),
                        indicatorSeparator: () => ({
                            display: "none"
                        }),
                        valueContainer: (base) => ({
                            ...base,
                            padding: "0 8px",
                        }),
                    }}
                />
            </div>
                <ul className="items-container__expenses-list">
                {sortItems(transactions[action],sortBy).map((item , index) => (
                    <li key={item.id} className={`expenses-list__item transactionsLog__list${action === "Incomes" ? "--incomes" : ""}`}>
                        <span className="expenses-list-item-counter">{index + 1}</span>
                        <h3 className={`expenses-list-item__title`}>{item.title}</h3>
                        <span className="expenses-list-item__date">{item.date}</span>
                        <span className="list-item__amount">{priceFormater(budgetsAmountNum(item.amount))}</span>
                        <span className="expenses-list-item__trash" onClick={() => setItemToRemove({Id:item.id,type:action})}><img src={TrashIcon} alt="trash"/></span>
                    </li>
                ))}
                </ul>
        </div>,
        document.body
    )
}