const budgetsAmountNum = (item) => Number(item.replace(/[^0-9]/g, ""));

export default function sortItems(items, sortBy) {
 return [...items].sort((a, b) => {
     if(sortBy === "Date") {
         return new Date(b.date) - new Date(a.date);
     } else if(sortBy === "Amount") {
         return budgetsAmountNum(b.amount) - budgetsAmountNum(a.amount);
     } else if(sortBy === "Category") {
         return a.category?.localeCompare(b.category);
     }
 })
}