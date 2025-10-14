from . import *

oauth2_scheme = OAuth2PasswordBearer(tokenUrl="/login")

def create_token(data: dict, expires_delta: int = None):
    to_encode = data.copy()
    expire = datetime.utcnow() + timedelta(minutes=expires_delta or ACCESS_TOKEN_EXPIRE_MINUTES)
    to_encode.update({"exp": expire})
    return jwt.encode(to_encode, SECRET_KEY, algorithm=ALGORITHM)


def get_current_user(token: str =  Depends(oauth2_scheme), session= Depends(get_session)):
    cred_exc = HTTPException(
        status_code=status.HTTP_401_UNAUTHORIZED,
        detail="Invalid authentication credentials",
        headers={"WWW-Authenticate": "Bearer"}
    )

    try:
        payload = jwt.decode(token, SECRET_KEY, algorithms=[ALGORITHM])
        username: str = payload.get("sub")
        if username is None:
            raise cred_exc
    
    except JWTError:
        raise cred_exc
    

    stmt = select(Users).where(Users.username == username)
    user = session.exec(stmt).first()
    if not user:
        raise cred_exc
    return user