
from . import *

class Users(Base):
    __tablename__ = "users"
    
    id = Column(Integer, primary_key=True, index=True)
    username = Column(String, unique=True, index=True, nullable=False)
    password_hash = Column(String, nullable=False, unique=True,)
    unique_id = Column(String, nullable=False)
    contacts = Column(String, nullable=True) #1,2,3 
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
    

    def set_uniqueid(self, db_session,  username:str):
        while True:
            random_part1 = secrets.token_hex(4)
            random_part2 = secrets.token_hex(4)
            raw_value = f"{random_part1}-{username}-{random_part2}".encode("utf-8")[:72].decode("utf-8", "ignore")
            unique_id =  hashlib.sha256(raw_value.encode("utf-8")).hexdigest()       
            #unique_id = pwd_context.hash(raw_value)

            existing = db_session.execute(
                    text("SELECT id FROM users WHERE unique_id = :uid"),
                    {"uid": unique_id}
                ).fetchone()
            if not existing:
                self.unique_id = unique_id
                break


class OneOnOne(Base):
    __tablename__ = "oneonone"

    id = Column(Integer, primary_key=True, index=True)
    sender_id = Column(Integer, ForeignKey("users.id"), index=True, nullable=False) #inviter
    receiver_id = Column(Integer, ForeignKey("users.id"), index=True, nullable=True) #invitee
    
    invite_at = Column(DateTime, default=datetime.utcnow)
    responed_at = Column(DateTime, nullable=True)
    delete_at = Column(DateTime, nullable=True)

    def check_exists(self, db_session, sender_id:str, receiver_id:str):
        senderID = get_User_ID(db_session, sender_id)
        receiverID = get_User_ID(db_session, receiver_id)

        if senderID == 0 or receiverID == 0:
            return False

        existing = db_session.execute(
                    text("""
                         SELECT id 
                         FROM oneonone 
                         WHERE delete_at IS NOT NULL AND 
                         (
                            (sender_id=:senderid AND receiver_id=:receiverid) 
                            OR
                            (sender_id=:receiverid AND receiver_id=:senderid)
                         )
                         """),
                    {"senderid": senderID, "receiverid": receiverID}
                ).fetchone()
        if not existing:
            self.sender_id(db_session=db_session, sender_id=senderID, receiver_id=receiverID)
        

    def start_conversation(self, db_session, sender_id:int, receiver_id:int):
        result = db_session.execute(
                    text("""
                         INSERT INTO oneonone ([sender_id], [receiver_id], [invite_at])
                         VALUES(:senderid, :receiverid, CURRENT_TIMESTAMP)
                         RETURNING id;
                         """),
                    {"senderid": sender_id, "receiverid": receiver_id}
                )
        row = result.fetchone()
        db_session.commit()

        if row:
            return True
        
        return False


class UsersBlockSenders(Base):
    __tablename__ = "usersblocksenders"
    
    id = Column(Integer, primary_key=True, index=True)
    block_sender_id = Column(Integer, ForeignKey("users.id"), index=True, nullable=False) #the person sending message
    receiver_id = Column(Integer, ForeignKey("users.id"), index=True, nullable=True) #the person turn on block]
    create_at = Column(DateTime, default=datetime.utcnow)
    delete_at = Column(DateTime, nullable=True)


    def check_exists(self, db_session, sender_id:str, receiver_id:str):
        senderID = get_User_ID(db_session, sender_id)
        receiverID = get_User_ID(db_session, receiver_id)

        if senderID == 0 or receiverID == 0:
            return False
        
        existing = db_session.execute(
                    text("""
                         SELECT id 
                         FROM usersblocksenders
                         WHERE delete_at IS NOT NULL AND 
                            block_sender_id=:senderid AND receiver_id=:receiverid
                         """),
                    {"senderid": senderID, "receiverid": receiverID}
                ).fetchone()
        if not existing:
            self.start_blocking(db_session=db_session, sender_id=senderID, receiver_id=receiverID)


    def start_blocking(self, db_session, sender_id:str, receiver_id:str):
        result = db_session.execute(
                    text("""
                         INSERT INTO usersblocksenders ([block_sender_id], [receiver_id], [create_at])
                         VALUES(:senderid, :receiverid, CURRENT_TIMESTAMP)
                         RETURNING id;
                         """),
                    {"senderid": sender_id, "receiverid": receiver_id}
                )
        row = result.fetchone()
        db_session.commit()

        if row:
            return True
        
        return False


def FindUserByName(db_session, username):
    result = db_session.execute(
                    text("""
                         SELECT id 
                         FROM users
                         WHERE delete_at IS NULL AND username=:username
                         """),
                    {"username": username}
                )
    return result.fetchone()


def createUserAccount(username, password, session):
    user = Users(username=username)
    user.set_password(password)
    user.set_uniqueid(db_session=session,  username=username)

    session.add(user)
    session.commit()
    session.refresh(user)


def get_User_ID(db_session, unique_id):
    session = db_session
    stmt = select(Users).where(Users.unique_id == unique_id)
    user = session.exec(stmt).first()

    if user:
        return user.id
    
    return 0