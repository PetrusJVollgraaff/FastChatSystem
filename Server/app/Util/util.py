from . import *

def userAccountExists(token):

    payload = jwt.decode(token, SECRET_KEY, algorithms=[ALGORITHM])
    username = payload.get("sub")
    unique_id = payload.get("id")

    if username:
        session= get_session()
        stmt = select(Users).where(Users.username == username, Users.unique_id == unique_id)
        user_exists = session.exec(stmt).first()
        #print(user_exists)
        if user_exists:
            return {"status":True, "name":username, "id":unique_id}
    
    return {"status":False} 