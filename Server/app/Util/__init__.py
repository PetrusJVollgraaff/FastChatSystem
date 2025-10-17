import os
from sqlmodel import select
from fastapi import FastAPI, WebSocket, WebSocketDisconnect, Form, Depends, HTTPException
from sqlalchemy import text
from fastapi.middleware.cors import CORSMiddleware
from typing import List, Annotated
from jose import jwt, JWTError

from ..Socket_Manager.socket import ConnectionManager
from ..models.usersModel import Users
from ..DB.db import init_db, get_session
from ..Auth.auth import SECRET_KEY, ALGORITHM
from ..routers import auth




# Config
SECRET_KEY = "CHANGE_THIS_SECRET"  # in production, use os.getenv("SECRET_KEY")
ALGORITHM = "HS256"
ACCESS_TOKEN_EXPIRE_MINUTES = 60 * 24  # 1 day