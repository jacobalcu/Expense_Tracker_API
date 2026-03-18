# File to hold user DB operations
from sqlalchemy.orm import Session
from app.models.user import User
from app.schemas.user import UserCreate, UserResponse
from app.core.security import get_password_hash

def get_user_by_email(db: Session, email: str):
    # Select * FROM users
    # WHERE user.email == {email}
    # Returns list of potential matches (even though should only have 1 match)
    users = db.query(User).filter(User.email == email)

    return users.first()

def create_user(db: Session, user: UserCreate):
    raw_pass = user.password
    hashed_password = get_password_hash(raw_pass)
    new_user = User(email=user.email, hashed_password = hashed_password)
    db.add(new_user)
    db.commit()
    # Update new_user with any new data
    # Which will be id and created_at
    db.refresh(new_user)
    return new_user

