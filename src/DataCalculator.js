const parseAmount = (amount) =>
  parseFloat(String(amount).replace(/,/g, "")) || 0;

const dataCalculator = (transactions) => ({
  Incomes: transactions.Incomes.reduce(
    (sum, item) => sum + parseAmount(item.amount),
    0,
  ),
  Expenses: transactions.Expenses.reduce(
    (sum, item) => sum + parseAmount(item.amount),
    0,
  ),
  Money:
    transactions.Money.reduce(
      (sum, item) => sum + parseAmount(item.amount),
      0,
    ) +
    transactions.Incomes.reduce(
      (sum, item) => sum + parseAmount(item.amount),
      0,
    ) -
    transactions.Expenses.reduce(
      (sum, item) => sum + parseAmount(item.amount),
      0,
    ),
  Budgets: transactions.Budgets.reduce(
    (sum, item) => sum + parseAmount(item.amount),
    0,
  ),
  MonthlyBudget: transactions.MonthlyBudget.reduce(
    (sum, item) => sum + parseAmount(item.amount),
    0,
  ),
});

export default dataCalculator;
