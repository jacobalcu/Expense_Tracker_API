# The FastAPI application instance
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.api import auth, expenses
from app.db.database import engine, Base

# Create db tables
Base.metadata.create_all(bind=engine)

app = FastAPI(title="Expense Tracker API")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials = True,
    allow_methods=["*"], # allows GET, POST, PUT, DELETE, etc
    allow_headers=["*"], # Allows all headers (like our Authorization header)
)

# Prefix appends /auth to all routes in auth.
# So /signup is actually /auth/signup
app.include_router(auth.router, prefix="/auth", tags=["Authentication"])
app.include_router(expenses.router, prefix="/expenses", tags=["Expenses"])

@app.get("/")
def read_root():
    return {"message": "Welcome to the Expense Tracker API"}