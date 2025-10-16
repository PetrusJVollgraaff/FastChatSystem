import json
from fastapi import APIRouter, Depends, HTTPException, Form
from sqlmodel import select
from typing import Annotated
from sqlalchemy import text
from sqlalchemy.orm import Session
from ...models.usersModel import Users, createUserAccount, FindUserByName
from ...DB.db import get_session
from ...Util.util import userAccountExists