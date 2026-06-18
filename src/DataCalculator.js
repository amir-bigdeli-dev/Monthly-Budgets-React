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
  const MonthlyBudget = transactions.MonthlyBudget.reduce(
    (sum, item) => sum + parseAmount(item.amount),
    0,
  );

  return {
    Incomes: Incomes,
    Expenses: Expenses,
    Money: Money + Incomes - Expenses,
    MonthlyBudget: MonthlyBudget,
    Budgets: Budgets,
  };
};

export default dataCalculator;
