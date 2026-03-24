import { useState, useEffect, useContext, use } from "react";
import { AuthContext } from "../context/AuthContext";
import ExpenseCard from "../components/ExpenseCard";
import "../Dashboard.css";
import Navbar from "../components/Navbar";
import ExpenseForm from "../components/ExpenseForm";
import useExpenses from "../hooks/useExpenses";

export default function Dashboard() {
  // Secondary array for filtered expenses
  const [filterCategory, setFilterCategory] = useState("All");

  // Derived state for sorting
  const [sortOrder, setSortOrder] = useState("Date (Newest)");

  // 2. Grab the VIP wristband from your radio tower
  const { token } = useContext(AuthContext);

  // Grab the data and functions from custom hook
  const {
    expenses,
    editingExpense,
    setEditingExpense,
    handleDelete,
    handleCreateOrUpdate,
  } = useExpenses(token);

  // Dumpts data into state vars to show on the form
  const handleEditClick = (expense) => {
    setEditingExpense(expense);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  // Calc on every render
  const filteredExpenses = expenses.filter((expense) => {
    if (filterCategory === "All") {
      return true; // Keep everything in new array
    } else {
      // Only keep exact match
      return expense.category === filterCategory;
    }
  });

  // Copy filtered list, copy, and sort
  const sortedAndFilteredExpenses = [...filteredExpenses].sort((a, b) => {
    if (sortOrder === "Amount (High to Low)") {
      return b.amount - a.amount;
    } else if (sortOrder === "Amount (Low to High)") {
      return a.amount - b.amount;
    } else if (sortOrder === "Date (Newest)") {
      return new Date(b.expense_date) - new Date(a.expense_date);
    } else if (sortOrder === "Date (Oldest)") {
      return new Date(a.expense_date) - new Date(b.expense_date);
    }
    return 0; // Default fallback
  });

  // Loops over all expenses, adding currentExpense.amount to sum
  const totalExpenses = filteredExpenses.reduce((sum, currentExpense) => {
    return sum + parseFloat(currentExpense.amount);
  }, 0); // 0 is starting point of sum

  return (
    <div className="dashboard-container">
      <Navbar />
      <h1>Expense Dashboard</h1>
      <p className="subtitle">Track your spending</p>
      <ExpenseForm
        onSubmitForm={handleCreateOrUpdate}
        editingExpense={editingExpense}
      />

      <div className="analytics-banner">
        <div className="filter-controls">
          <select
            name="filter_category"
            id="filter_category"
            onChange={(e) => setFilterCategory(e.target.value)}
            value={filterCategory}
          >
            <option value="All">All Categories</option>
            <option value="Groceries">Groceries</option>
            <option value="Leisure">Leisure</option>
            <option value="Electronics">Electronics</option>
            <option value="Utilities">Utilities</option>
            <option value="Clothing">Clothing</option>
            <option value="Health">Health</option>
            <option value="Other">Other</option>
          </select>
          <select
            value={sortOrder}
            onChange={(e) => setSortOrder(e.target.value)}
            style={{ marginLeft: "10px" }} // Just a little breathing room!
          >
            <option value="Date (Newest)">Date (Newest)</option>
            <option value="Date (Oldest)">Date (Oldest)</option>
            <option value="Amount (High to Low)">Amount (High to Low)</option>
            <option value="Amount (Low to High)">Amount (Low to High)</option>
          </select>
        </div>

        <h2>Total Spent: ${totalExpenses.toFixed(2)}</h2>
      </div>
      <div className="expense-list">
        <h2>Your Expenses</h2>
        {sortedAndFilteredExpenses.map((expense) => (
          <ExpenseCard
            key={expense.id}
            expense={expense}
            deleteFunc={handleDelete}
            editFunc={handleEditClick}
          />
        ))}
      </div>
    </div>
  );
}
