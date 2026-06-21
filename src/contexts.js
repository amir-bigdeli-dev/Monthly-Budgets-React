import { createContext } from "react";

const TransActionsContext = createContext([
  {
    transactions: {},
    addTransaction: () => {},
    categories: {},
    addCategory: () => {},
    TransactionsCalculator: {},
    removeExpense : () => {}
  },
  function () {},
]);
export default TransActionsContext;
