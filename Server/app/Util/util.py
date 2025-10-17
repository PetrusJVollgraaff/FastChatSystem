from . import *

def userAccountExists(token):
    print(token)
    payload = jwt.decode(token, SECRET_KEY, algorithms=[ALGORITHM])
    username = payload.get("sub")
    unique_id = payload.get("id")

    if username and unique_id:
        session= get_session()
        user_exists = session.execute(
                    text("SELECT id, username, IFNULL(contacts, '') AS contacts, unique_id FROM users WHERE unique_id = :uid AND username=:username"),
                    {"uid": unique_id, "username": username}
                ).fetchone()      

        if user_exists:
            return {"status":True, "name": user_exists.username, "id":user_exists.unique_id, "contacts": user_exists.contacts, "db_id": user_exists.id }
    
    return {"status":False} 

def confirmUserExists(token):

    try:
        if not token:
            raise HTTPException(status_code=404, detail="Not Found")
        
        userexist = userAccountExists(token)
        
        if not userexist["status"]:
            raise HTTPException(status_code=401, detail="Unauthized")
    except JWTError:
        raise HTTPException(status_code=401, detail="Unauthized")
    
    return userexist