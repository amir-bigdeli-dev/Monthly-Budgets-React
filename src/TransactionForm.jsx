import { useState, useRef, useEffect, useContext } from "react";
import TransActionsContext from "./contexts.js";
import closeIcon from "./assets/icons/close-sm-svgrepo-com.svg";
import CreatableSelect from "react-select/creatable";
import TransactionsLog from "./TransactionsLog.jsx";
import priceFormater from "./priceFormater.jsx";
import incomesIcon from "./assets/icons/down-arrow-1-svgrepo-com.svg?react";
import expensesIcon from "./assets/icons/down-arrow-1-svgrepo-com (1).svg?react";
import moneyIcon from "./assets/icons/wallet-wallet-svgrepo-com.svg?react";
import budgetsIcon from "./assets/icons/budget-cost-svgrepo-com.svg?react";
import monthlyBudgetIcon from "./assets/icons/icons8-calendar(2).svg?react";
import historyIcon from "./assets/icons/history-svgrepo-com.svg?react";
import NotificationsContext from "./NotificationsContext.js";

const iconMap = {
  Incomes: incomesIcon,
  Expenses: expensesIcon,
  Budgets: budgetsIcon,
  Money: moneyIcon,
  MonthlyBudget: monthlyBudgetIcon,
  Transactions: historyIcon
};

const FIELDS = {
  Incomes: [
    { id: "title", type: "text", label: "Title" },
    { id: "amount", type: "text", label: "Amount" },
    {
      id: "category",
      type: "select",
      label: "Category",
    },
    { id: "date", type: "date", label: "Date" },
  ],
  Expenses: [
    { id: "title", type: "text", label: "Title" },
    { id: "amount", type: "text", label: "Amount" },
    {
      id: "category",
      type: "select",
      label: "Category",
    },
    { id: "date", type: "date", label: "Date" },
  ],
  Money: [
    { id: "amount", type: "text", label: "Amount" },
    { id: "date", type: "date", label: "Date" },
  ],
  Budgets: [
    {
      id: "category",
      type: "select",
      label: "Category",
    },
    { id: "amount", type: "text", label: "Amount" },
    {id:"percent", type: "text", label: "Percent"},
    { id: "date", type: "date", label: "Date" },
  ],
  MonthlyBudget: [
    { id: "amount", type: "text", label: "Amount" },
    { id: "date", type: "month", label: "Month" },
  ],
};

export default function TransactionForm({ formType, onClose ,ItemValues = null}) {
  const fields = FIELDS[formType] || [];
  const [formIsClosing, setFormIsClosing] = useState(false);
  const [formValues, setFormValues] = useState({});
  const [cursorTrigger, setCursorTrigger] = useState(0);
  const [invalidValue,setInvalidValue] = useState(false);
  const notificationMessage = "";
  const [EmptyFields,setEmptyFields] = useState([]);
  const [transactionLogOpen,setTransactionLogOpen] = useState(true);
  const { addTransaction, categoryOptions, addCategoryOption , TransactionsCalculator , transactions , EditItem , isDesktop,Types_Labels} =
    useContext(TransActionsContext);
  const {notify} = useContext(NotificationsContext);
  const PortalRef = useRef(null);
  useEffect(() => {
    if(ItemValues) {
      setFormValues(ItemValues)
    }else if(formType === "MonthlyBudget" && transactions['MonthlyBudget'].length > 0){
      setFormValues({ date: getCurrentMonth() })
    }else{
      setFormValues({})
    }
  },[ItemValues])
  const cursorRef = useRef(null);
  
  function DisplayValueHandle(field, value, e) {
    setInvalidValue(false)
    setEmptyFields(prev => prev.filter(id => id !== field.id))
    if (field.id === "amount") {
      const input = e.target;
      const cursorPos = input.selectionStart;
      const oldLength = input.value.length;
      const raw = value.replace(/,/g, "");
      if (raw && isNaN(raw)) return;
      const formatted = raw ? Number(raw).toLocaleString("en-US") : "";
      const lengthDiff = formatted.length - oldLength;
      cursorRef.current = { input, pos: cursorPos + lengthDiff };
      if(formType === "Budgets"){
        if((Number(raw) + TransactionsCalculator.Budgets) > TransactionsCalculator.MonthlyBudget) {
          setInvalidValue(true)
          return;
        }
        const ValuePercent = ((Number(raw) * 100) / TransactionsCalculator.MonthlyBudget).toFixed(2);
        setFormValues((prev) => ({ ...prev,amount:formatted,percent: `${ValuePercent}%` }));
      }else if (formType === "MonthlyBudget"){
        if(Number(raw) > TransactionsCalculator.Money){
            notify("Monthly budget cannot exceed total money!","error",3000,PortalRef.current);
            setInvalidValue(true);
            return;
        }
      }
      setFormValues((prev) => ({ ...prev, amount: formatted }));
    }else if(field.id === "percent"){
      const input = e.target;
      const cursorPos = input.selectionStart;
      const percentValue = value.replace(/[^0-9]/g, "");
      if (Number(percentValue) > 100) {
        cursorRef.current = { input, pos: Math.min(cursorPos - 1, percentValue.length ?? 0) };
        setCursorTrigger((prev) => prev + 1);
        return}
      const PercentToValue = percentValue
        ? ((Number(percentValue) * TransactionsCalculator.MonthlyBudget) / 100)
        : "";
      if(PercentToValue + TransactionsCalculator.Budgets > TransactionsCalculator.MonthlyBudget) {
        setInvalidValue(true)
        return;
      }
      cursorRef.current = { input, pos: Math.min(cursorPos, percentValue.length) };
      setFormValues((prev) => ({ ...prev, percent: `${percentValue}%`, amount: PercentToValue.toLocaleString("en-US") }));
    }else {
      setFormValues((prev) => ({ ...prev, [field.id]: value }));
    }
  }

  useEffect(() => {
    if (cursorRef.current) {
      const { input, pos } = cursorRef.current;
      input.setSelectionRange(pos, pos);
      cursorRef.current = null;
    }
  }, [formValues.amount, formValues.percent, cursorTrigger]);
  function handleClose() {
    setFormIsClosing(true);
    setTimeout(() => {
      onClose();
      setFormIsClosing(false);
    }, isDesktop ? 0 : 300);
  }

  function handleSubmit(e) {
    e.preventDefault();
    const Empty = (fields.filter((field => !formValues[field.id])).map((fields) => fields.id));
    if (Empty.length > 0) { notify("Fill the Form!!","error",3000,PortalRef.current); setEmptyFields(Empty);return;}
    if(ItemValues){
        EditItem(ItemValues.id,formType,formValues);
    }else{
      addTransaction(formType, formValues);
    }
    handleClose();
  }
  
  function handleNewOption(Value) {
    const newOption = { value: Value, label: Value };
    setFormValues((prev) => ({ ...prev, category: Value }));
    addCategoryOption(formType, newOption);
  }

  function handleCategoryChange(selected) {
    if(transactions.Budgets.some(budget => budget.category === selected.value) && formType === "Budgets"){
      notify("This category already exists as a budget!",'error',3000,PortalRef.current);
      return;
    }
    setFormValues(prev => ({ ...prev, category: selected.value }));
    setEmptyFields(prev => prev.filter(id => id !== "category"));
  }
  
  function getCurrentMonth() {
    const date = new Date();
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, "0");
    return `${year}-${month}`;
  }
  const Icon = iconMap[formType];

  return (
      <>
        {formType === "Transactions" && !isDesktop ?
        <TransactionsLog  status={onClose} /> : 
    <div
      className={`actionsForm actionsForm${formIsClosing ? "--fadeOut" : ""}`}
      ref={el => el?.scrollIntoView({ behavior: "smooth", block: "center" })}
      onClick={handleClose}
    >
      <form
        className={`actionsForm__form actionsForm__form${formIsClosing ? "--close" : ""}`}
        onClick={(e) => e.stopPropagation()}
        onMouseDown={(e) => e.stopPropagation()}
        onSubmit={handleSubmit}
        data-type={formType}
        ref={PortalRef}
      >
        <div className="actionsFrom__form-header">
          <h2 className="actionsForm-title">{ItemValues || (formType === "MonthlyBudget" && transactions['MonthlyBudget'].length > 0 ) ? "Edit":"Add"} {Types_Labels[formType]} <Icon className="actionsForm-title__icon"/></h2>
          <span className="actionsForm__close" onClick={handleClose}>
            <img
              className="actionsForm__close-icon"
              src={closeIcon}
              alt="close-icon"
            />
          </span>
        </div>
        {fields.map((field) => (
          <label key={field.id} className={`actionsForm__label--${field.id}`}>
            <div className={`budget-form-detail ${field.id === "category" ? "budget-form-available-container" : ""}`}>{field.id}:{invalidValue && field.id === "amount" && formType === "Budgets" ? <h4 className="inputInvalidAlert">Exceeds {formType}</h4> : null}{formType === "Budgets" && field.id === "category" ? <h4 className="form-bugdet-available">available: {priceFormater(TransactionsCalculator.MonthlyBudget - TransactionsCalculator.Budgets)}</h4> : null}</div>
            {field.type === "select" ? (
                <CreatableSelect
                    options={formType === 'Expenses' ? categoryOptions['Budgets'] : categoryOptions[formType] || []}
                    value={(categoryOptions[formType].find(opt => opt.value === formValues.category) || null)}
                    onChange={(selected) => handleCategoryChange(selected)}
                    onCreateOption={handleNewOption}
                    placeholder="Select or add new..."
                    formatCreateLabel={(input) => `+ Add "${input}"`}
                    className={`${EmptyFields.includes("category") ? "EmptyFields" : ""}`}
                    onFocus={(e) => {
                      const target = e.target;
                      setTimeout(() => {
                        target.scrollIntoView({
                          behavior: "smooth",
                          block: "center",
                        });
                      }, 300);
                    }}
                />
            ) : (
              <input
                id={field.id}
                value={formValues[field.id] || ""}
                inputMode={field.id === "amount" ? "decimal" : "text"}
                name={field.id}
                type={field.type}
                key={field.id}
                onChange={(e) => DisplayValueHandle(field, e.target.value, e)}
                onFocus={(e) => {
                  const target = e.target;
                  setTimeout(() => {
                    target.scrollIntoView({
                      behavior: "smooth",
                      block: "center",
                    });
                  }, 300);
                }}
                className={`${invalidValue && field.id === "amount" ? "inputInvalid" : ""} ${EmptyFields.includes(field.id) ? "EmptyFields" : ""}`}
              />
            )}
          </label>
        ))}
        <button type="submit" className="transactionForm__submit">
          Submit
        </button>
      </form>
    </div>
        }
      </>
  );
}
