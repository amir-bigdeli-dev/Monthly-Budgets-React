import { createContext } from "react";

const TransActionsContext = createContext([{ transactions: {},
    addTransaction: () => {},
    categories: {},
    addCategory: () => {},
    TransactionsCalculator: {}}, function () {}]);
export default TransActionsContext;