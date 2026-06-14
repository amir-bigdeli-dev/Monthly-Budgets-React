import { useState } from "react";

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

export default function TransactionForm({ formType }) {
  const fields = FIELDS[formType] || [];
  return (
    <div className="actionsForm">
      <form action="#" className="actionsForm-form">
        <h2 className="actionsForm-title">Add {formType}</h2>
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
              <input name={field.id} type={field.type} key={field.id} />
            )}
          </label>
        ))}

        <button className="transactionForm__submit">Submit</button>
      </form>
    </div>
  );
}
