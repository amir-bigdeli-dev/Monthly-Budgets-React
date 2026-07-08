# Monthly Budgets React

A modern, interactive personal budget tracking application built with React and Vite. Manage your income, expenses, and monthly budgets with an intuitive interface featuring data visualization and real-time calculations.

## ✨ Features

- **Income Tracking** - Record and monitor all income sources (salary, gifts, investments, etc.)
- **Expense Management** - Track spending across customizable categories
- **Budget Planning** - Set budget limits for different spending categories with percentage allocation
- **Monthly Budget Overview** - Set and monitor your total monthly budget
- **Data Visualization** - View interactive charts for income, expenses, and budgets using Recharts
- **Transaction History** - View all transactions with quick access to logs
- **Category Management** - Create custom income and expense categories
- **Real-time Calculations** - Automatic calculations for remaining budget and spending percentages
- **Local Storage Persistence** - All data is saved locally in your browser
- **Quick Access Menu** - Floating action menu for quick transaction entry

## 🚀 Getting Started

### Prerequisites

- Node.js (v16 or higher recommended)
- npm or yarn package manager

### Installation

1. Clone the repository:
```bash
git clone https://github.com/amir-bigdeli-dev/Monthly-Budgets-React.git
cd Monthly-Budgets-React
```

2. Install dependencies:
```bash
npm install
```

3. Start the development server:
```bash
npm run dev
```

The application will be available at `http://localhost:5173`

## 📦 Available Scripts

- `npm run dev` - Start the development server with hot module replacement (HMR)
- `npm run build` - Build the application for production
- `npm run preview` - Preview the production build locally
- `npm run lint` - Run ESLint to check code quality
- `npm run format` - Format code using Prettier

## 🏗️ Project Structure

```
src/
├── App.jsx                 # Main application component
├── Header.jsx              # Header with summary statistics
├── Charts.jsx              # Data visualization component
├── Budgets.jsx             # Budget management section
├── QuickAccess.jsx         # Floating action menu
├── TransactionForm.jsx     # Form for adding/editing transactions
├── TransactionsLog.jsx     # Transaction history view
├── useTransactions.jsx     # Custom hook for transaction management
├── DataCalculator.js       # Business logic for calculations
├── ColorGenerator.js       # Utility for generating colors
├── priceFormater.jsx       # Utility for formatting prices
├── contexts.js             # React Context for state management
├── Style.css               # Application styles
└── assets/                 # Icons and images
```

## 🔧 Technologies

- **React 19** - UI library
- **Vite** - Build tool and development server
- **Recharts** - Data visualization library
- **React Select** - Custom select component
- **Prettier** - Code formatter
- **ESLint** - Code quality tool
- **SVG & PNG** - Icons for UI elements

## 💡 How to Use

### Adding Transactions

1. Click the **+** button in the bottom-right corner (Quick Access menu)
2. Select transaction type:
   - **Income** - Add income sources
   - **Money** - Track money amounts
   - **Expense** - Record spending
   - **Budget** - Set category budgets
   - **Monthly Budget** - Set overall monthly budget
3. Fill in the required details (amount, category, date)
4. Submit the form

### Managing Budgets

- Set a **Monthly Budget** to define your total spending limit
- Create **Category Budgets** to allocate portions to specific spending categories
- View automatic percentage calculations for budget allocation
- The app prevents exceeding your total monthly budget

### Viewing Data

- **Header** - Shows total money, incomes, and expenses at a glance
- **Charts** - View visual representations of your financial data
- **Budget List** - See all active budgets with edit/delete options
- **Transaction Logs** - Click on Income or Expense in the header to view detailed history

## 💾 Data Storage

All data is stored in your browser's **localStorage**:
- `transactions` - Stores all income, expenses, money, budgets, and monthly budgets
- `Categories` - Stores custom category options

Data persists between sessions and is never sent to a server.

## 🎨 Features in Detail

### Real-time Budget Calculations

The app automatically:
- Calculates remaining budget percentage
- Validates budget amounts don't exceed monthly limit
- Converts between percentage and amount values for budgets
- Updates totals as transactions are added/removed

### Currency Formatting

All amounts are automatically formatted with comma separators (e.g., "1,234.56") for better readability.

### Error Handling

- Prevents adding budgets that exceed the monthly limit
- Validates all form inputs before submission
- Shows clear error messages for invalid entries

## 🚦 Status Indicators

- **Monthly Budget Progress Bar** - Visual indicator of budget usage
- **Category Budget Lists** - Shows percentage allocation for each budget
- **Color-coded Categories** - Budgets are assigned unique colors for easy identification

## 📱 Responsive Design

The application is designed to work on various screen sizes with a responsive layout that adapts to mobile, tablet, and desktop views.

## 🤝 Contributing

Contributions are welcome! Feel free to submit issues or pull requests to improve the application.

## 📄 License

This project is open source and available under the MIT License.

## 📧 Support

For issues, questions, or suggestions, please open an issue on the GitHub repository.

---

**Happy budgeting! 💰**
