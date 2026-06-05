import Header from "./Header.jsx";
import Charts from "./Charts.jsx";
import Budgets from "./Budgets.jsx"
import QuickAccess from "./QuickAccess.jsx";

const App = () => {
  const stat = {
    total: 100000,
    income: 10000,
    expenses: 500,
    monBudget: 10000 - 500,
  };
  return (
    <div className="App">
      <Header stat={stat} />
      <Charts/>
      <Budgets/>
        <QuickAccess/>
    </div>
  );
};

export default App;
