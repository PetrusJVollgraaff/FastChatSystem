from datetime import datetime, timedelta
from jose import jwt, JWTError
from fastapi import Depends, HTTPException, status
from sqlmodel import select
from fastapi.security import OAuth2PasswordBearer
from ..DB.db import get_session
from ..models.usersModel import Users


# Config
SECRET_KEY = "CHANGE_THIS_SECRET"  # in production, use os.getenv("SECRET_KEY")
ALGORITHM = "HS256"
ACCESS_TOKEN_EXPIRE_MINUTES = 60 * 24  # 1 day