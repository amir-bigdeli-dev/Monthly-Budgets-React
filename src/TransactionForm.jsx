import { useState, useRef, useEffect } from "react";
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

export default function TransactionForm({ formType, onClose }) {
  const fields = FIELDS[formType] || [];
  const [formIsClosing, setFormIsClosing] = useState(false);
  const [formValues, setFormValues] = useState({});

  const cursorRef = useRef(null);

  function DisplayValueHandle(field, value, e) {
    if (field.id === "amount") {
      const input = e.target;
      const cursorPos = input.selectionStart;
      const oldLength = input.value.length;
      const raw = value.replace(/,/g, "");
      if (raw && isNaN(raw)) return;
      const formatted = raw ? Number(raw).toLocaleString("en-US") : "";
      const lengthDiff = formatted.length - oldLength;
      cursorRef.current = { input, pos: cursorPos + lengthDiff };
      setFormValues((prev) => ({ ...prev, amount: formatted }));
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

  return (
    <div
      className={`actionsForm actionsForm${formIsClosing ? "--fadeOut" : ""}`}
      onClick={handleClose}
    >
      <form
        action="#"
        className={`actionsForm__form actionsForm__form${formIsClosing ? "--close" : ""}`}
        onClick={(e) => e.stopPropagation()}
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
          <label key={field.id}>
            <span>{field.id}:</span>
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
              <input
                id={field.id}
                value={formValues[field.id] || ""}
                pattern={field.id === "amount" ? "[0-9.]*" : undefined}
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
              />
            )}
          </label>
        ))}

        <button className="transactionForm__submit" onClick={handleClose}>
          Submit
        </button>
      </form>
    </div>
  );
}
