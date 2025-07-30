from fastapi import APIRouter, HTTPException, Header
from schemas.auth_schema import LoginRequest, RegisterRequest, AuthResponse, UserResponse
from scripts.auth import verify_user, register_user, get_user_by_id, generate_token
from typing import Optional

auth_router = APIRouter()

# In-memory token storage (in production, use Redis or database)
active_tokens = {}

@auth_router.post("/login", response_model=AuthResponse)
async def login(payload: LoginRequest):
    user = await verify_user(payload.email, payload.password)
    if not user:
        raise HTTPException(status_code=401, detail="Invalid email or password")
    
    # Generate token
    token = generate_token()
    user_id = str(user["_id"])
    active_tokens[token] = user_id
    
    user_response = UserResponse(
        id=user_id,
        email=user["email"],
        name=user["name"],
        created_at=user.get("created_at")
    )
    
    return AuthResponse(
        status="success",
        message="Login successful",
        user=user_response,
        token=token
    )

@auth_router.post("/register", response_model=AuthResponse)
async def register(payload: RegisterRequest):
    result = await register_user(payload.email, payload.password, payload.name)
    
    if not result["success"]:
        raise HTTPException(status_code=400, detail=result["message"])
    
    # Auto login after registration
    user = await get_user_by_id(result["user_id"])
    if user:
        token = generate_token()
        active_tokens[token] = result["user_id"]
        
        user_response = UserResponse(
            id=user["id"],
            email=user["email"],
            name=user["name"],
            created_at=user.get("created_at")
        )
        
        return AuthResponse(
            status="success",
            message="Registration successful",
            user=user_response,
            token=token
        )
    
    return AuthResponse(
        status="success",
        message="Registration successful, please login"
    )

@auth_router.post("/logout", response_model=AuthResponse)
async def logout(authorization: Optional[str] = Header(None)):
    if not authorization or not authorization.startswith("Bearer "):
        raise HTTPException(status_code=401, detail="Invalid token")
    
    token = authorization.split("Bearer ")[1]
    if token in active_tokens:
        del active_tokens[token]
    
    return AuthResponse(
        status="success",
        message="Logout successful"
    )

@auth_router.get("/me", response_model=UserResponse)
async def get_current_user(authorization: Optional[str] = Header(None)):
    if not authorization or not authorization.startswith("Bearer "):
        raise HTTPException(status_code=401, detail="Token required")
    
    token = authorization.split("Bearer ")[1]
    user_id = active_tokens.get(token)
    
    if not user_id:
        raise HTTPException(status_code=401, detail="Invalid or expired token")
    
    user = await get_user_by_id(user_id)
    if not user:
        raise HTTPException(status_code=404, detail="User not found")
    
    return UserResponse(
        id=user["id"],
        email=user["email"],
        name=user["name"],
        created_at=user.get("created_at")
    )

# Helper function to verify token (for other routes)
async def verify_token(authorization: Optional[str] = Header(None)):
    if not authorization or not authorization.startswith("Bearer "):
        raise HTTPException(status_code=401, detail="Token required")
    
    token = authorization.split("Bearer ")[1]
    user_id = active_tokens.get(token)
    
    if not user_id:
        raise HTTPException(status_code=401, detail="Invalid or expired token")
    
    return user_id