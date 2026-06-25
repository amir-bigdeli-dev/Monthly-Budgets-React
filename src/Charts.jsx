import { useContext, useState } from "react";
import {CartesianGrid, Legend, Line, LineChart, BarChart, XAxis, YAxis, ResponsiveContainer, Bar,Tooltip} from 'recharts';
import TransActionsContext from "./contexts.js";

export default function Charts({ types, type_label }) {
  const [chart_type, setChart_type] = useState("Incomes");
    const budgetsAmountNum = (item) => (Number(item.replace(/[^0-9]/g,"")))
    const {transactions} = useContext(TransActionsContext);
  types = types.filter((type) => type !== "MonthlyBudget");

    const getWeekNumber = (dateString) => {
        const date = new Date(dateString);
        const startOfYear = new Date(date.getFullYear(), 0, 1);
        const pastDaysOfYear = (date - startOfYear) / 86400000;
        return Math.ceil((pastDaysOfYear + startOfYear.getDay() + 1) / 7);
    };

    function getChartData(){
      const data = {}
        const data_Type = ["Incomes","Expenses","Money"]
        data_Type.forEach((type) => {
            transactions[type].forEach((item) => {
                if(!data[item.date]) data[item.date] = {date: item.date, Incomes:0, Expenses:0, Money:0}
                data[item.date][type] += budgetsAmountNum(item.amount)
            })
        })

        return Object.values(data).sort((a,b) => new Date(a.date) - new Date(b.date))
    }
 
    const ChartData = getChartData();

    function getBudgetsChartData(){
        const data = {};

        transactions.Budgets.forEach((item) => {
            data[item.category] = {category: item.category, Budget: budgetsAmountNum(item.amount)}
            
        })

        return data;
    }
    
    const BudgetsChartData = getBudgetsChartData();
    console.log(ChartData,BudgetsChartData)

    const formatXAxis = (dateString) => {
        if (!dateString) return "";

        const date = new Date(dateString);

        if (isNaN(date.getTime())) return dateString;

        const month = date.getMonth() + 1;
        const day = date.getDate();

        return `${month}/${day}`; 
    };
  return (
    <div className="charts">
      <ul className="charts__type">
        {types.map((type) => {
          const active = type === chart_type;
          return (
            <li
              key={type}
              className={`charts__type-label charts__type-label--${type.toLowerCase()}${active ? "-active" : ""}`}
              onClick={() => setChart_type(type)}
            >
              {type_label[type]}
            </li>
          );
        })}
      </ul>
      <div className="charts__chart">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart  data={ChartData} responsive >
            <XAxis dataKey="date" tickFormatter={formatXAxis} tick={{fontSize:12}} />
            {/*<YAxis width="auto"  />*/}
              <Tooltip />
              <Legend />
              <Bar dataKey="Expenses" fill="red" radius={[5,5,0,0]} barSize={20} />
              <Bar dataKey="Incomes" fill="green" radius={[5,5,0,0]} barSize={20}/>
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
