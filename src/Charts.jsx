import { useContext, useState , useMemo } from "react";
import { Legend, BarChart, XAxis, ResponsiveContainer, Bar, Tooltip } from 'recharts';
import TransActionsContext from "./contexts.js";

export default function Charts() {
    const types = ["Budgets","Incomes/Expenses","Money"];
    const [chart_type, setChart_type] = useState("Incomes/Expenses");
    const budgetsAmountNum = (item) => (Number(item.replace(/[^0-9]/g,"")))
    const {transactions} = useContext(TransActionsContext);
    const [chartTimeFilterType,setChartTimeFilterType] = useState("weekly");
    const chartTimeFilterOptions = ["weekly","monthly","yearly"];
    
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

    // get Data for chart Incomes/Expenses
    function getChartData() {
        const data = {};
        const data_Type = ["Incomes", "Expenses", "Money"];
        const now = new Date();
        const currentYear = now.getFullYear();
        
        if (chartTimeFilterType === "weekly") {
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
        }else if (chartTimeFilterType === "yearly") {
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
                if (chartTimeFilterType === "weekly") key = getWeekKey(item.date);
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

        return Object.values(data).sort((a, b) => {
            if (chartTimeFilterType === "weekly") {
                return a.date.localeCompare(b.date);
            }
            const dateA = new Date(a.date.length === 4 ? `${a.date}-01-01` : (a.date.length === 7 ? `${a.date}-01` : a.date));
            const dateB = new Date(b.date.length === 4 ? `${b.date}-01-01` : (b.date.length === 7 ? `${b.date}-01` : b.date));
            return dateA - dateB;
        });
    }

    const ChartData = useMemo(() => getChartData(), [transactions, chartTimeFilterType]);
    // ##################
    
    // get Data for chart Budgets
    function getBudgetsChartData(){
        const data = {};

        transactions.Budgets.forEach((item) => {
            data[item.category] = {category: item.category, Budget: budgetsAmountNum(item.amount)}
            
        })

        return data;
    }
    
    const BudgetsChartData = getBudgetsChartData();
    console.log(ChartData,BudgetsChartData)
    // ############

    const formatXAxis = (key) => {
        if (chartTimeFilterType === "weekly") {
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
          {chart_type === "Incomes/Expenses" ? (
        <ResponsiveContainer width="100%" height="100%">
          <BarChart  data={ChartData} responsive >
            <XAxis dataKey="date" tickFormatter={formatXAxis} tick={{fontSize:12}} />
            {/*<YAxis width="auto"  />*/}
              <Tooltip cursor={{ stroke: 'transparent', strokeWidth: 0, fill: 'transparent' }} labelFormatter={formatXAxis}/>
              <Legend iconType="circle" wrapperStyle={{
                  fontSize: "14px",
                  fontFamily: "Vazirmatn, sans-serif",
              }} />
              <Bar dataKey="Expenses" fill="red" radius={[5,5,0,0]} barSize={20} activeBar={false}/>
              <Bar dataKey="Incomes" fill="green" radius={[5,5,0,0]} barSize={20} activeBar={false}/>
          </BarChart>
        </ResponsiveContainer>
              ) : null}
      </div>
    </div>
  );
}
