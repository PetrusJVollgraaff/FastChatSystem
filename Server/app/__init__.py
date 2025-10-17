import os
from sqlmodel import select
from fastapi import FastAPI, WebSocket, WebSocketDisconnect, Form, Depends
from fastapi.middleware.cors import CORSMiddleware
from .Socket_Manager.socket import ConnectionManager
from typing import List, Annotated
#from .models.usersModel import Users
from .DB.db import init_db, get_session
from .routers.auth import route as authrouter
from .routers.search import route as searchrouter
from .routers.user import route as userrouter





# Config
SECRET_KEY = "CHANGE_THIS_SECRET"  # in production, use os.getenv("SECRET_KEY")
ALGORITHM = "HS256"
ACCESS_TOKEN_EXPIRE_MINUTES = 60 * 24  # 1 day

