from pydantic import BaseModel, Field
from typing import Optional

class LoginRequest(BaseModel):
    email: str = Field(..., example="admin@example.com")
    password: str = Field(..., example="password123")

class RegisterRequest(BaseModel):
    email: str = Field(..., example="user@example.com")
    password: str = Field(..., example="password123")
    name: str = Field(..., example="John Doe")
    
class UserResponse(BaseModel):
    id: str
    email: str
    name: str
    created_at: Optional[str] = None

class AuthResponse(BaseModel):
    status: str
    message: str
    user: Optional[UserResponse] = None
    token: Optional[str] = None