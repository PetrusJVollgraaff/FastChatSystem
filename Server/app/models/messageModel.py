
import json
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

def setPrivateMessage(db_session, sender_id:str, receiver_id:str, message: str):
    from .usersModel import get_User_ID

    senderID = get_User_ID(db_session, sender_id)
    receiverID = get_User_ID(db_session, receiver_id)

    result = db_session.execute(
        text("""
                INSERT INTO messages ([sender_id], [receiver_id], [message], [create_at])   
                VALUES (:senderid, :receiverid, :message, CURRENT_TIMESTAMP)
                RETURNING id
                """),
        {"senderid": senderID, "receiverid": receiverID, "message": message}
    )

    row = result.fetchone()
    db_session.commit()

    if row:
        results = db_session.execute(
                    text(f"""
                         SELECT 
                            M.message
                            ,M.create_at
                            ,(SELECT U.username FROM users U WHERE U.id = M.sender_id) sender_username
                            ,(SELECT U.username FROM users U WHERE U.id = M.receiver_id) receiver_username
                            ,CASE
                                WHEN M.sender_id=:user_id then '1'
                                ELSE'2'
                            END 'type'
                         FROM messages M
                         WHERE M.delete_at IS NULL AND M.id=:id
                         """),
                         {"user_id": senderID, "id": row.id}
                )
        
        newresult = results.mappings().fetchone()

        result1 = dict(newresult)
        result2 = dict(newresult).copy()
        result2["type"] = '2'

        return [True, result1, result2]
        
    return [False]

