from pydantic import BaseModel, Field, EmailStr
from typing import Optional
import uuid

class UserBase(BaseModel):
    name: str
    email: EmailStr
    dob: str
    instagram_handle: Optional[str] = None
    description: Optional[str] = None

class UserCreate(UserBase):
    password: str

class User(UserBase):
    id: str

class UserInDB(User):
    hashed_password: Optional[str] = None

class UserUpdate(BaseModel):
    name: Optional[str] = None
    email: Optional[EmailStr] = None
    dob: Optional[str] = None
    instagram_handle: Optional[str] = None
    description: Optional[str] = None

class Login(BaseModel):
    email: EmailStr
    password: str
