import { useContext, useState, useMemo } from "react";
import { Legend, ComposedChart, XAxis, YAxis, ResponsiveContainer, Bar, Tooltip, Line, Area, PieChart, Pie } from 'recharts';
import BackArrow from "./assets/icons/icons8-back.svg?react";
import ForwardArrow from "./assets/icons/icons8-back(1).svg?react";
import TransActionsContext from "./contexts.js";

export default function Charts() {
    const types = ["Budgets", "Incomes/Expenses", "Money"];
    const [chart_type, setChart_type] = useState("Incomes/Expenses");
    const budgetsAmountNum = (item) => (Number(item.replace(/[^0-9]/g, "")));
    const { transactions, TransactionsCalculator } = useContext(TransActionsContext);

    // Time filter for Incomes/Expenses chart
    const [chartTimeFilterType, setChartTimeFilterType] = useState("daily");
    const chartTimeFilterOptions = ["daily", "weekly", "monthly", "yearly"];

    // Time filter for Money chart (separate state)
    const [moneyTimeFilterType, setMoneyTimeFilterType] = useState("monthly");
    const moneyTimeFilterOptions = ["monthly", "yearly"];

    const [currentReferenceDate, setCurrentReferenceDate] = useState(new Date());

    const activeFilterType = chart_type === "Incomes/Expenses" ? chartTimeFilterType : moneyTimeFilterType;

    // پیدا کردن تاریخ اولین تراکنش از نوع Money برای اعمال در فیلتر سالانه
    const moneyStartDate = useMemo(() => {
        let minMoneyDate = null;
        if (transactions["Money"] && transactions["Money"].length > 0) {
            transactions["Money"].forEach((item) => {
                if (item.date) {
                    const d = new Date(item.date);
                    if (!isNaN(d)) {
                        if (!minMoneyDate || d < minMoneyDate) {
                            minMoneyDate = d;
                        }
                    }
                }
            });
        }
        return minMoneyDate ? minMoneyDate : new Date();
    }, [transactions]);

    // پیدا کردن کرانِ بالا و پایین کل داده‌ها برای ناوبری دکمه‌ها
    const dateBounds = useMemo(() => {
        let minDate = new Date();
        let maxDate = new Date();
        let hasData = false;

        ["Incomes", "Expenses", "Money"].forEach((type) => {
            if (!transactions[type]) return;
            transactions[type].forEach((item) => {
                if (item.date) {
                    const d = new Date(item.date);
                    if (!isNaN(d)) {
                        if (!hasData) {
                            minDate = d;
                            maxDate = d;
                            hasData = true;
                        } else {
                            if (d < minDate) minDate = d;
                            if (d > maxDate) maxDate = d;
                        }
                    }
                }
            });
        });
        return { minDate, maxDate };
    }, [transactions]);

    // محاسبه‌ی امکان به عقب برگشتن
    const canGoBack = useMemo(() => {
        // برای حالت سالانه، دکمه عقب رفتن نباید از سالِ ورود اولین دیتای Money عقب‌تر برود
        if (activeFilterType === "yearly") {
            const currentYear = currentReferenceDate.getFullYear();
            const startYearOfBlock = currentYear - 4;
            return startYearOfBlock > moneyStartDate.getFullYear();
        }

        const limitDate = new Date(dateBounds.minDate);
        limitDate.setHours(0,0,0,0);

        if (activeFilterType === "daily") {
            const currentSunday = new Date(currentReferenceDate);
            currentSunday.setDate(currentSunday.getDate() - currentSunday.getDay());
            currentSunday.setHours(0,0,0,0);
            return currentSunday > limitDate;
        }

        if (activeFilterType === "weekly") {
            const firstDayOfRefMonth = new Date(currentReferenceDate.getFullYear(), currentReferenceDate.getMonth(), 1);
            return firstDayOfRefMonth > limitDate;
        }

        if (activeFilterType === "monthly") {
            const currentMonth = currentReferenceDate.getMonth();
            const startMonth = currentMonth < 6 ? 0 : 6;
            const startOfBlock = new Date(currentReferenceDate.getFullYear(), startMonth, 1);
            return startOfBlock > limitDate;
        }

        return false;
    }, [currentReferenceDate, activeFilterType, dateBounds, moneyStartDate]);

    // محاسبه‌ی امکان به جلو رفتن
    const canGoForward = useMemo(() => {
        const limitDate = new Date(dateBounds.maxDate);
        limitDate.setHours(23,59,59,999);

        if (activeFilterType === "daily") {
            const currentSaturday = new Date(currentReferenceDate);
            currentSaturday.setDate(currentSaturday.getDate() + (6 - currentSaturday.getDay()));
            currentSaturday.setHours(23,59,59,999);
            return currentSaturday < limitDate;
        }

        if (activeFilterType === "weekly") {
            const lastDayOfRefMonth = new Date(currentReferenceDate.getFullYear(), currentReferenceDate.getMonth() + 1, 0);
            lastDayOfRefMonth.setHours(23,59,59,999);
            return lastDayOfRefMonth < limitDate;
        }

        if (activeFilterType === "monthly") {
            const currentMonth = currentReferenceDate.getMonth();
            const startMonth = currentMonth < 6 ? 0 : 6;
            const endOfBlock = new Date(currentReferenceDate.getFullYear(), startMonth + 6, 0);
            endOfBlock.setHours(23,59,59,999);
            return endOfBlock < limitDate;
        }

        if (activeFilterType === "yearly") {
            const currentYear = currentReferenceDate.getFullYear();
            const endOfBlock = new Date(currentYear, 11, 31);
            endOfBlock.setHours(23,59,59,999);
            return endOfBlock < limitDate;
        }

        return false;
    }, [currentReferenceDate, activeFilterType, dateBounds]);

    const handleNavigate = (direction) => {
        const newDate = new Date(currentReferenceDate);
        const sign = direction === "prev" ? -1 : 1;

        if (activeFilterType === "daily") {
            newDate.setDate(newDate.getDate() + (sign * 7));
        } else if (activeFilterType === "weekly") {
            newDate.setMonth(newDate.getMonth() + (sign * 1));
        } else if (activeFilterType === "monthly") {
            newDate.setMonth(newDate.getMonth() + (sign * 6));
        } else if (activeFilterType === "yearly") {
            newDate.setFullYear(newDate.getFullYear() + (sign * 5));
        }

        setCurrentReferenceDate(newDate);
    };

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

    function getChartData(filterType) {
        const data = {};
        const data_Type = ["Incomes", "Expenses", "Money"];
        const now = currentReferenceDate;
        const currentYear = now.getFullYear();

        let windowStart = null;
        let windowEnd = null;

        if (filterType === "daily") {
            const dayNames = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
            dayNames.forEach((day) => {
                data[day] = { date: day, Incomes: 0, Expenses: 0, Money: 0 };
            });

            const currentDayIndex = now.getDay();
            windowStart = new Date(now);
            windowStart.setDate(now.getDate() - currentDayIndex);
            windowStart.setHours(0,0,0,0);

            windowEnd = new Date(windowStart);
            windowEnd.setDate(windowStart.getDate() + 6);
            windowEnd.setHours(23,59,59,999);

        } else if (filterType === "weekly") {
            const month = now.getMonth();
            windowStart = new Date(currentYear, month, 1);
            windowEnd = new Date(currentYear, month + 1, 0);

            let current = new Date(windowStart);
            while (current <= windowEnd) {
                const key = getWeekKey(current.toISOString().split("T")[0]);
                if (!data[key]) data[key] = { date: key, Incomes: 0, Expenses: 0, Money: 0 };
                current.setDate(current.getDate() + 7);
            }
        } else if (filterType === "monthly") {
            const currentMonth = now.getMonth();
            const startMonth = currentMonth < 6 ? 0 : 6;
            windowStart = new Date(currentYear, startMonth, 1);
            windowEnd = new Date(currentYear, startMonth + 6, 0);

            for (let month = startMonth; month < startMonth + 6; month++) {
                const d = new Date(currentYear, month, 1);
                const key = getMonthKey(d);
                if (!data[key]) data[key] = { date: key, Incomes: 0, Expenses: 0, Money: 0 };
            }
        } else if (filterType === "yearly") {
            const startYear = currentYear - 4;
            windowStart = new Date(startYear, 0, 1);
            windowEnd = new Date(currentYear, 11, 31, 23, 59, 59, 999);

            for (let year = startYear; year <= currentYear; year++) {
                const key = String(year);
                data[key] = { date: key, Incomes: 0, Expenses: 0, Money: 0 };
            }
        }

        // محاسبه موجودی انباشته قبل از آغاز بازه جاری
        let baseBalance = 0;
        if (windowStart) {
            data_Type.forEach((type) => {
                if (!transactions[type]) return;
                transactions[type].forEach((item) => {
                    const itemDate = new Date(item.date);
                    if (itemDate < windowStart) {
                        const amt = budgetsAmountNum(item.amount);
                        if (type === "Money") baseBalance += amt;
                        else if (type === "Incomes") baseBalance += amt;
                        else if (type === "Expenses") baseBalance -= amt;
                    }
                });
            });
        }

        // توزیع تراکنش‌ها در آبجکت دیتا
        data_Type.forEach((type) => {
            if (!transactions[type]) return;

            transactions[type].forEach((item) => {
                let key;
                const itemDate = new Date(item.date);

                if (filterType === "daily" || filterType === "weekly" || filterType === "monthly") {
                    if (itemDate < windowStart || itemDate > windowEnd) return;
                    if (filterType === "daily") key = getDayKey(item.date);
                    else if (filterType === "weekly") key = getWeekKey(item.date);
                    else if (filterType === "monthly") key = getMonthKey(item.date);
                }
                else if (filterType === "yearly") {
                    if (itemDate < windowStart || itemDate > windowEnd) return;
                    key = item.date.split("-")[0];
                }

                if (!data[key]) return;

                data[key][type] += budgetsAmountNum(item.amount);
            });
        });

        const sortedData = Object.values(data).sort((a, b) => {
            if (filterType === "daily") {
                const dayNames = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
                return dayNames.indexOf(a.date) - dayNames.indexOf(b.date);
            }
            if (filterType === "weekly") {
                return a.date.localeCompare(b.date);
            }
            const dateA = new Date(a.date.length === 4 ? `${a.date}-01-01` : (a.date.length === 7 ? `${a.date}-01` : a.date));
            const dateB = new Date(b.date.length === 4 ? `${b.date}-01-01` : (b.date.length === 7 ? `${b.date}-01` : b.date));
            return dateA - dateB;
        });

        // فیلتر کردن دیتای ستون‌ها: فقط در حالت سالانه، سال‌های قبل از مقداردهیِ اولیه Money حذف می‌شوند
        let finalChartData = sortedData;
        if (filterType === "yearly") {
            finalChartData = sortedData.filter(period => {
                return Number(period.date) >= moneyStartDate.getFullYear();
            });
        }

        let runningBalance = baseBalance;
        finalChartData.forEach((period) => {
            runningBalance += (period.Money + period.Incomes - period.Expenses);
            period.Money = runningBalance;
        });

        return finalChartData;
    }

    const ChartData = useMemo(() => getChartData(chartTimeFilterType), [transactions, chartTimeFilterType, currentReferenceDate, moneyStartDate]);
    const MoneyChartData = useMemo(() => getChartData(moneyTimeFilterType), [transactions, moneyTimeFilterType, currentReferenceDate, moneyStartDate]);

    const formatTooltipLabel = (key, filterType) => {
        if (filterType === "daily") {
            const dayNames = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
            const dayIndex = dayNames.indexOf(key);
            const currentDay = currentReferenceDate.getDay();
            const daysToAdd = dayIndex - currentDay;
            const tooltipDate = new Date(currentReferenceDate);
            tooltipDate.setDate(tooltipDate.getDate() + daysToAdd);
            return `${key} - ${tooltipDate.toLocaleDateString("default", { month: "short", day: "numeric", year: "numeric" })}`;
        } else if (filterType === "weekly") {
            const weekNum = parseInt(key.split("-W")[1]);
            const firstWeekOfMonth = getWeekKey(new Date(currentReferenceDate.getFullYear(), currentReferenceDate.getMonth(), 1).toISOString().split("T")[0]);
            const firstWeekNum = parseInt(firstWeekOfMonth.split("-W")[1]);

            const weekIndex = weekNum - firstWeekNum;
            const start = weekIndex * 7 + 1;
            const end = Math.min(start + 6, new Date(currentReferenceDate.getFullYear(), currentReferenceDate.getMonth() + 1, 0).getDate());

            return `${currentReferenceDate.toLocaleString("default", { month: "short" })} - Week: ${start}-${end}`;
        } else if (filterType === "monthly") {
            const [year, month] = key.split("-");
            const date = new Date(year, month - 1);
            return date.toLocaleString("default", { month: "long", year: "numeric" });
        } else if (filterType === "yearly") {
            return `Year: ${key}`;
        } else {
            return key;
        }
    };

    const formatXAxis = (key, filterType) => {
        if (filterType === "daily") {
            return key.slice(0, 3);
        } else if (filterType === "weekly") {
            const weekNum = parseInt(key.split("-W")[1]);
            const firstWeekOfMonth = getWeekKey(new Date(currentReferenceDate.getFullYear(), currentReferenceDate.getMonth(), 1).toISOString().split("T")[0]);
            const firstWeekNum = parseInt(firstWeekOfMonth.split("-W")[1]);

            const weekIndex = weekNum - firstWeekNum;
            const start = weekIndex * 7 + 1;
            const end = Math.min(start + 6, new Date(currentReferenceDate.getFullYear(), currentReferenceDate.getMonth() + 1, 0).getDate());

            return `${start}-${end}`;
        } else if (filterType === "monthly") {
            const [year, month] = key.split("-");
            const date = new Date(year, month - 1);
            return date.toLocaleString("default", { month: "short" });
        } else if (filterType === "yearly") {
            return key;
        } else {
            return key;
        }
    };

    function getBudgetsChartData() {
        const budgetItems = transactions.Budgets.map((item) => ({
            name: item.category,
            value: budgetsAmountNum(item.amount),
            fill: item.color,
        }));

        const remaining = TransactionsCalculator.MonthlyBudget - TransactionsCalculator.Budgets;

        if (remaining > 0) {
            budgetItems.push({
                name: "Unallocated",
                value: remaining,
                fill: "rgb(136 136 136 / 0.47)",
                tooltipColor: "#7c7c7c",
            });
        }

        return budgetItems;
    }

    const BudgetsChartData = useMemo(
        () => getBudgetsChartData(),
        [transactions.Budgets, TransactionsCalculator.MonthlyBudget, TransactionsCalculator.Budgets]
    );

    const CustomBudgetsTooltip = ({ active, payload }) => {
        if (!active || !payload || !payload.length) return null;

        const data = payload[0].payload;
        const isUnallocated = data.name === "Unallocated";
        const dotColor = isUnallocated ? data.tooltipColor : data.fill;

        return (
            <div style={{
                backgroundColor: "#ffffff",
                border: "1px solid rgb(187 187 187 / 0.65)",
                borderRadius: "0.6rem",
                boxShadow: "3px 3px 10px rgb(197 197 197 / 0.2)",
                padding: "0.6rem 0.8rem",
                fontSize: "1rem",
                fontFamily: "DM Sans, sans-serif",
            }}>
                <p style={{
                    fontWeight: "800",
                    marginBottom: "0.3rem",
                    color: isUnallocated ? "#2a2a2a" : data.fill,
                    display: "flex",
                    alignItems: "center",
                    gap: "0.4rem",
                }}>
                    <span style={{
                        width: "10px",
                        height: "10px",
                        borderRadius: "50%",
                        backgroundColor: dotColor,
                        display: "inline-block",
                        flexShrink: 0,
                    }} />
                    {data.name}
                </p>
                <p style={{ fontSize: "0.9rem", color: "#666" }}>
                    {data.value.toLocaleString("en-US")}
                </p>
            </div>
        );
    };

    return (
        <div className="charts">
            <ul className="charts__type">
                {types.map((type) => {
                    const active = type === chart_type;
                    return (
                        <li
                            key={type}
                            className={`charts__type-label charts__type-label--${type.toLowerCase().replaceAll("/", "_")}${active ? "-active" : ""}`}
                            onClick={() => {
                                setChart_type(type);
                                setCurrentReferenceDate(new Date());
                            }}
                        >
                            {type}
                        </li>
                    );
                })}
            </ul>
            <div className="charts__chart">

                <div className="chart__options">
                    {chart_type === "Incomes/Expenses" && (
                        <ul className="chart__TimeFilters" style={{ margin: 0 }}>
                            {chartTimeFilterOptions.map((filter) => {
                                const active = filter === chartTimeFilterType;
                                return (
                                    <li
                                        key={filter}
                                        className={`chart__TimeFilters-label chart__TimeFilters-label--${active ? "active" : ""}`}
                                        onClick={() => {
                                            setChartTimeFilterType(filter);
                                            setCurrentReferenceDate(new Date());
                                        }}
                                    >
                                        {filter.slice(0, 1).toUpperCase()}
                                    </li>
                                );
                            })}
                        </ul>
                    )}

                    {chart_type === "Money" && (
                        <ul className="chart__TimeFilters" style={{ margin: 0 }}>
                            {moneyTimeFilterOptions.map((filter) => {
                                const active = filter === moneyTimeFilterType;
                                return (
                                    <li
                                        key={filter}
                                        className={`chart__TimeFilters-label chart__TimeFilters-label--${active ? "active" : ""}`}
                                        onClick={() => {
                                            setMoneyTimeFilterType(filter);
                                            setCurrentReferenceDate(new Date());
                                        }}
                                    >
                                        {filter.slice(0, 1).toUpperCase()}
                                    </li>
                                );
                            })}
                        </ul>
                    )}

                    {chart_type !== "Budgets" && (
                        <div className="chart__navigation">
                            <button
                                className={"chart__navigation-btn"}
                                onClick={() => handleNavigate("prev")}
                                disabled={!canGoBack}
                                style={{
                                    cursor: canGoBack ? 'pointer' : 'not-allowed',
                                    opacity: canGoBack ? 1 : 0.4,
                                }}
                            >
                                {<BackArrow />}
                            </button>
                            <button
                                className={"chart__navigation-btn"}
                                onClick={() => handleNavigate("next")}
                                disabled={!canGoForward}
                                style={{
                                    cursor: canGoForward ? 'pointer' : 'not-allowed',
                                    opacity: canGoForward ? 1 : 0.4,
                                }}
                            >
                                {<ForwardArrow />}
                            </button>
                        </div>
                    )}
                </div>

                {chart_type === "Incomes/Expenses" ? (
                    <ResponsiveContainer width="100%" height="100%">
                        <ComposedChart data={ChartData} responsive>
                            <XAxis dataKey="date" tickFormatter={(key) => formatXAxis(key, chartTimeFilterType)} tick={{ fontSize: 12 }} />
                            <YAxis yAxisId="left" hide />
                            <YAxis yAxisId="right" orientation="right" hide />
                            <Tooltip
                                cursor={{ stroke: 'transparent', strokeWidth: 0, fill: 'transparent' }}
                                labelFormatter={(key) => formatTooltipLabel(key, chartTimeFilterType)}
                            />
                            <Legend iconType="circle" wrapperStyle={{
                                fontSize: "14px",
                                fontFamily: "Vazirmatn, sans-serif",
                            }} />
                            <Bar yAxisId="left" dataKey="Expenses" fill="red" radius={[5, 5, 0, 0]} barSize={20} activeBar={false} />
                            <Bar yAxisId="left" dataKey="Incomes" fill="green" radius={[5, 5, 0, 0]} barSize={20} activeBar={false} />
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
                                    cy="50%"
                                    outerRadius="65%"
                                    innerRadius="40%"
                                    paddingAngle={2}
                                    label={({ percent }) => ` ${(percent * 100).toFixed(0)}%`}
                                    labelLine={false}
                                />
                                <Tooltip
                                    cursor={{ stroke: 'transparent', strokeWidth: 0, fill: 'transparent' }}
                                    content={<CustomBudgetsTooltip />}
                                />
                                <Legend
                                    iconType="circle"
                                    wrapperStyle={{
                                        fontSize: "10px",
                                        fontFamily: "Vazirmatn, sans-serif",
                                        marginTop: "1rem",
                                    }}
                                />
                            </PieChart>
                        </ResponsiveContainer>
                    )
                ) : null}

                {chart_type === "Money" ? (
                    <ResponsiveContainer width="100%" height="100%">
                        <ComposedChart data={MoneyChartData} responsive>
                            <XAxis dataKey="date" tickFormatter={(key) => formatXAxis(key, moneyTimeFilterType)} tick={{ fontSize: 12 }} />
                            <YAxis yAxisId="left" hide />
                            <Tooltip
                                cursor={{ stroke: 'transparent', strokeWidth: 0, fill: 'transparent' }}
                                labelFormatter={(key) => formatTooltipLabel(key, moneyTimeFilterType)}
                            />
                            <Legend iconType="circle" wrapperStyle={{
                                fontSize: "14px",
                                fontFamily: "Vazirmatn, sans-serif",
                            }} />
                            <Area
                                yAxisId="left"
                                type="monotone"
                                dataKey="Money"
                                stroke="rgb(225 152 16)"
                                fill="rgb(255 222 0 / 0.52)"
                                strokeWidth={2}
                                dot={{ r: 3 }}
                                activeDot={{ r: 4 }}
                            />
                        </ComposedChart>
                    </ResponsiveContainer>
                ) : null}
            </div>
        </div>
    );
}