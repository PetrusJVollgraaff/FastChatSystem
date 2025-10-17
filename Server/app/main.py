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

app.include_router(authrouter.router)
app.include_router(searchrouter.router)
app.include_router(userrouter.router)


manager = ConnectionManager()


@app.on_event("startup")
def on_startup():
    init_db()

@app.on_event('shutdown')
def on_shutdown():
    print('Server shutting down...')

@app.websocket("/ws/{user_id}")
async def websocket_endpoint(websocket: WebSocket, user_id: str,):
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
        await manager.first_join(websocket)
        import json
        #print(username, usernameid)
        #await manager.connect(ws=websocket, username=username, user_id=usernameid)


        while True:
            raw = await websocket.receive_text()
            print(raw)
            data = json.loads(raw)
            print(data)
            userExists : Dict = userAccountExists(data["token"]["access"]) #await manager.check_user_exists(data)
            if userExists["status"] and data.get("type") == "message":
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
        await manager.disconnect(websocket, user_id)
    except Exception as e:
        print(e)
       # ensure disconnection and cleanup
        try:
            print("ws closed 2")
            await manager.disconnect(websocket, user_id)
        except:
            pass