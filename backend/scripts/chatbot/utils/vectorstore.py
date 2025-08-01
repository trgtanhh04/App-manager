from langchain_community.vectorstores import Chroma
from langchain_openai import OpenAIEmbeddings
from langchain.text_splitter import CharacterTextSplitter
import os
import sys
import shutil

sys.path.append(os.path.dirname(os.path.dirname(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))))
from config import EMBEDDING_MODEL_NAME, OPENAI_API_KEY

# Constants
CHROMA_PATH = "chroma_db"

def get_vectordb(collection_name='docs'):
    ebd = OpenAIEmbeddings(
        model=EMBEDDING_MODEL_NAME,
        openai_api_key=OPENAI_API_KEY
    )
    
    # Đơn giản hóa: chỉ sử dụng chroma_db directory
    return Chroma(
        collection_name=collection_name,
        embedding_function=ebd,
        persist_directory=CHROMA_PATH
    )

def reset_chroma_db():
    if os.path.exists(CHROMA_PATH):
        try:
            shutil.rmtree(CHROMA_PATH)
            print(f"Deleted existing Chroma directory: {CHROMA_PATH}")
        except Exception as e:
            print(f"Error deleting Chroma directory: {e}")

def clear_vectordb(vectordb):
    try:
        collection = vectordb._collection
        results = collection.delete()
        if results['ids']:
            collection.delete(ids=results['ids'])
    except Exception as e:
        print(f"Error clearing vector database: {e}")

def add_to_vectordb(vector_db, text, file_path, clear_existing=False):
    """
    Thêm text vào vector database - approach đơn giản
    """
    try:
        splitter = CharacterTextSplitter(
            chunk_size=2000,
            chunk_overlap=200
        )
        chunks = splitter.split_text(text)
        vector_db.add_texts(
            texts=chunks,
            metadatas=[{"source": file_path}] * len(chunks)
        )
        print(f"✅ Added {len(chunks)} chunks to vectordb")
        return vector_db
    except Exception as e:
        print(f"❌ Error adding to vectordb: {e}")
        raise e


def get_retriever(vector_db):
    return vector_db.as_retriever(
        search_kwargs={
            "k": 4
        }
    )
