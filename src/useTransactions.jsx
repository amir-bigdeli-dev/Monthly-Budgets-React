import { useState, useEffect } from "react";

const initialState = { Incomes: [], Expenses: [], Money: [], Budgets: [] };

export default function useTransactions() {
    const [transactions, setTransactions] = useState(() => {
        const stored = localStorage.getItem("transactions");
        return stored ? JSON.parse(stored) : initialState;
    });

    useEffect(() => {
        localStorage.setItem("transactions", JSON.stringify(transactions));
    }, [transactions]);

    function addTransaction(type, data) {
        setTransactions(prev => ({
            ...prev,
            [type]: [...prev[type], { id: Date.now(), ...data }],
        }));
    }

    return { transactions, addTransaction };
}