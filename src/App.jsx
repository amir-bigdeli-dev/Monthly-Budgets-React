import Header from "./Header.jsx";
import Charts from "./Charts.jsx";
import Budgets from "./Budgets.jsx";
import QuickAccess from "./QuickAccess.jsx";
import TransactionForm from "./TransactionForm.jsx";
import TransactionsLog from "./TransactionsLog.jsx";
import {useState, useEffect, useRef, useContext} from "react";
import TransActionsContext from "./contexts.js";
import NotificationsContext from "./NotificationsContext.js";
import useTransactions from "./useTransactions.jsx";
import useNotification from "./useNotifications.jsx";


function useIsDesktop(breakpoint = 850) {
    const [isDesktop, setIsDesktop] = useState(window.innerWidth >= breakpoint);

    useEffect(() => {
        const mediaQuery = window.matchMedia(`(min-width: ${breakpoint}px)`);
        const handler = (event) => setIsDesktop(event.matches);
        mediaQuery.addEventListener("change", handler);
        return () => mediaQuery.removeEventListener("change", handler);
    }, [breakpoint]);
    return isDesktop
}

const App = () => {
  const Types_Labels = {
    Incomes: "Income",
    Expenses: "Expense",
    Money: "Money",
    Budgets: "Budget",
    MonthlyBudget: "Monthly Budget",
      Transactions : "Transactions"
  };

  const types = ["Incomes", "Money", "Expenses", "Budgets", "MonthlyBudget"];
  const isDesktop = useIsDesktop(850);
  const [formType, setFormType] = useState(null);
  const [transactionsRef, setTransactionsRef] = useState(null);
  const appRef = useRef(null);

    useEffect(() => {
        setTransactionsRef(appRef.current);
    }, []);
  const {
    transactions,
      EditItem,
      removeItems,
    addTransaction,
    categoryOptions,
    addCategoryOption,
    TransactionsCalculator,
  } = useTransactions();

  const {notificationUI,notify} = useNotification()
  return (
      <NotificationsContext.Provider value={{notify}}>
    <TransActionsContext.Provider
      value={{
          EditItem,
          removeItems,
        transactions,
        addTransaction,
        categoryOptions,
        addCategoryOption,
        TransactionsCalculator,
          isDesktop,
          Types_Labels,
      }}
    >
      <div className="App" ref={appRef}>
          {notificationUI}
        <Header data={TransactionsCalculator} />
        <Charts />
        <Budgets />
          {isDesktop ? <TransactionsLog status={() => setFormType(null)} action={formType} appRef={appRef} /> : null}
        <QuickAccess
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
      </NotificationsContext.Provider>
  );
};

export default App;
