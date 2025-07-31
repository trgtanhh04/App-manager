from fastapi import FastAPI, UploadFile, File, Form, Request, HTTPException, APIRouter, Depends
from fastapi.responses import JSONResponse
from scripts.chatbot.utils.extractor import extract_text
from scripts.chatbot.utils.vectorstore import add_to_vectordb, get_retriever, get_vectordb
from scripts.chatbot.utils.memory import add_message_to_memory, get_memory
from scripts.chatbot.utils.qa_chain import get_qa_chain
import os
import shutil
import uuid

chat_router = APIRouter()

UPLOAD_FOLDER = 'scripts/chatbot/uploaded_files'
os.makedirs(UPLOAD_FOLDER, exist_ok=True)

# In-memory
sessions = {}
vectordb_collection = None

@chat_router.post("/upload")
async def upload_file(
    file: UploadFile = File(...),
    session_id: str = Form(...)
):
    file_id = str(uuid.uuid4())
    file_path = os.path.join(UPLOAD_FOLDER, f"{file_id}_{file.filename}")
    with open(file_path, "wb") as f:
        shutil.copyfileobj(file.file, f)

    text = extract_text(file_path)
    if not text:
        raise HTTPException(status_code=400, detail="Failed to extract text from the file")
    
    global vectordb_collection
    vectordb_collection = await get_vectordb()
    await add_to_vectordb(vectordb_collection, text,  file_path)

    if session_id not in sessions:
        sessions[session_id] = get_memory(session_id)

    return {
        'message': 'File uploaded successfully',
    }

@chat_router.post("/ask")
async def ask_question(request: Request):
    data = await request.json()
    query = data['question']
    session_id = data['session_id']

    memory = sessions.setdefault(session_id, get_memory())

    if not vectordb_collection:
        raise HTTPException(status_code=500, detail="VectorDB not initialized")
    retriever = await get_retriever(vectordb_collection)

    # Build the QA chain
    qa_chain = await get_qa_chain(retriever, memory)
    response = await qa_chain({
        'query': query,
    })

    add_message_to_memory(memory, 'user', query)
    add_message_to_memory(memory, 'ai', response['result'])

    return {
        'answer': response['result'],
        'history': memory.chat_memory.messages
    }
    