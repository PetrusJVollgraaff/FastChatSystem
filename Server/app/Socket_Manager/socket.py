from . import *
class ConnectionManager:
    def __init__(self):
        self.active: Dict[str, WebSocket] = {} # user_id → WebSocket
        self.lock = asyncio.Lock()

    async def connect(self, ws: WebSocket, user_id: int, username: str,):
        print("user connected ", username )
        #await ws.accept()
        #if not self.active[user_id]:
        self.active[user_id] = ws
        await self.broadcast_system(f"{username} joined the chat")

    
    async def disconnect(self, user_id: str, username: str):
        print("user disconnected ", username )
        if user_id in self.active:
            #username = self.active.pop(websocket)
            del self.active[user_id]
            if username:
                await self.broadcast_system(f"{username} left the chat")


    async def send_private(self, content1: dict, content2:dict, receiver_id: str, sender_id:str):
        
        websocket1 = self.active.get(receiver_id)
        print(websocket1)
        
        if websocket1:
            await websocket1.send_text(json.dumps({"message": content2, "id":sender_id}))

        websocket2 = self.active.get(sender_id)
        print(websocket2)
        
        if websocket2:
            await websocket2.send_text(json.dumps({"message": content1, "id":receiver_id}))


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
        
        websockets = list(self.active.values())
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


    async def first_join(self, websocket:WebSocket):
        raw = await websocket.receive_text()
        import json
        data = json.loads(raw)
    
        if data.get("type") != "join" or not data.get("token"):
            await websocket.send_text(json.dumps({"type": "error", "text": "Missing token"}))
            await websocket.close()
            return False


        from jose import jwt, JWTError
        from ..Util.util import userAccountExists
        
        try:
            userExists: Dict = userAccountExists(data["token"]) #self.check_user_exists(data)
            #print(userExists)
            
            if not userExists["status"]:
                raise ValueError
        
            else:
                await self.connect(ws=websocket, username=userExists["name"], user_id=userExists["id"])             

        except JWTError:
            await websocket.send_text(json.dumps({"type": "error", "text": "Invalid token"}))
            await websocket.close()
            return False
                