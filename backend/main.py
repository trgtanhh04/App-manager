from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from routers.root_router import router as root_router 
from routers.chatbot_router import router as chatbot_router 


app = FastAPI(title="App Manager API", version="1.0.0")

# CORS setup
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(root_router)
app.include_router(chatbot_router, prefix="/api/chat")

if __name__ == "__main__":
    import uvicorn
    uvicorn.run("main:app", host="0.0.0.0", port=8000, reload=True)
