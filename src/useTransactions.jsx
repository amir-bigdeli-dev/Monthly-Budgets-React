import { useState, useEffect } from "react";
import dataCalculator from "./DataCalculator.js";
import ColorGenerator from "./ColorGenerator.js";

const initialState = {
  Incomes: [],
  Expenses: [],
  Money: [],
  Budgets: [],
  MonthlyBudget: [],
};
const initialCategories = {
  Incomes: [
    { value: "Salary", label: "Salary" },
    { value: "Gift", label: "Gift" },
    { value: "Investment", label: "Investment" },
  ],
  Budgets: [
    { value: "Food", label: "Food" },
    { value: "Rent", label: "Rent" },
    { value: "Entertainment", label: "Entertainment" },
  ],
  get Expenses() {
    return this.Budgets;
  },
};

export default function useTransactions() {
  const [transactions, setTransactions] = useState(() => {
    const stored = localStorage.getItem("transactions");
    return stored ? JSON.parse(stored) : initialState;
  });

  const [categoryOptions, setCategoryOptions] = useState(() => {
    const stored = localStorage.getItem("Categories");
    if (stored) {
      const parsed = JSON.parse(stored);
      return {
        ...parsed,
        get Expenses() {
          return this.Budgets;
        },
      };
    }
    return initialCategories;
  });

  useEffect(() => {
    localStorage.setItem("transactions", JSON.stringify(transactions));
  }, [transactions]);
  
  useEffect(() => {
    localStorage.setItem("Categories", JSON.stringify(categoryOptions));
  }, [categoryOptions]);

  function addTransaction(type, data) {
    const color = type === "Budgets" ? ColorGenerator() : undefined;

    if (type === "MonthlyBudget") {
      const isExistingMonth = transactions.MonthlyBudget.some(
          (item) => item.date === data.date
      );

      if (isExistingMonth) {
        setTransactions((prev) => ({
          ...prev,
          MonthlyBudget: prev.MonthlyBudget.map((item) =>
              item.date === data.date ? { ...item, ...data } : item
          ),
        }));
        return;
      }
    }else if(type === "Money" && transactions.Money.length > 0) {
      setTransactions((prev) => ({
        ...prev,
        Money: [{ id: Date.now(), ...data }],
      }));
      return;
    }

    setTransactions((prev) => ({
      ...prev,
      [type]: [
        ...prev[type],
        { id: Date.now(), ...(color ? { color } : {}), ...data },
      ],
    }));
  }

  function addCategoryOption(type, option) {
    setCategoryOptions((prev) => {
      if(type === "Expenses" || type === "Budgets") {
        return{
          ...prev,
          Budgets: [...prev.Budgets, option],
        }
      }
      return {
        ...prev,
        [type]: [...prev[type], option],
      }});
    localStorage.setItem("Categories",JSON.stringify(categoryOptions));
  }

  function removeItems({Id , type}) {
    setTransactions(prev => ({
      ...prev,
      [type]: prev[type].filter(expense => expense.id !== Id),
    }));
  }
  
  function EditItem(id,type,newData){
    setTransactions(prev => ({
        ...prev,
        [type]: prev[type].map(item => item.id === id ? {...item,...newData} : item),
    }))
  }
    const TransactionsCalculator = dataCalculator(transactions);

  return {
    EditItem,
    removeItems,
    transactions,
    addTransaction,
    categoryOptions,
    addCategoryOption,
    TransactionsCalculator,
  };
}
