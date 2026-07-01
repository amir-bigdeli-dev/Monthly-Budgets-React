import { useContext, useState , useMemo } from "react";
import { Legend, ComposedChart, XAxis, YAxis, ResponsiveContainer, Bar, Tooltip, Line, PieChart, Pie, Cell } from 'recharts';import TransActionsContext from "./contexts.js";

export default function Charts() {
    const types = ["Budgets","Incomes/Expenses","Money"];
    const [chart_type, setChart_type] = useState("Incomes/Expenses");
    const budgetsAmountNum = (item) => (Number(item.replace(/[^0-9]/g,"")))
    const {transactions,TransactionsCalculator} = useContext(TransActionsContext);
    const [chartTimeFilterType,setChartTimeFilterType] = useState("daily");
    const chartTimeFilterOptions = ["daily","weekly","monthly","yearly"];

    const getWeekKey = (dateString) => {
        const date = new Date(dateString);
        const startOfYear = new Date(date.getFullYear(), 0, 1);
        const pastDays = (date - startOfYear) / 86400000;
        const week = Math.ceil((pastDays + startOfYear.getDay() + 1) / 7);
        return `${date.getFullYear()}-W${String(week).padStart(2, "0")}`;
    };

    const getMonthKey = (dateString) => {
        const date = new Date(dateString);
        return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, "0")}`;
    };

    const getDayKey = (dateString) => {
        const date = new Date(dateString);
        const dayIndex = date.getDay();
        const dayNames = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
        return dayNames[dayIndex];
    };

    function getChartData() {
        const data = {};
        const data_Type = ["Incomes", "Expenses", "Money"];
        const now = new Date();
        const currentYear = now.getFullYear();

        if (chartTimeFilterType === "daily") {
            const dayNames = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
            dayNames.forEach((day) => {
                data[day] = { date: day, Incomes: 0, Expenses: 0, Money: 0 };
            });
        } else if (chartTimeFilterType === "weekly") {
            const month = now.getMonth();
            const firstDay = new Date(currentYear, month, 1);
            const lastDay = new Date(currentYear, month + 1, 0);

            let current = new Date(firstDay);
            while (current <= lastDay) {
                const key = getWeekKey(current.toISOString().split("T")[0]);
                if (!data[key]) data[key] = { date: key, Incomes: 0, Expenses: 0, Money: 0 };
                current.setDate(current.getDate() + 7);
            }
        } else if (chartTimeFilterType === "monthly") {
            const currentMonth = now.getMonth();
            const startMonth = currentMonth < 6 ? 0 : 6;

            for (let month = startMonth; month < startMonth + 6; month++) {
                const d = new Date(currentYear, month, 1);
                const key = getMonthKey(d);
                if (!data[key]) data[key] = { date: key, Incomes: 0, Expenses: 0, Money: 0 };
            }
        } else if (chartTimeFilterType === "yearly") {
            let oldestYear = currentYear;

            data_Type.forEach((type) => {
                if (!transactions[type]) return;
                transactions[type].forEach((item) => {
                    if (item.date) {
                        const transactionYear = new Date(item.date).getFullYear();
                        if (!isNaN(transactionYear) && transactionYear < oldestYear) {
                            oldestYear = transactionYear;
                        }
                    }
                });
            });

            for (let year = oldestYear; year <= currentYear; year++) {
                const key = String(year);
                data[key] = { date: key, Incomes: 0, Expenses: 0, Money: 0 };
            }
        }

        data_Type.forEach((type) => {
            if (!transactions[type]) return;

            transactions[type].forEach((item) => {
                let key;
                if (chartTimeFilterType === "daily") key = getDayKey(item.date);
                else if (chartTimeFilterType === "weekly") key = getWeekKey(item.date);
                else if (chartTimeFilterType === "monthly") key = getMonthKey(item.date);
                else if (chartTimeFilterType === "yearly") {
                    key = item.date.split("-")[0];
                } else key = item.date;

                if (!data[key]) {
                    data[key] = { date: key, Incomes: 0, Expenses: 0, Money: 0 };
                }

                data[key][type] += budgetsAmountNum(item.amount);
            });
        });

        const sortedData = Object.values(data).sort((a, b) => {
            if (chartTimeFilterType === "daily") {
                const dayNames = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
                return dayNames.indexOf(a.date) - dayNames.indexOf(b.date);
            }
            if (chartTimeFilterType === "weekly") {
                return a.date.localeCompare(b.date);
            }
            const dateA = new Date(a.date.length === 4 ? `${a.date}-01-01` : (a.date.length === 7 ? `${a.date}-01` : a.date));
            const dateB = new Date(b.date.length === 4 ? `${b.date}-01-01` : (b.date.length === 7 ? `${b.date}-01` : b.date));
            return dateA - dateB;
        });

        let runningBalance = 0;
        sortedData.forEach((period) => {
            runningBalance += (period.Money + period.Incomes - period.Expenses);
            period.Money = runningBalance;
        });

        return sortedData;
    }

    const ChartData = useMemo(() => getChartData(), [transactions, chartTimeFilterType]);

    const formatXAxis = (key) => {
        if (chartTimeFilterType === "daily") {
            return key.slice(0, 3);
        } else if (chartTimeFilterType === "weekly") {
            const weekNum = parseInt(key.split("-W")[1]);
            const now = new Date();
            const firstWeekOfMonth = getWeekKey(new Date(now.getFullYear(), now.getMonth(), 1).toISOString().split("T")[0]);
            const firstWeekNum = parseInt(firstWeekOfMonth.split("-W")[1]);

            const weekIndex = weekNum - firstWeekNum;
            const start = weekIndex * 7 + 1;
            const end = Math.min(start + 6, new Date(now.getFullYear(), now.getMonth() + 1, 0).getDate());

            return `${start}-${end}`;
        } else if (chartTimeFilterType === "monthly") {
            const [year, month] = key.split("-");
            const date = new Date(year, month - 1);
            return date.toLocaleString("default", { month: "short" });
        } else if (chartTimeFilterType === "yearly") {
            return key;
        } else {
            return key;
        }
    };
    function getBudgetsChartData() {
        const budgetItems = transactions.Budgets.map((item) => ({
            name: item.category,
            value: budgetsAmountNum(item.amount),
            color: item.color,
        }));

        const remaining = TransactionsCalculator.MonthlyBudget - TransactionsCalculator.Budgets;

        if (remaining > 0) {
            budgetItems.push({
                name: "Unallocated",
                value: remaining,
                color: "#dedede",
            });
        }

        return budgetItems;
    }

    const BudgetsChartData = useMemo(
        () => getBudgetsChartData(),
        [transactions.Budgets, TransactionsCalculator.MonthlyBudget, TransactionsCalculator.Budgets]
    );
    const formatTooltipLabel = (key) => {
        if (chartTimeFilterType === "daily") {
            const dayNames = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
            const dayIndex = dayNames.indexOf(key);
            const now = new Date();
            const currentDay = now.getDay();
            const daysToAdd = dayIndex - currentDay;
            const tooltipDate = new Date(now);
            tooltipDate.setDate(tooltipDate.getDate() + daysToAdd);
            const dateStr = tooltipDate.toLocaleDateString("default", { month: "short", day: "numeric" });
            return `${key} - ${dateStr}`;
        } else if (chartTimeFilterType === "weekly") {
            const weekNum = parseInt(key.split("-W")[1]);
            const now = new Date();
            const firstWeekOfMonth = getWeekKey(new Date(now.getFullYear(), now.getMonth(), 1).toISOString().split("T")[0]);
            const firstWeekNum = parseInt(firstWeekOfMonth.split("-W")[1]);

            const weekIndex = weekNum - firstWeekNum;
            const start = weekIndex * 7 + 1;
            const end = Math.min(start + 6, new Date(now.getFullYear(), now.getMonth() + 1, 0).getDate());

            return `Week: ${start}-${end}`;
        } else if (chartTimeFilterType === "monthly") {
            const [year, month] = key.split("-");
            const date = new Date(year, month - 1);
            return date.toLocaleString("default", { month: "long", year: "numeric" });
        } else if (chartTimeFilterType === "yearly") {
            return `Year: ${key}`;
        } else {
            return key;
        }
    };
    return (
        <div className="charts">
            <ul className="charts__type">
                {types.map((type) => {
                    const active = type === chart_type;
                    return (
                        <li
                            key={type}
                            className={`charts__type-label charts__type-label--${type.toLowerCase().replaceAll("/","_")}${active ? "-active" : ""}`}
                            onClick={() => setChart_type(type)}
                        >
                            {type}
                        </li>
                    );
                })}
            </ul>
            <div className="charts__chart">
                {chart_type === "Incomes/Expenses" && (
                    <ul className="chart__TimeFilters">
                        {chartTimeFilterOptions.map((filter) => {
                            const active = filter === chartTimeFilterType;
                            return (
                                <li key={filter} className={`chart__TimeFilters-label chart__TimeFilters-label--${active ? "active" : ""}`} onClick={() => setChartTimeFilterType(filter)}>
                                    {filter.slice(0,1).toUpperCase()}
                                </li>
                            )
                        })}
                    </ul>
                )}

                {chart_type === "Incomes/Expenses" ? (
                    <ResponsiveContainer width="100%" height="100%">
                        <ComposedChart data={ChartData} responsive >
                            <XAxis dataKey="date" tickFormatter={formatXAxis} tick={{fontSize:12}} />
                            <YAxis yAxisId="left" hide />
                            <YAxis yAxisId="right" orientation="right" hide />
                            <Tooltip cursor={{ stroke: 'transparent', strokeWidth: 0, fill: 'transparent' }} labelFormatter={formatTooltipLabel}/>
                            <Legend iconType="circle" wrapperStyle={{
                                fontSize: "14px",
                                fontFamily: "Vazirmatn, sans-serif",
                            }} />
                            <Bar yAxisId="left" dataKey="Expenses" fill="red" radius={[5,5,0,0]} barSize={20} activeBar={false}/>
                            <Bar yAxisId="left" dataKey="Incomes" fill="green" radius={[5,5,0,0]} barSize={20} activeBar={false}/>
                            <Line
                                yAxisId="right"
                                type="monotone"
                                dataKey="Money"
                                stroke="rgb(178 119 16)"
                                strokeWidth={2}
                                dot={{ r: 3 }}
                                activeDot={{ r: 4 }}
                            />
                        </ComposedChart>
                    </ResponsiveContainer>
                ) : null}

                {chart_type === "Budgets" ? (
                    BudgetsChartData.length === 0 ? (
                        <div style={{ padding: "20px", color: "#666" }}>
                            No budgets yet.
                        </div>
                    ) : (
                        <ResponsiveContainer width="100%" height="100%">
                            <PieChart>
                                <Pie
                                    data={BudgetsChartData}
                                    dataKey="value"
                                    nameKey="name"
                                    cx="50%"
                                    cy="45%"
                                    outerRadius="65%"
                                    innerRadius="40%"
                                    paddingAngle={2}
                                    label={({ name, percent }) => ` ${(percent * 100).toFixed(0)}%`}
                                    labelLine={false}
                                >
                                    {BudgetsChartData.map((entry, index) => (
                                        <Cell key={`cell-${index}`} fill={entry.color} />
                                    ))}
                                </Pie>
                                <Tooltip
                                    cursor={{ stroke: 'transparent', strokeWidth: 0, fill: 'transparent' }}
                                    labelFormatter={formatTooltipLabel}
                                    contentStyle={{
                                        backgroundColor: "#ffffff",
                                        border: "1px solid rgb(187 187 187 / 0.65)",
                                        borderRadius: "0.6rem",
                                        boxShadow: "3px 3px 10px rgb(197 197 197 / 0.2)",
                                        padding: "0.6rem 0.8rem",
                                        fontSize: "1rem",
                                        fontFamily: "DM Sans, sans-serif",
                                    }}
                                    labelStyle={{
                                        fontWeight: "800",
                                        marginBottom: "0.3rem",
                                        color: "#484848",
                                    }}
                                    itemStyle={{
                                        fontSize: "1rem",
                                        padding: "0.1rem 0",
                                    }}
                                />
                                <Legend
                                    iconType="circle"
                                    wrapperStyle={{
                                        fontSize: "10px",
                                        fontFamily: "Vazirmatn, sans-serif",
                                        marginTop: "1rem"
                                    }}
                                />
                            </PieChart>
                        </ResponsiveContainer>
                    )
                ) : null}
            </div>
        </div>
    );
}