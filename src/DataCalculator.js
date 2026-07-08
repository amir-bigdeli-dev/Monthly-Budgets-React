function getCurrentMonth() {
  const date = new Date();
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  return `${year}-${month}`;
}

const parseAmount = (amount) =>
  parseFloat(String(amount).replace(/,/g, "")) || 0;

const dataCalculator = (transactions) => {
  const Incomes = transactions.Incomes.reduce(
    (sum, item) => sum + parseAmount(item.amount),
    0,
  );
  const Expenses = transactions.Expenses.reduce(
    (sum, item) => sum + parseAmount(item.amount),
    0,
  );
  const Money = transactions.Money.reduce(
    (sum, item) => sum + parseAmount(item.amount),
    0,
  );

  const Budgets = transactions.Budgets.reduce(
    (sum, item) => sum + parseAmount(item.amount),
    0,
  );
  const MonthlyBudget = parseAmount(transactions.MonthlyBudget.find(item => item.date === getCurrentMonth())?.amount) || 0;

  return {
    Incomes: Incomes,
    Expenses: Expenses,
    Money: Money + Incomes - Expenses,
    MonthlyBudget: MonthlyBudget,
    Budgets: Budgets,
  };
};

export default dataCalculator;
