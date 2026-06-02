const types = ["Incomes", "Expenses", "Money"];

export default function Charts() {
  return (
    <div className="charts">
      <ul className="charts__type">
        {types.map((type) => (
          <li
            key={type}
            className={`charts__type-label charts__type-label--${type.toLowerCase()}`}
          >
            {type}
          </li>
        ))}
      </ul>
        <div className="charts__chart"></div>
    </div>
  );
}
