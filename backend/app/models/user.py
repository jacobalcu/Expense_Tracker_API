from app.db.database import Base
from sqlalchemy import Column, String, DateTime, func
from uuid import uuid4

class User(Base):
    __tablename__ = 'users'
    # Store UUID as string, generate new by default
    id = Column(String, primary_key=True, default=lambda: str(uuid4()))
    # Store email as unique string, indexed for fast lookup
    email = Column(String, unique=True, index=True)
    hashed_password = Column(String)
    # Automatically get current DB timestamp
    created_at = Column(DateTime, default=func.now())
