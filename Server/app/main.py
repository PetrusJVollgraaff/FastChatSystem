import os
from fastapi import FastAPI, WebSocket, WebSocketDisconnect, Depends, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from .Socket_Manager.socket import ConnectionManager
from typing import List

app = FastAPI(title="FastAPI React Chat")

# Allow React dev server origin
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5001"],  # adjust if needed
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

manager = ConnectionManager()

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
        if data.get("type") != "join" or not data.get("username"):
            await websocket.send_text(json.dumps({"type": "error", "text": "First message must be join with username"}))
            await websocket.close()
            return

        username = data["username"]
        await manager.connect(websocket, username)


        while True:
            raw = await websocket.receive_text()
            data = json.loads(raw)
            if data.get("type") == "message":
                content = data.get("content", "").strip()
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
        await manager.disconnect(websocket)
    except Exception as e:
        # ensure disconnection and cleanup
        try:
            await manager.disconnect(websocket)
        except:
            pass