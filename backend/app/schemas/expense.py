from pydantic import BaseModel
from app.models.expense import Category
from datetime import datetime
from decimal import Decimal

# Parent class containing shared fields
class ExpenseBase(BaseModel):
    amount: Decimal
    category: Category
    # Description can be string or None, def to None
    description: str | None = None
    expense_date: datetime

class ExpenseCreate(ExpenseBase):
    # No extra fields but following DRY principles
    pass

class ExpenseResponse(ExpenseBase):
    id: str
    user_id: str
    # allow to read data straight from SQLAlchemy
    model_config= {"from_attributes":True}

# Every field is optional
class ExpenseSchema(BaseModel):
    amount: Decimal | None = None
    category: Category | None = None
    description: str | None = None
    expense_date: datetime | None = None
