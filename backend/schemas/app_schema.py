from pydantic import BaseModel, Field
from typing import Optional

class AppSchema(BaseModel):
    name: str = Field(..., example="Sales Management System")
    description: Optional[str] = Field(None, example="Complete sales tracking and management platform")
    owner: Optional[str] = Field(None, example="admin")
    category: Optional[str] = Field(None, example="Business")
    website: Optional[str] = Field(None, example="https://sales-app.example.com")
    
    # New fields for app ecosystem
    app_type: Optional[str] = Field("demo", example="demo")  # demo, production, prototype
    tech_stack: Optional[str] = Field(None, example="Next.js, FastAPI, MongoDB")
    status: Optional[str] = Field("active", example="active")  # active, maintenance, deprecated
    repository_url: Optional[str] = Field(None, example="https://github.com/username/sales-app")
    frontend_port: Optional[int] = Field(None, example=3001)
    backend_port: Optional[int] = Field(None, example=8001)
    demo_credentials: Optional[str] = Field(None, example="admin@demo.com / demo123")
    is_locked: Optional[bool] = Field(False, example=False)  # Prevent accidental deletion