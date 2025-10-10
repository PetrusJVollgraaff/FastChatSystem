from . import *
class ConnectionManager:
    def __init__(self):
        self.active: Dict[WebSocket, str] = {}
        self.lock = asyncio.Lock()

    async def connect(self, websocket: WebSocket, username: str):
        await websocket.accept()

        async with self.lock:
            self.active[websocket] = username
            await self.broadcast_system(f"{username} joined the chat")

    
    async def disconnect(self, websocket: WebSocket):
        async with self.lock:
            username = self.active.get(websocket)
            if username:
                del self.active[websocket]
                await self.broadcast_system(f"{username} left the chat")

    async def send_personal(self, websocket: WebSocket, message: dict):
        await websocket.send_text(json.dumps(message))

    async def breadcast(self, message: dict):
        data = json.dumps(message)
        async with self.lock:
            websockets = list(self.active.keys())
        for ws in websockets:
            try:
                await ws.send_text(data)
            except Exception:
                # ignore dead connections; they'll be cleaned up on disconnect
                pass

    async def broadcast_system(self, text: str):
        await self.breadcast({"type": "system", "text": text})