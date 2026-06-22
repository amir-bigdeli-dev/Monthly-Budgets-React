import { createContext } from "react";

const TransActionsContext = createContext([
  {
    transactions: {},
    addTransaction: () => {},
    categories: {},
    addCategory: () => {},
    TransactionsCalculator: {},
    removeExpense : () => {},
    EditItem : () => {}
  },
  function () {},
]);
export default TransActionsContext;
