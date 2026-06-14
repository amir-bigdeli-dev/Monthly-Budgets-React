import {useState, useRef, useEffect} from "react";
import closeIcon from "./assets/icons/close-sm-svgrepo-com.svg";

const FIELDS = {
  Incomes: [
    { id: "title", type: "text", label: "Title" },
    { id: "amount", type: "number", label: "Amount" },
    {
      id: "category",
      type: "select",
      label: "Category",
      options: ["Salary", "Freelance", "Investment", "Gift", "Other"],
    },
    { id: "date", type: "date", label: "Date" },
  ],
  Expenses: [
    { id: "title", type: "text", label: "Title" },
    { id: "amount", type: "number", label: "Amount" },
    {
      id: "category",
      type: "select",
      label: "Category",
      options: ["Food", "Transport", "Entertainment", "Health", "Other"],
    },
    { id: "date", type: "date", label: "Date" },
  ],
  Money: [
    { id: "amount", type: "number", label: "Amount" },
    { id: "date", type: "date", label: "Date" },
  ],
  Budgets: [
    { id: "title", type: "text", label: "Title" },
    { id: "amount", type: "number", label: "Amount" },
    {
      id: "category",
      type: "select",
      label: "Category",
      options: ["Food", "Transport", "Entertainment", "Health", "Other"],
    },
    { id: "date", type: "date", label: "Date" },
  ],
};

export default function TransactionForm({ formType , onClose}) {
  const fields = FIELDS[formType] || [];
  const [formIsClosing, setFormIsClosing] = useState(false);
  
  function handleClose() {
    setFormIsClosing(true);
    setTimeout(() => {
      onClose();
      setFormIsClosing(false);
    }, 300);}
  
  return (
    <div className={`actionsForm actionsForm${formIsClosing ? "--fadeOut" : ""}`} onClick={handleClose}>
      <form action="#" className={`actionsForm__form actionsForm__form${formIsClosing ? "--close" : ""}`} onClick={(e) => e.stopPropagation()}>
        <div className="actionsFrom__form-header">
        <h2 className="actionsForm-title">Add {formType}</h2>
        <span className="actionsForm__close" onClick={handleClose}><img className="actionsForm__close-icon" src={closeIcon} alt="close-icon"/></span>
        </div>
        {fields.map((field) => (
          <label key={field.id}>
            <span>
              {field.id}:
            </span>
            {field.type === "select" ? (
              <select name={field.id}>
                <option value="">Select</option>
                {field.options.map((opt) => (
                  <option key={opt} value={opt}>
                    {opt}
                  </option>
                ))}
              </select>
            ) : (
              <input name={field.id} type={field.type} key={field.id}  onFocus={(e) => e.target.scrollIntoView({ behavior: "smooth", block: "center" })} />
            )}
          </label>
        ))}

        <button className="transactionForm__submit" onClick={handleClose}>Submit</button>
      </form>
    </div>
  );
}
