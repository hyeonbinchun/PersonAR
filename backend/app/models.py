from pydantic import BaseModel, Field, EmailStr, conlist
from typing import List, Optional
from uuid import UUID, uuid4

class UserBase(BaseModel):
    full_name: str = Field(...)
    email: EmailStr = Field(...)
    ar_handle: str = Field(...)
    status_quote: str = Field(...)
    expanded_bio: str = Field(...)

class UserCreate(UserBase):
    password: str = Field(...)
    face_vectors: conlist(List[float], min_length=3, max_length=3)

class UserPublic(UserBase):
    id: UUID
    link: str

class UserInDB(UserBase):
    id: UUID = Field(default_factory=uuid4)
    hashed_password: str
    face_vectors: conlist(List[float], min_length=3, max_length=3)
    link: str

class UserUpdate(BaseModel):
    full_name: Optional[str] = None
    ar_handle: Optional[str] = None
    status_quote: Optional[str] = None
    expanded_bio: Optional[str] = None

class Token(BaseModel):
    access_token: str
    token_type: str

class TokenData(BaseModel):
    email: Optional[str] = None

class Login(BaseModel):
    email: EmailStr
    password: str

class VectorSearchRequest(BaseModel):
    face_vector: List[float] = Field(..., max_length=128, min_length=128)
