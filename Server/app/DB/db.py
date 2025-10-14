from . import *
from ..models import usersModel

DB_FILE = os.getenv("CHAT_DB", "chat.db")
engine = create_engine(f"sqlite:///{DB_FILE}", connect_args={"check_same_thread": False})
SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)

def init_db():
    usersModel.Base.metadata.create_all(engine)


def get_session():
    return Session(engine)