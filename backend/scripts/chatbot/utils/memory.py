from langchain.memory import ConversationBufferMemory

def get_memory():
    return ConversationBufferMemory(
        return_messages=True,
        memory_key="chat_history"
    )

def add_message_to_memory(memory, role, content):
    if role == 'user':
        memory.chat_memory.add_user_message(content)
    elif role == 'ai':
        memory.chat_memory.add_ai_message(content)