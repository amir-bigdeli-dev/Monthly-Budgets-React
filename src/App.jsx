import Header from "./Header.jsx";
import Charts from "./Charts.jsx";

const App = () => {
    const stat = {
        total:100000,
        income: 10000,
        expenses: 500,
        monBudget: 10000 - 500
    }
  return (
    <div className="App">
      <Header stat={stat}  />
        <Charts/>
    </div>
  );
};

export default App;
