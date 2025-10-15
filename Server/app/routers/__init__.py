import json
from fastapi import APIRouter, Depends, HTTPException, Form
from sqlmodel import select
from typing import Annotated
from sqlalchemy import text
from sqlalchemy.orm import Session
from ..models.usersModel import Users, createUserAccount
from ..DB.db import get_session
from ..Auth.auth import create_token