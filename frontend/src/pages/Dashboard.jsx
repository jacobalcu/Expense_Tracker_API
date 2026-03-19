import { useState, useEffect, useContext } from "react";
import axios from "axios";
import { AuthContext } from "../context/AuthContext";

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

  return (
    <div className="dashboard-container">
      <h1>Expense Dashboard</h1>
      <p>Check your console to see if the data arrived!</p>
      <form onSubmit={handleSubmit}>
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
        <button type="submit">Enter Expense</button>
      </form>
    </div>
  );
}
