from . import *

class Users(Base):
    __tablename__ = "users"
    
    id = Column(Integer, primary_key=True, index=True)
    username = Column(String, unique=True, index=True, nullable=False)
    password_hash = Column(String, nullable=False)
    create_at = Column(DateTime, default=datetime.utcnow)
    delete_at = Column(DateTime, nullable=True)

    def set_password(self, password: str):
        """Hashes and set the user's password."""
        password = password.encode("utf-8")[:72].decode("utf-8", "ignore")
        self.password_hash = pwd_context.hash(password)

    def verify_password(self, password:str) -> bool:
        """Verifies a qiven password against the stored hash"""
        password = password.encode("utf-8")[:72].decode("utf-8", "ignore")
        return pwd_context.verify(password, self.password_hash)
    
def createUserAccount(username, password, session):
    
    user = Users(username=username)
    user.set_password(password)
    session.add(user)
    session.commit()
    session.refresh(user)