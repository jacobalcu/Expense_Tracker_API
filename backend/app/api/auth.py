from fastapi import APIRouter, HTTPException, Depends
from fastapi.security import OAuth2PasswordBearer
from sqlalchemy.orm import Session
from app.schemas.user import UserResponse, UserCreate
from app.crud import crud_user
from app.db.database import get_db
from app.core.security import verify_password, create_access_token, SECRET_KEY, ALGORITHM
from jose import jwt, JWTError


# app is in main.py, we will tie router back to main app later
router = APIRouter()

# FastAPI will take the user model that is returned and pass thru
# UserResponse
@router.post("/signup", response_model=UserResponse)
def signup(user: UserCreate, db: Session = Depends(get_db)):
    # 1) Check if user w/ email already exists
    try_user = crud_user.get_user_by_email(db, user.email)
    # 2) If they do, raise HTTPException w/ status_code=400
    if try_user:
        raise HTTPException(status_code=400,detail="User already exists")
    # 3) If not, create user
    new_user = crud_user.create_user(db, user)
    
    # 4) Return newly created user
    return new_user

@router.post("/login")
def login(user: UserCreate, db: Session = Depends(get_db)):
    # 1) Check if user w/ email exists
    try_user = crud_user.get_user_by_email(db, user.email)
    # 2) If they don't, raise HTTPException w/ status_code=400
    if not try_user:
        raise HTTPException(status_code=401,detail="Incorrect email or password")
    
    # Check if passwords match
    if not verify_password(user.password, try_user.hashed_password):
        raise HTTPException(status_code=401,detail="Incorrect email or password")

    access_token = create_access_token({"sub": str(try_user.id)})

    return {
        "access_token": access_token,
        "token_type": "bearer"
    }


# Tells FastAPI to look for token in "Authorization" header
oauth2_scheme = OAuth2PasswordBearer(tokenUrl="auth/login")

def get_current_user_id(token: str = Depends(oauth2_scheme)):
    try:
        # Decode the token using our secret key
        payload = jwt.decode(token, SECRET_KEY, algorithms=[ALGORITHM])

        # Extract user ID (stored under "sub")
        user_id: str = payload.get("sub")

        if user_id is None:
            raise HTTPException(status_code=401, detail="Could not validate credentials")
        return user_id

    except JWTError:
        # If token is expired or tampered, jose throws JWTError
        raise HTTPException(status_code=401, detail="Could not validate credentials")