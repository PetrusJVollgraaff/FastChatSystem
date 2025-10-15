from . import *

router = APIRouter(
    prefix="/auth",
    tags=["Auth"]
)

@router.post("/register")
def register(username: Annotated[str, Form()], password: Annotated[str, Form()], confirmpassword: Annotated[str, Form()], session= Depends(get_session)):   
    stmt = select(Users).where(Users.username == username)

    existing_user = session.exec(stmt).first()

    if existing_user:
        raise HTTPException(status_code=400, detail="UserName already exists")

    createUserAccount(username, password, session)
    

    return {"status": "success", "message": "User registered succesfully", "user":username}

@router.post("/login")
def login(username: Annotated[str, Form()], password: Annotated[str, Form()], session= Depends(get_session)):
    stmt = select(Users).where(Users.username == username)

    user = session.exec(stmt).first()

    if not user or not user.verify_password(password):
        raise HTTPException(status_code=400, detail="Invalid credentials")
    
    token = create_token({"sub": user.username})

    return {"status": "success", "message": "Login successful", "access_token": token, "token_type": "bearer"}