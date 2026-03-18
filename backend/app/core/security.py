# Home of security utility functions
from datetime import datetime, timedelta
from jose import jwt
from passlib.context import CryptContext

# Setup Password Hashing
pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")

def verify_password(plain_pwd, hashed_pwd):
    return pwd_context.verify(plain_pwd, hashed_pwd)

def get_password_hash(password):
    return pwd_context.hash(password)

# Setup JWT Generation
# In prod, NEVER hardcode. Load from .env file
SECRET_KEY = "your-super-secret-long-string-that-nobody-knows"
ALGORITHM = "HS256"
ACCESS_TOKEN_EXPIRE_MINUTES = 30

def create_access_token(data: dict):
    to_encode = data.copy()

    # Add exp time to payload
    expire = datetime.utcnow() + timedelta(minutes=ACCESS_TOKEN_EXPIRE_MINUTES)
    to_encode.update({"exp": expire})

    # Mint the token
    encoded_jwt = jwt.encode(to_encode, SECRET_KEY, algorithm=ALGORITHM)
    return encoded_jwt