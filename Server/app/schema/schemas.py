from pydantic import BaseModel
from datetime import datetime
from typing import Optional

class UserCreate(BaseModel):
    username: str
    password: str
    confirmpassword: str

class UserLogin(BaseModel):
    username: str
    password: str
    
class UserRead(BaseModel):
    id: int
    username: str

class Token(BaseModel):
    access_token: str
    token_type: str = "bearer"

class MessageRead(BaseModel):
    id: int
    username: str
    content: str
    created_at: datetime