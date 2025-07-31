from langchain_community.vectorstores import Chroma
from langchain_openai import OpenAIEmbeddings
from langchain.text_splitter import CharacterTextSplitter
import os
import sys

sys.path.append(os.path.dirname(os.path.dirname(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))))
from config import EMBEDDING_MODEL_NAME, OPENAI_API_KEY

# Constants
CHROMA_PATH = "chroma_db"

def get_vectordb():
    ebd = OpenAIEmbeddings(
        model=EMBEDDING_MODEL_NAME,
        openai_api_key=OPENAI_API_KEY
    )
    return Chroma(
        collection_name='docs',
        embedding_function=ebd,
        persist_directory=CHROMA_PATH
    )

def add_to_vectordb(vector_db, text, file_path):
    splitter = CharacterTextSplitter(
        chunk_size=2000,  # Tăng chunk size để tránh warning
        chunk_overlap=200
    )
    chunks = splitter.split_text(text)
    vector_db.add_texts(
        texts=chunks,
        metadatas=[{"source": file_path}] * len(chunks)
    )



def get_retriever(vector_db):
    return vector_db.as_retriever(
        search_kwargs={
            "k": 4
        }
    )
