import priceFormater from "./priceFormater.jsx";
import TrashIcon from "./assets/icons/trash-bin-trash-svgrepo-com.svg";
import {createPortal} from "react-dom";
import {use, useState} from "react";


export default function TransactionsLog({transactions}){
    const sortOptions = ["Date", "Amount", "Category"];
    const [action,setAction] = useState('income')
    const budgetsAmountNum = (item) => (Number(item.replace(/[^0-9]/g,"")))

    return createPortal(
        <div className="transactionsLog">
            <h2 className="transactionsLog__title">Transactions Log</h2>
            <div className="transactionsLog__actionBar">
                <span onClick={() => setAction('income')} className={`charts__type-label ${action === "income" ? 'charts__type-label charts__type-label--incomes-active':""}`}>Incomes</span>
                <span onClick={() => setAction('expense')} className={`charts__type-label ${action === "expense" ? 'charts__type-label charts__type-label--expenses-active':""}`}>Expenses</span>
                <select name="sortby" id="transactionsLog__actionBar-sortby">
                    {sortOptions.map((option) => (
                        <option key={option} value={option}>{option}</option>
                    ))}
                </select>
            </div>
                <ul className="items-container__expenses-list">
                {transactions.map((item , index) => (
                    <li key={item.id} className={`expenses-list__item transactionsLog__list`}>
                        <span className="expenses-list-item-counter">{index + 1}</span>
                        <h3 className={`expenses-list-item__title`}>{item.title}</h3>
                        <span className="expenses-list-item__date">{item.date}</span>
                        <span className="list-item__amount">{priceFormater(budgetsAmountNum(item.amount))}</span>
                        <span className="expenses-list-item__trash"><img src={TrashIcon} alt="trash"/></span>
                    </li>
                ))}
                </ul>
        </div>,
        document.body
    )
}