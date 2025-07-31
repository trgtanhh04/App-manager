from langchain.memory import ConversationBufferMemory
from config import MEMORY_KEY

def get_memory():
    return ConversationBufferMemory(
        return_messages=True,
    )

def add_message_to_memory(menmory, role, content):
    menmory.chat_memory.add_user_message({
        "type": role,
        "data":{
            "content": content,
        }
    })