import { useState, useEffect } from "react";
import axios from "axios";

export default function useExpenses(token) {
  // Store expense and editingExpenses
  const [expenses, setExpenses] = useState([]);
  const [editingExpense, setEditingExpense] = useState(null);

  // Move useEffect that fetches data here
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

  // Move handleDelete here
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

  // Move handleCreateOrUpdate here
  const handleCreateOrUpdate = async (formData) => {
    try {
      if (editingExpense) {
        const response = await axios.put(
          `http://localhost:8000/expenses/${editingExpense.id}`,
          formData,
          { headers: { Authorization: `Bearer ${token}` } },
        );

        // Swap old expense out for newly updated in expenses
        setExpenses(
          expenses.map((exp) =>
            exp.id == editingExpense.id ? response.data : exp,
          ),
        );

        // Turn off edit mode
        setEditingExpense(null);
      } else {
        const response = await axios.post(
          "http://localhost:8000/expenses/",
          formData,
          {
            headers: {
              Authorization: `Bearer ${token}`, // Showing the bouncer the wristband!
            },
          },
        );
        setExpenses([...expenses, response.data]);
      }
    } catch (error) {
      console.error("Failed to add expense:", error);
    }
  };

  // Return everything the Dashboard will need
  return {
    expenses,
    editingExpense,
    setEditingExpense,
    handleDelete,
    handleCreateOrUpdate,
  };
}
