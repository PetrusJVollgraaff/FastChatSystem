import os
from fastapi import FastAPI, WebSocket, WebSocketDisconnect, Form
from fastapi.middleware.cors import CORSMiddleware
from .Socket_Manager.socket import ConnectionManager
from typing import List, Annotated
from .DB.db import init_db
from .routers import auth



# Config
SECRET_KEY = "CHANGE_THIS_SECRET"  # in production, use os.getenv("SECRET_KEY")
ALGORITHM = "HS256"
ACCESS_TOKEN_EXPIRE_MINUTES = 60 * 24  # 1 day