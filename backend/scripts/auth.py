from scripts.db import users_collection
import hashlib
import secrets
import datetime
from bson import ObjectId

# Hash password
def hash_password(password: str) -> str:
    return hashlib.sha256(password.encode()).hexdigest()

# Generate token
def generate_token() -> str:
    return secrets.token_urlsafe(32)

# Verify password
def verify_password(password: str, hashed_password: str) -> bool:
    return hash_password(password) == hashed_password

# Kiểm tra email & password
async def verify_user(email: str, password: str):
    user = await users_collection.find_one({"email": email})
    print('User found:', user)
    if user and verify_password(password, user["password"]):
        return user
    return None

# Register new user
async def register_user(email: str, password: str, name: str):
    # Check if user already exists
    existing_user = await users_collection.find_one({"email": email})
    if existing_user:
        return {"success": False, "message": "Email already registered"}
    
    # Create new user
    hashed_password = hash_password(password)
    new_user = {
        "email": email,
        "password": hashed_password,
        "name": name,
        "created_at": datetime.datetime.utcnow().isoformat()
    }
    
    result = await users_collection.insert_one(new_user)
    if result.inserted_id:
        return {
            "success": True, 
            "message": "User registered successfully",
            "user_id": str(result.inserted_id)
        }
    return {"success": False, "message": "Registration failed"}

# Get user by ID
async def get_user_by_id(user_id: str):
    try:
        user = await users_collection.find_one({"_id": ObjectId(user_id)})
        if user:
            user["id"] = str(user["_id"])
            del user["_id"]
            del user["password"] 
            return user
        return None
    except:
        return None