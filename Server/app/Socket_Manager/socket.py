from . import *
class ConnectionManager:
    def __init__(self):
        self.active: Dict[WebSocket, str] = {}
        self.lock = asyncio.Lock()

    async def connect(self, websocket: WebSocket, username: str):
        print(username, websocket, self.lock)
        websocket.accept()

        async with self.lock:
            print("hello")
            self.active[websocket] = username
        await self.broadcast_system(f"{username} joined the chat")

    
    async def disconnect(self, websocket: WebSocket):
        username = None
        async with self.lock:
            if websocket in self.active:
                username = self.active.pop(websocket)
        if username:
            await self.broadcast_system(f"{username} left the chat")

    async def send_personal(self, websocket: WebSocket, message: dict):
        """Send a message to one websocket"""
        try:
            await websocket.send_text(json.dumps(message))
        except Exception:
            # Connection may be closed; ignore
            pass


    async def broadcast(self, message: dict):
        """Broadcast to all clients concurrently."""
        data = json.dumps(message)
        async with self.lock:
            websockets = list(self.active.keys())

        # Send concurrently to avoid blocking on slow clients
        if not websockets:
            return

        send_tasks = [ws.send_text(data) for ws in websockets]
        results = await asyncio.gather(*send_tasks, return_exceptions=True)

        # Clean up disconnected clients
        for ws, result in zip(websockets, results):
            if isinstance(result, Exception):
                async with self.lock:
                    if ws in self.active:
                        self.active.pop(ws, None)

    async def broadcast_system(self, text: str):
        """Send a system message (e.g., join/leave notifications)."""
        await self.broadcast({"type": "system", "text": text})