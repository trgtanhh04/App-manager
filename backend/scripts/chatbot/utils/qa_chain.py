from langchain.chains import RetrievalQA
from langchain_openai import ChatOpenAI
import os
import sys

# Add backend to path for config import
sys.path.append(os.path.dirname(os.path.dirname(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))))
from config import LLM_MODEL_NAME, OPENAI_API_KEY

def get_qa_chain(retriever, memory=None):
    llm = ChatOpenAI(
        model=LLM_MODEL_NAME,
        temperature=0.0,
        openai_api_key=OPENAI_API_KEY
    )

    qa = RetrievalQA.from_chain_type(
        llm=llm,
        chain_type="stuff",
        retriever=retriever,
        return_source_documents=True
    )
    return qa
