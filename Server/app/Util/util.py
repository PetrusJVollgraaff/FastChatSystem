from . import *

async def First_Connection_Check(websocket):
    # First message from client must be join with username
    raw = await websocket.receive_text()
    import json
    data = json.loads(raw)
    if data.get("type") != "join" or not data.get("token"):
        await websocket.send_text(json.dumps({"type": "error", "text": "Missing token"}))
        await websocket.close()
        return [False]

    from jose import jwt, JWTError
    from ..Auth.auth import SECRET_KEY, ALGORITHM

    try:
        payload = jwt.decode(data["token"], SECRET_KEY, algorithms=[ALGORITHM])
        username = payload.get("sub")
        usernameid = payload.get("id")
        if not username and not usernameid:
            raise ValueError
            
        else:

            from sqlmodel import select
            from ..models.usersModel import Users
            from ..DB.db import get_session

            session= get_session()
            stmt = select(Users).where(Users.username == username, Users.id == usernameid)
            user_exists = session.exec(stmt).first()

            if not user_exists:
                raise ValueError
            else:
                return [True, {"username": username, "id": usernameid}]

    except JWTError:
        await websocket.send_text(json.dumps({"type": "error", "text": "Invalid token"}))
        await websocket.close()
        return [False]