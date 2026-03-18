from pydantic import BaseModel, EmailStr
from datetime import datetime

# For incoming data during signup
class UserCreate(BaseModel):
    # Only need email and password because that is what
    # the user will be passing in on signup
    # This keeps our id and created_at fields protected
    email: EmailStr
    password: str



# For outgoing data
class UserResponse(BaseModel):
    id: str
    email: str
    created_at: datetime
    # allow to read data straight from SQLAlchemy
    model_config = {"from_attributes":True}

