from fastapi import APIRouter, HTTPException, Depends
from sqlalchemy.orm import Session
from app.schemas.expense import ExpenseResponse, ExpenseCreate, ExpenseUpdate
from app.crud import crud_expense
from app.db.database import get_db
from jose import jwt, JWTError
from app.api.auth import get_current_user_id
from datetime import datetime
from typing import Optional

router = APIRouter()

# Will prefix w/ /expenses in main.py
@router.post("/", response_model=ExpenseResponse)
def create_expense(expense: ExpenseCreate, db: Session = Depends(get_db), user_id: str = Depends(get_current_user_id)):
    # Use crud_expense to create new expense and return result
    new_expense = crud_expense.create_expense(db, expense, user_id)

    return new_expense

# FastAPI will look for start_date and end_date in the URL string since they are optional
# Example request from the frontend (GET /expenses?start_date=2024-01-01)
@router.get("/", response_model=list[ExpenseResponse])
def get_expenses(start_date: Optional[datetime], end_date: Optional[datetime], db: Session = Depends(get_db), user_id: str = Depends(get_current_user_id)):
    expenses = crud_expense.get_expenses(db=db, user_id=user_id, start_date=start_date, end_date = end_date)

    return expenses

# FastAPI auto maps expense_id from url to parameter
@router.delete("/{expense_id}")
def delete_expense(expense_id: str, db: Session = Depends(get_db), user_id: str = Depends(get_current_user_id)):
    expense = crud_expense.get_expense_by_id(db, expense_id, user_id)
    if not expense:
        raise HTTPException(status_code=404, detail="Expense not found")
    
    crud_expense.delete_expense(db, expense)

    return {"message":"Expense deleted successfully"}

# Route for updating an expense
@router.put("/{expense_id}", response_model=ExpenseResponse)
def update_expense(expense_id: str, expense_update: ExpenseUpdate, db: Session = Depends(get_db), user_id: str = Depends(get_current_user_id)):
    expense = crud_expense.get_expense_by_id(db, expense_id, user_id)
    if not expense:
        raise HTTPException(status_code=404, detail="Expense not found")

    updated_expense = crud_expense.update_expense(db, expense, expense_update)

    return updated_expense


