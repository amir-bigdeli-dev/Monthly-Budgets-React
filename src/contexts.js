import { createContext } from "react";

const TransActionsContext = createContext([{ transactions: {},
    addTransaction: () => {},
    categories: {},
    addCategory: () => {},}, function () {}]);
export default TransActionsContext;