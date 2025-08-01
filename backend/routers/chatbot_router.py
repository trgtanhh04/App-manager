from fastapi import FastAPI, UploadFile, File, Form, Request, HTTPException, APIRouter, Depends
from fastapi.responses import JSONResponse
from scripts.chatbot.utils.extractor import extract_text
from scripts.chatbot.utils.vectorstore import add_to_vectordb, get_retriever, get_vectordb, clear_vectordb, reset_chroma_db
from scripts.chatbot.utils.memory import add_message_to_memory, get_memory
from scripts.chatbot.utils.qa_chain import get_qa_chain
from schemas.chatbot_schema import ChatRequest

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
    try:
        file_id = str(uuid.uuid4())
        file_path = os.path.join(UPLOAD_FOLDER, f"{file_id}_{file.filename}")
        with open(file_path, "wb") as f:
            shutil.copyfileobj(file.file, f)

        text = extract_text(file_path)

        if not text:
            raise HTTPException(status_code=400, detail="Failed to extract text from the file")
        
        # Approach đơn giản: tạo vectordb mới mỗi lần
        global vectordb_collection
        vectordb_collection = get_vectordb()
        add_to_vectordb(vectordb_collection, text, file_path, clear_existing=False)

        # Tạo session mới hoặc reset session cũ
        sessions[session_id] = get_memory()
        
        # Clean up file
        try:
            os.remove(file_path)
        except:
            pass

        return {
            'message': 'File uploaded successfully',
            'text': text[:1000] + "..." if len(text) > 1000 else text  # Limit response size
        }
    except Exception as e:
        # Clean up on error
        try:
            if 'file_path' in locals() and os.path.exists(file_path):
                os.remove(file_path)
        except:
            pass
        raise HTTPException(status_code=500, detail=f"Upload failed: {str(e)}")

@chat_router.post("/ask")
async def ask_question(request: ChatRequest):
    query = request.question
    session_id = request.session_id

    # Lấy session, nếu không có thì tạo mới
    if session_id not in sessions:
        raise HTTPException(status_code=400, detail="No session found. Please upload a document first.")
    
    memory = sessions[session_id]

    if not vectordb_collection:
        raise HTTPException(status_code=500, detail="VectorDB not initialized. Please upload a document first.")
    
    retriever = get_retriever(vectordb_collection)
    qa_chain = get_qa_chain(retriever)
    
    # Get chat history from memory for context
    chat_history = ""
    if memory.chat_memory.messages:
        for msg in memory.chat_memory.messages[-4:]:  # Last 4 messages for context
            if hasattr(msg, 'content'):
                chat_history += f"{msg.content}\n"
    
    query_with_context = f"Chat History:\n{chat_history}\n\nCurrent Question: {query}"
    
    response = qa_chain.invoke({
        'query': query_with_context,
    })

    add_message_to_memory(memory, 'user', query)
    add_message_to_memory(memory, 'ai', response['result'])

    return {
        'answer': response['result'],
        'history': memory.chat_memory.messages
    }

# Export router
router = chat_router