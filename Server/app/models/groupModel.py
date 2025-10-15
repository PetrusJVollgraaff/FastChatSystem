from . import *

class Groups(Base):
    __tablename__ = "groups"

    id = Column(Integer, primary_key=True, index=True)
    group_name = Column(Integer, index=True, nullable=False)
    create_at = Column(DateTime, default=datetime.utcnow)
    delete_at = Column(DateTime, nullable=True)
    

class GroupsUsers(Base):
    __tablename__ = "groupsusers"
    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id"), index=True, nullable=False)
    group_id = Column(Integer, ForeignKey("groups.id"), index=True, nullable=False)
    create_at = Column(DateTime, default=datetime.utcnow)
    delete_at = Column(DateTime, nullable=True)