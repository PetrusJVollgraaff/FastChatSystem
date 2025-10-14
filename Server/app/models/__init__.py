from sqlalchemy import Column, Integer, String
from sqlalchemy.orm import declarative_base
from passlib.context import CryptContext

Base = declarative_base()

# Config
SECRET_KEY = "CHANGE_THIS_SECRET"  # in production, use os.getenv("SECRET_KEY")
ALGORITHM = "HS256"
ACCESS_TOKEN_EXPIRE_MINUTES = 60 * 24  # 1 day

pwd_context = CryptContext(schemes=["argon2"], deprecated="auto")

