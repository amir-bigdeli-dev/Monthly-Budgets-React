import { useState, useRef, useEffect,useContext } from "react";
import TransActionsContext from "./contexts.js";
import closeIcon from "./assets/icons/close-sm-svgrepo-com.svg";
import CreatableSelect from "react-select/creatable";

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
    { id: "title", type: "text", label: "Title" },
    { id: "amount", type: "text", label: "Amount" },
    {
      id: "category",
      type: "select",
      label: "Category",
    },
    { id: "date", type: "date", label: "Date" },
  ],
};

export default function TransactionForm({ formType, onClose }) {
  const fields = FIELDS[formType] || [];
  const [formIsClosing, setFormIsClosing] = useState(false);
  const [formValues, setFormValues] = useState({});
  const [cursorTrigger, setCursorTrigger] = useState(0);
  const [invalidValue,setInvalidValue] = useState(false)
  const { addTransaction, categoryOptions, addCategoryOption , TransactionsCalculator } =
    useContext(TransActionsContext);
  const cursorRef = useRef(null);

  function DisplayValueHandle(field, value, e) {
    setInvalidValue(false)
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
    } else {
      setFormValues((prev) => ({ ...prev, [field.id]: value }));
    }
  }

  useEffect(() => {
    if (cursorRef.current) {
      const { input, pos } = cursorRef.current;
      input.setSelectionRange(pos, pos);
      cursorRef.current = null;
    }
  },[formValues.amount]);
  function handleClose() {
    setFormIsClosing(true);
    setTimeout(() => {
      onClose();
      setFormIsClosing(false);
    }, 300);
  }

  function handleSubmit(e) {
    e.preventDefault();
    const isEmpty = fields.some(f => !formValues[f.id]);
    if (isEmpty) { console.error("Please fill all fields"); return; }
    addTransaction(formType, formValues);
    handleClose()
  }

  function handleNewOption(Value) {
    const newOption = {value:Value,label:Value};
    setFormValues(prev => ({...prev,category:Value}))
    addCategoryOption(formType,newOption)
  }
  return (
    <div
      className={`actionsForm actionsForm${formIsClosing ? "--fadeOut" : ""}`}
      onClick={handleClose}
    >
      <form
        className={`actionsForm__form actionsForm__form${formIsClosing ? "--close" : ""}`}
        onClick={(e) => e.stopPropagation()}
        onSubmit={handleSubmit}
      >
        <div className="actionsFrom__form-header">
          <h2 className="actionsForm-title">Add {formType}</h2>
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
            <span>{field.id}:{invalidValue && field.id === "amount" ? <h4 className="inputInvalidAlert">Exceeds monthly budget</h4> : null}</span>
            {field.type === "select" ? (
                <CreatableSelect
                    options={categoryOptions[formType] || []}
                    value={(categoryOptions[formType].find(opt => opt.value === formValues.category) || null)}
                    onChange={(selected) => setFormValues(prev => ({ ...prev, category: selected.value }))}
                    onCreateOption={handleNewOption}
                    placeholder="Select or add new..."
                    formatCreateLabel={(input) => `+ Add "${input}"`}
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
                onFocus={(e) =>
                  e.target.scrollIntoView({
                    behavior: "smooth",
                    block: "center",
                  })
                }
                className={`${invalidValue && field.id === "amount" ? "inputInvalid" : ""}`}
              />
            )}
          </label>
        ))}
        <button type="submit" className="transactionForm__submit">
          Submit
        </button>
      </form>
    </div>
  );
}
