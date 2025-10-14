import os
import uvicorn
from app.main import app

PORT = os.getenv("PORT", 5000)

if __name__ == "__main__":
    uvicorn.run("app.main:app", port=PORT, reload=True)