import os
import sys
import asyncio
from dotenv import load_dotenv
from motor.motor_asyncio import AsyncIOMotorClient

# Thêm thư mục backend vào Python path
sys.path.append(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))

load_dotenv()
from config import MONGODB_URL, MONGODB_DATABASE
print("Connecting to MongoDB...", MONGODB_URL, MONGODB_DATABASE)

MONGODB_URL = os.getenv("MONGODB_URL", MONGODB_URL)
MONGODB_DATABASE = os.getenv("MONGODB_DATABASE", MONGODB_DATABASE)

client = AsyncIOMotorClient(MONGODB_URL)
db = client[MONGODB_DATABASE]
users_collection = db["users"]
apps_collection = db["apps"]
