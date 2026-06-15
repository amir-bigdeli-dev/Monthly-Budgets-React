import {useState} from "react";
import closeIcon from "./assets/icons/close-sm-svgrepo-com.svg";

const FIELDS = {
  Incomes: [
    { id: "title", type: "text", label: "Title" },
    { id: "amount", type: "text", label: "Amount" },
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
    { id: "amount", type: "text", label: "Amount" },
    {
      id: "category",
      type: "select",
      label: "Category",
      options: ["Food", "Transport", "Entertainment", "Health", "Other"],
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
      options: ["Food", "Transport", "Entertainment", "Health", "Other"],
    },
    { id: "date", type: "date", label: "Date" },
  ],
};

export default function TransactionForm({ formType , onClose}) {
  const fields = FIELDS[formType] || [];
  const [formIsClosing, setFormIsClosing] = useState(false);

  function DisplayValueHandle(e){
    const rawAmount = e.target.value.replace(/,/g, "");
    if (e.target.id !== "amount") return;
    if (rawAmount === "") return;
    if (isNaN(rawAmount)) {
      e.target.value = e.target.value.slice(0, -1);
      console.error("Invalid input: Amount must be a number.");
      return;
    }
    e.target.value = Number(rawAmount).toLocaleString("en-US");
    }

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
              <select id={field.id} name={field.id}>
                <option value="">Select</option>
                {field.options.map((opt) => (
                  <option key={opt} value={opt}>
                    {opt}
                  </option>
                ))}
              </select>
            ) : (
              <input id={field.id} name={field.id} type={field.type} key={field.id} onChange={DisplayValueHandle}  onFocus={(e) => e.target.scrollIntoView({ behavior: "smooth", block: "center" })} />
            )}
          </label>
        ))}

        <button className="transactionForm__submit" onClick={handleClose}>Submit</button>
      </form>
    </div>
  );
}
