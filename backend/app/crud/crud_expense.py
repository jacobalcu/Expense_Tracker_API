# This file holds reusable db functions for expenses
from sqlalchemy.orm import Session
from app.models.expense import Expense
from app.schemas.expense import ExpenseCreate, ExpenseUpdate
from datetime import datetime
from typing import Optional

def create_expense(db: Session, expense: ExpenseCreate, user_id: str):
    # 1: Create a new instance of the SQLAlchemy 'Expense' model
    new_expense = Expense(
        user_id = user_id,
        **expense.model_dump() # auto unpacks amount, category, etc.
    )
    # 2: Add, commit, and refresh the session
    db.add(new_expense)
    db.commit()
    # Will add all db fields, s.a. id
    db.refresh(new_expense)
    # 3: Return the newly created database expense
    return new_expense

def get_expenses(db: Session, user_id: str, start_date: Optional[datetime], end_date: Optional[datetime]):
    expenses = db.query(Expense).filter(Expense.user_id == user_id)

    # Returns list of all user expenses
    if start_date:
        expenses = expenses.filter(Expense.expense_date >= start_date)
    
    if end_date:
        expenses = expenses.filter(Expense.expense_date <= end_date)

    # all() extracts the actual data from the Query object
    return expenses.all()

# Look up a single expense by its ID and User ID
def get_expense_by_id(db: Session, expense_id: str, user_id: str):
    expenses = db.query(Expense).filter(Expense.id == expense_id).filter(Expense.user_id == user_id)

    return expenses.first()

# Function to delete an expense, only if user owns it
# The route will call get_expense_by_id, if it returns a valid expense, 
# Passes it to delete_expense
def delete_expense(db: Session, expense: Expense):
    db.delete(expense)
    db.commit()

# Take a dictionary of new values, update fields, commit changes, refresh object
def update_expense(db: Session, db_expense: Expense, expense_update: ExpenseUpdate):
    # Use exclude_unset=True on .model_dump()
    update_data = expense_update.model_dump(exclude_unset=True)
   
    for key, value in update_data.items():
        # db_expense.key = value won't work
        # will look for column named key
        setattr(db_expense, key, value)
    
    db.commit()
    db.refresh(db_expense)

    # No need for .first() since it's a single object
    return db_expense
