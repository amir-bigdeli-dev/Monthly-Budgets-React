import { useState, useEffect } from "react";
import dataCalculator from "./DataCalculator.js";

const initialState = { Incomes: [], Expenses: [], Money: [], Budgets: [] , MonthlyBudget: [] };
const initialCategories = {  Incomes: [{value:"Salary", label: "Salary" }, {value:"Gift", label: "Gift" }, {value:"Investment", label: "Investment" }],
    Expenses: [{value:"Food", label: "Food" }, {value:"Rent", label: "Rent" }, {value:"Entertainment", label: "Entertainment" }],
    get Budgets(){return this.Expenses}}

export default function useTransactions() {
    const [transactions, setTransactions] = useState(() => {
        const stored = localStorage.getItem("transactions");
        return stored ? JSON.parse(stored) : initialState;
    });

    const [categoryOptions,setCategoryOptions] = useState(() => {
        const stored = localStorage.getItem("Categories");
        if(stored){
            const parsed = JSON.parse(stored);
            return{
                ...parsed,
                get Budgets(){return this.Expenses},
            }
        }
        return initialCategories;
    })

    useEffect(() => {
        localStorage.setItem("transactions", JSON.stringify(transactions));
    }, [transactions]);

    useEffect(() => {
        localStorage.setItem("Categories", JSON.stringify(categoryOptions));
    },[categoryOptions])

    function addTransaction(type, data) {
        setTransactions(prev => ({
            ...prev,
            [type]: [...prev[type], { id: Date.now(), ...data }],
        }));
    }
    
    function addCategoryOption(type, option) {
        setCategoryOptions(prev => ({
            ...prev,
            [type] : [...prev[type], option],
        }))
    }
    
    const TransactionsCalculator = dataCalculator(transactions);

    return { transactions, addTransaction , categoryOptions ,addCategoryOption , TransactionsCalculator};
}