import Header from "./Header.jsx";
const App = () => {
    const stat = {
        income: 10000,
        expenses: 500,
        monBudget: 10000 - 500
    }
  return (
    <div className="App">
      <Header stat={stat}  />
    </div>
  );
};

export default App;
