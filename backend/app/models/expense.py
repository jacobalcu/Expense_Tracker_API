from sqlalchemy import Column, String, ForeignKey, Numeric, DateTime
# Import Enum as alias to avoid confusion
from sqlalchemy import Enum as SQLEnum
from app.db.database import Base
from app.models.user import User
from uuid import uuid4
import enum

class Category(enum.Enum):
    GROCERIES = "Groceries"
    LEISURE = "Leisure"
    ELECTRONICS = "Electronics"
    UTILITIES = "Utilities"
    CLOTHING = "Clothing"
    HEALTH = "Health"
    OTHER = "Other"

class Expense(Base):
    __tablename__ = 'expenses'
    id = Column(String, primary_key=True, default=lambda: str(uuid4()))
    # Foreign key looks for database table name, not Python class name
    user_id = Column(String, ForeignKey("users.id"), index=True)
    # Precision 10 digits total, 2 decimal places
    amount = Column(Numeric(10, 2))
    category = Column(SQLEnum(Category))
    description = Column(String)
    expense_date = Column(DateTime)
