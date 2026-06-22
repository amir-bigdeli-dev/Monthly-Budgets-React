import Header from "./Header.jsx";
import Charts from "./Charts.jsx";
import Budgets from "./Budgets.jsx";
import QuickAccess from "./QuickAccess.jsx";
import TransactionForm from "./TransactionForm.jsx";
import { useState } from "react";
import TransActionsContext from "./contexts.js";
import useTransactions from "./useTransactions.jsx";

const App = () => {
  const Types_Labels = {
    Incomes: "Income",
    Expenses: "Expense",
    Money: "Money",
    Budgets: "Budget",
    MonthlyBudget: "Monthly Budget",
  };

  const types = ["Incomes", "Money", "Expenses", "Budgets", "MonthlyBudget"];
  const [formType, setFormType] = useState(null);
  const {
    transactions,
      EditItem,
      removeItems,
    addTransaction,
    categoryOptions,
    addCategoryOption,
    TransactionsCalculator,
  } = useTransactions();

  return (
    <TransActionsContext.Provider
      value={{
          EditItem,
          removeItems,
        transactions,
        addTransaction,
        categoryOptions,
        addCategoryOption,
        TransactionsCalculator,
      }}
    >
      <div className="App">
        <Header data={TransactionsCalculator} />
        <Charts types={types} type_label={Types_Labels} />
        <Budgets />
        <QuickAccess
          types={types}
          type_label={Types_Labels}
          onSelect={setFormType}
        />
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
