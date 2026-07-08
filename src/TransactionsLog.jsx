import priceFormater from "./priceFormater.jsx";
import TrashIcon from "./assets/icons/trash-bin-trash-svgrepo-com.svg";
import {createPortal} from "react-dom";
import {Fragment, useRef,useEffect, useState ,useContext } from "react";
import Select from "react-select";
import closeIcon from "./assets/icons/close-sm-svgrepo-com.svg"
import TransActionsContext from "./contexts.js";
import sortItems from "./sort_Items.js";
import useTitleTooltip from "./useTitleTooltip.js";


export default function TransactionsLog({ status , action:initialAction , appRef}){
    const sortOptions = ["Date", "Amount", "Category"];
    const [action,setAction] = useState(initialAction || 'Expenses')
    const budgetsAmountNum = (item) => (Number(item.replace(/[^0-9]/g,"")));
    const { removeItems , transactions ,isDesktop } = useContext(TransActionsContext)
    const [itemToRemove,setItemToRemove] = useState(null);
    const [sortBy,setSortBy] = useState("Date");

    const { titleToolTip, ShowFullTitle } = useTitleTooltip();


    const LogRef = useRef(null)

    useEffect(() => {
        if (initialAction && initialAction === "Incomes" || initialAction === "Expenses") {
            setAction(initialAction);
        }
    }, [initialAction]);

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

    const content = (
        <div className="transactionsLog" ref={LogRef}>
            {itemToRemove ? <div className="expenseToRemoveAlert" onClick={(e) => e.stopPropagation()}>
                <p>Are you sure you want to delete this expense?</p>
                <div className="expenseToRemoveAlert__actions">
                    <button className="expenseToRemoveAlert__actions-confirm" onClick={() => {removeItems(itemToRemove);setItemToRemove(null)}}>Confirm</button>
                    <button className="expenseToRemoveAlert__actions-cancel" onClick={() => setItemToRemove(null)}>Cancel</button>
                </div>
            </div> : null}
            {!isDesktop ? <span className="transactionsLog__close" onClick={() => {status()}}><img className="actionsForm__close-icon" src={closeIcon} alt="close-icon"/></span>:null}
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
            {transactions[action].length > 0 ?
                <ul className="items-container__expenses-list">
                    {sortBy === "Category"
                        ? Object.entries(
                            sortItems(transactions[action], sortBy).reduce((groups, item) => {
                                const category = item.category || "Uncategorized";
                                if (!groups[category]) groups[category] = [];
                                groups[category].push(item);
                                return groups;
                            }, {})
                        ).map(([category, items]) => (
                            <Fragment key={category}>
                                <li className="Transactionslist__category-group">
                                    <h3 className="expenses-list-item__category">{category}</h3>
                                </li>
                                {items.map((item, index) => (
                                    <li key={item.id}
                                        className={`expenses-list__item transactionsLog__list${action === "Incomes" ? "--incomes" : ""} ${titleToolTip === item.id ? "expenses-item__title-tooltip" : ""}`}
                                        data-full-title={item.title}
                                    >
                                        <span className="expenses-list-item-counter">{index + 1}</span>
                                        <h3 className={`expenses-list-item__title`} onClick={(e) => ShowFullTitle(item.id, e)}>{item.title}</h3>
                                        <span className="expenses-list-item__date">{item.date}</span>
                                        <span className="list-item__amount">{priceFormater(budgetsAmountNum(item.amount))}</span>
                                        <span className="expenses-list-item__trash" onClick={() => setItemToRemove({Id:item.id,type:action})}><img src={TrashIcon} alt="trash"/></span>
                                    </li>
                                ))}
                            </Fragment>
                        ))
                        : sortItems(transactions[action],sortBy).map((item , index) => (
                            <li key={item.id}
                                className={`expenses-list__item transactionsLog__list${action === "Incomes" ? "--incomes" : ""} ${titleToolTip === item.id ? "expenses-item__title-tooltip" : ""}`}
                                data-full-title={item.title}
                            >
                                <span className="expenses-list-item-counter">{index + 1}</span>
                                <h3 className={`expenses-list-item__title`} onClick={(e) => ShowFullTitle(item.id, e)}>{item.title}</h3>
                                <span className="expenses-list-item__date">{item.date}</span>
                                <span className="list-item__amount">{priceFormater(budgetsAmountNum(item.amount))}</span>
                                <span className="expenses-list-item__trash" onClick={() => setItemToRemove({Id:item.id,type:action})}><img src={TrashIcon} alt="trash"/></span>
                            </li>
                        ))}
                </ul>
                : <p className="no-expenses">No {action} yet</p>}
        </div>
    )
    return createPortal (
       content,
        isDesktop && appRef?.current ? appRef.current : document.body
    )
}