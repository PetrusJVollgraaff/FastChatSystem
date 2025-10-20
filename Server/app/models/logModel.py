from . import *

class Logs(Base):
    __tablename__ = "logs"

    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id"), index=True, nullable=False)
    log_type = Column(String, nullable=False)
    log_notes = Column(String, nullable=False)
    create_at = Column(DateTime, default=datetime.utcnow)