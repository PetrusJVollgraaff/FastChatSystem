from . import *

class Users(Base):
    __tablename__ = "users"
    
    id = Column(Integer, primary_key=True, index=True)
    username = Column(String, unique=True, index=True)
    password_hash = Column(String)

    def set_password(self, password: str):
        """Hashes and set the user's password."""
        password = password.encode("utf-8")[:72].decode("utf-8", "ignore")
        self.password_hash = pwd_context.hash(password)

    def verify_password(self, password:str) -> bool:
        """Verifies a qiven password against the stored hash"""
        password = password.encode("utf-8")[:72].decode("utf-8", "ignore")
        return pwd_context.verify(password, self.password_hash)