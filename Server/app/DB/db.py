from . import *
from ..models import usersModel, messageModel, groupModel

DB_FILE = os.getenv("CHAT_DB", "chat.db")
engine = create_engine(f"sqlite:///{DB_FILE}", connect_args={"check_same_thread": False})
SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)

def init_db():
    usersModel.Base.metadata.create_all(engine)
    messageModel.Base.metadata.create_all(engine)
    groupModel.Base.metadata.create_all(engine)

    create_Admin_account()

    

def create_Admin_account():
    session= Session(engine)
    stmt = select(usersModel.Users).where(usersModel.Users.username == "Admin")
    admin_exists = session.exec(stmt).first()
    if not admin_exists:
        usersModel.createUserAccount("Admin", "password123", session)

def get_session():
    return Session(engine)