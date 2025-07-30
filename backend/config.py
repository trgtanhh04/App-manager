import os
from dotenv import load_dotenv

load_dotenv()

# Database Configuration
MONGODB_URL = os.environ.get("MONGODB_URL", "mongodb://localhost:27017")
MONGODB_DATABASE = os.environ.get("MONGODB_DATABASE", "app_manager")

# Security
SECRET_KEY = os.environ.get("SECRET_KEY", "your-secret-key")
JWT_ALGORITHM = "HS256"

# AI/ML Configuration
OPENAI_API_KEY = os.environ.get("OPENAI_API_KEY")
EMBEDDING_MODEL_NAME = os.environ.get("EMBEDDING_MODEL_NAME", "text-embedding-ada-002")
LLM_MODEL_NAME = os.environ.get("LLM_MODEL_NAME", "gpt-3.5-turbo")

# API Configuration
API_V1_STR = "/api/v1"
PROJECT_NAME = "App Manager API"
VERSION = "1.0.0"

# CORS
ALLOWED_ORIGINS = ["http://localhost:3000", "http://127.0.0.1:3000"]
