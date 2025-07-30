from langchain.chains import RetrievalQA
from langchain.chat_models import ChatOpenAI
from config import LLM_MODEL_NAME

def get_qa_chain(retriever, memory):
    llm = ChatOpenAI(
        model = LLM_MODEL_NAME,
        temperature=0.0,

    )

    qa = RetrievalQA.from_chain_type(
        llm = llm,
        chain_type="stuff",
        retriever=retriever,
        return_source_documents=True,
        memory=memory,
    )
    return qa
