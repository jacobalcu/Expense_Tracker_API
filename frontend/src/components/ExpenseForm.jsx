import { useState, useEffect } from "react";
import "../Dashboard.css";

export default function ExpenseForm({ onSubmitForm, editingExpense }) {
  const [amount, setAmount] = useState(0);
  const [category, setCategory] = useState("Groceries");
  const [description, setDescription] = useState("");
  const [date, setDate] = useState("");

  useEffect(() => {
    if (editingExpense) {
      setAmount(editingExpense.amount);
      setCategory(editingExpense.category);
      setDescription(editingExpense.description);
      setDate(editingExpense.expense_date);
    } else {
      setAmount(0);
      setCategory("Groceries");
      setDescription("");
      setDate("");
    }
  }, [editingExpense]);

  const handleSubmit = (e) => {
    e.preventDefault();

    const formData = {
      amount: amount,
      category: category,
      description: description,
      expense_date: date,
    };

    // Pass to upstream func in Dashboard.jsx
    onSubmitForm(formData);
  };

  return (
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
        {editingExpense ? "Update Expense" : "Create Expense"}
      </button>
    </form>
  );
}
