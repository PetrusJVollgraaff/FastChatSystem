from . import *

class Messages(Base):
    __tablename__ = "messages"

    id = Column(Integer, primary_key=True, index=True)
    sender_id = Column(Integer, ForeignKey("users.id"), index=True, nullable=False)
    receiver_id = Column(Integer, ForeignKey("users.id"), index=True, nullable=True)
    group_id = Column(Integer, ForeignKey("groups.id"), index=True, nullable=True)
    message = Column(String, nullable=False)
    create_at = Column(DateTime, default=datetime.utcnow)
    delete_at = Column(DateTime, nullable=True)
