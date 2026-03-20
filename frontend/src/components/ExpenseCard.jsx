export default function ExpenseCard({ expense, deleteFunc }) {
  // { expense } unpacks the Prop passed from the Dashboard

  return (
    <div className="expense-card">
      <div className="expense-header">
        {/* We can grab specific fields directly from expense object */}
        <h3>{expense.category}</h3>
        <strong className="expense-amount">${expense.amount}</strong>
      </div>
      <div className="expense-body">
        <div>
          <p className="expense-description">{expense.description}</p>
          {/* Format database timestamp into clean local date */}
          <small className="expense-date">
            {new Date(expense.expense_date).toLocaleDateString()}
          </small>
        </div>

        <button className="delete-btn" onClick={() => deleteFunc(expense.id)}>
          Delete Expense
        </button>
      </div>
    </div>
  );
}
