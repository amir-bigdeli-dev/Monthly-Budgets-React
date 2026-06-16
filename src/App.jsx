import Header from "./Header.jsx";
import Charts from "./Charts.jsx";
import Budgets from "./Budgets.jsx";
import QuickAccess from "./QuickAccess.jsx";
import TransactionForm from "./TransactionForm.jsx";
import { useState} from "react";
import TransActionsContext from "./contexts.js";
import useTransactions from "./useTransactions.jsx";

const App = () => {
  const stat = {
    total: 100000,
    income: 10000,
    expenses: 500,
    monBudget: 10000 - 500,
  };

  const types = ["Incomes", "Money", "Expenses", "Budgets"];
  const [formType, setFormType] = useState(null);
  const {transactions, addTransaction} = useTransactions()

  return (
      <TransActionsContext.Provider value={[transactions, addTransaction]}>
    <div className="App">
      <Header stat={stat} />
      <Charts types={types} />
      <Budgets />
      <QuickAccess types={types} onSelect={setFormType} />
      {formType ? (
        <TransactionForm
          formType={formType}
          onClose={() => setFormType(null)}
        />
      ) : null}
    </div>
      </TransActionsContext.Provider>
  );
};

export default App;
