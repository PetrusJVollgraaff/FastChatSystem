from . import *


app = FastAPI(title="FastAPI React Chat")


# Allow React dev server origin
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5001"],  # adjust if needed
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(auth.router)


manager = ConnectionManager()


@app.on_event("startup")
def on_startup():
    init_db()

@app.on_event('shutdown')
def on_shutdown():
    print('Server shutting down...')

@app.websocket("/ws")
async def websocket_endpoint(websocket: WebSocket):
    """
    WebSocket protocol (simple):
        - On connect: client sends a "join" message with {"type":"join","username":"alice"}
        - On chat: client sends {"type":"message","content":"hello"}
        - Server broadcasts:
        {"type":"message","username":"alice","content":"hello","created_at":"..."}
        {"type":"system","text":"alice joined the chat"}
    """

    await websocket.accept()

    try:
        # First message from client must be join with username
        raw = await websocket.receive_text()
        import json
        data = json.loads(raw)
        
        if data.get("type") != "join" or not data.get("token"):
            await websocket.send_text(json.dumps({"type": "error", "text": "Missing token"}))
            await websocket.close()
            return


        from jose import jwt, JWTError
        from .Auth.auth import SECRET_KEY, ALGORITHM

        try:
            payload = jwt.decode(data["token"], SECRET_KEY, algorithms=[ALGORITHM])
            username = payload.get("sub")
            usernameid = payload.get("id")
            if not username:
                raise ValueError
            
            else:

                from sqlmodel import select
                from .models.usersModel import Users
                from .DB.db import get_session

                session= get_session()
                stmt = select(Users).where(Users.username == username, Users.id == usernameid)
                user_exists = session.exec(stmt).first()

                if not user_exists:
                    raise ValueError
                else:
                    username = '{"username": username, "id": usernameid}'

        except JWTError:
            await websocket.send_text(json.dumps({"type": "error", "text": "Invalid token"}))
            await websocket.close()
            return
        
        await manager.connect(websocket, username)


        while True:
            raw = await websocket.receive_text()
            print(raw)
            data = json.loads(raw)
            if data.get("type") == "message":
                content = data["content"].get("message", "").strip()
                print(content)
                if not content:
                    continue
                # persist
                '''session = get_session()
                msg = Message(username=username, content=content)
                session.add(msg)
                session.commit()
                session.refresh(msg)
                session.close()
                '''

                # broadcast
                '''await manager.broadcast({
                    "type": "message",
                    "id": msg.id,
                    "username": msg.username,
                    "content": msg.content,
                    "created_at": msg.created_at.isoformat()
                })'''

    except WebSocketDisconnect:
        print("ws closed 1")
        await manager.disconnect(websocket)
    except Exception as e:
        print(e)
        # ensure disconnection and cleanup
        try:
            print("ws closed 2")
            await manager.disconnect(websocket)
        except:
            pass