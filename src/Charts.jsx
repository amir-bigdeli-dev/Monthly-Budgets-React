import { useContext, useState } from "react";

export default function Charts({ types, type_label }) {
  const [chart_type, setChart_type] = useState("Incomes");
  types = types.filter((type) => type !== "MonthlyBudget");
  return (
    <div className="charts">
      <ul className="charts__type">
        {types.map((type) => {
          const active = type === chart_type;
          return (
            <li
              key={type}
              className={`charts__type-label charts__type-label--${type.toLowerCase()}${active ? "-active" : ""}`}
              onClick={() => setChart_type(type)}
            >
              {type_label[type]}
            </li>
          );
        })}
      </ul>
      <div className="charts__chart"></div>
    </div>
  );
}
