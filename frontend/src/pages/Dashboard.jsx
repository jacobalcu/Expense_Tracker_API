import { useState, useEffect, useContext } from "react";
import axios from "axios";
import { AuthContext } from "../context/AuthContext";
import ExpenseCard from "../components/ExpenseCard";
import "../Dashboard.css";
import Navbar from "../components/Navbar";

export default function Dashboard() {
  // 1. A state variable to hold the list of expenses from the database
  const [expenses, setExpenses] = useState([]);

  const [amount, setAmount] = useState(0);
  const [category, setCategory] = useState("Groceries");
  const [description, setDescription] = useState("");
  const [date, setDate] = useState("");

  // 2. Grab the VIP wristband from your radio tower
  const { token } = useContext(AuthContext);

  // 3. The useEffect hook runs automatically when the component loads
  useEffect(() => {
    const fetchExpenses = async () => {
      try {
        // 4. The Authenticated Axios Request
        const response = await axios.get("http://localhost:8000/expenses/", {
          headers: {
            Authorization: `Bearer ${token}`, // Showing the bouncer the wristband!
          },
        });

        // 5. Save the data to our React state
        console.log("Fetched expenses:", response.data);
        setExpenses(response.data);
      } catch (error) {
        console.error(
          "Failed to fetch expenses:",
          error.response?.data?.detail,
        );
      }
    };

    // Only try to fetch if we actually have a token
    if (token) {
      fetchExpenses();
    }
  }, [token]); // This array tells React to re-run the effect if the token ever changes

  const handleDelete = async (expense_id) => {
    try {
      await axios.delete(
        // Have to Inject the ID directly into the URL string
        `http://localhost:8000/expenses/${expense_id}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        },
      );
      setExpenses(expenses.filter((exp) => exp.id !== expense_id));
      console.log("Successfully deleted the expense:", expense_id);
    } catch (error) {
      console.error("Failed to delete:".error);
    }
  };
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      console.log("Current expenses state:", expenses);

      const expense = await axios.post(
        "http://localhost:8000/expenses/",
        {
          amount: amount,
          category: category,
          description: description,
          expense_date: date,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`, // Showing the bouncer the wristband!
          },
        },
      );
      console.log("Success! Expense added to the database.");

      setExpenses([...expenses, expense.data]);
      // Optional: Clear the form out after a success!
      setAmount(0);
      setDescription("");
      setDate("");
    } catch (error) {
      console.error("Failed to add expense:", error.response?.data?.detail);
    }
  };

  // Loops over all expenses, adding currentExpense.amount to sum
  const totalExpenses = expenses.reduce((sum, currentExpense) => {
    return sum + parseFloat(currentExpense.amount);
  }, 0); // 0 is starting point of sum

  return (
    <div className="dashboard-container">
      <Navbar />
      <h1>Expense Dashboard</h1>
      <p className="subtitle">Check your console to see if the data arrived!</p>
      <form className="expense-form" onSubmit={handleSubmit}>
        <label htmlFor="amount">
          Amount:
          <input
            onChange={(e) => setAmount(e.target.value)}
            value={amount}
            id="amount"
            name="amount"
            type="number"
          />
        </label>
        <label htmlFor="description">
          Description:
          <input
            onChange={(e) => setDescription(e.target.value)}
            value={description}
            id="description"
            name="description"
            type="text"
          />
        </label>
        <label htmlFor="category">
          Category:
          <select
            name="category"
            id="category"
            onChange={(e) => setCategory(e.target.value)}
            value={category}
          >
            <option value="Groceries">Groceries</option>
            <option value="Leisure">Leisure</option>
            <option value="Electronics">Electronics</option>
            <option value="Utilities">Utilities</option>
            <option value="Clothing">Clothing</option>
            <option value="Health">Health</option>
            <option value="Other">Other</option>
          </select>
        </label>
        <label htmlFor="date">
          Date:
          <input
            onChange={(e) => setDate(e.target.value)}
            value={date}
            id="date"
            name="date"
            type="date"
          />
        </label>
        <button className="submit-btn" type="submit">
          Enter Expense
        </button>
      </form>
      <div className="analytics-banner">
        <h2>Total Spent: ${totalExpenses.toFixed(2)}</h2>
      </div>
      <div className="expense-list">
        <h2>Your Expenses</h2>
        {expenses.map((expense) => (
          <ExpenseCard
            key={expense.id}
            expense={expense}
            deleteFunc={handleDelete}
          />
        ))}
      </div>
    </div>
  );
}
