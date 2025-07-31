import os
from dotenv import load_dotenv
load_dotenv()

MONGODB_URL = os.environ.get("MONGODB_URL", "mongodb://localhost:27017")
MONGODB_DATABASE = os.environ.get("MONGODB_DATABASE", "app_manager")

SECRET_KEY = os.environ.get("SECRET_KEY", "your-secret-key")

# API Key và loại Embedding
OPENAI_API_KEY = os.getenv("OPENAI_API_KEY")

EMBEDDING_MODEL_NAME = os.getenv("EMBEDDING_MODEL_NAME", "text-embedding-ada-002")
LLM_MODEL_NAME = os.getenv("LLM_MODEL_NAME", "gpt-3.5-turbo")