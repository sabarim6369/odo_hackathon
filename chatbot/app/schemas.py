from pydantic import BaseModel
from typing import Optional, List
from datetime import datetime


class UserCreate(BaseModel):
    name: str
    email: str
    password: str


class UserOut(BaseModel):
    id: int
    name: str
    email: str
    profilePic: Optional[str]
    createdAt: datetime

    class Config:
        orm_mode = True


class CategoryOut(BaseModel):
    id: int
    name: str

    class Config:
        orm_mode = True


class ProductOut(BaseModel):
    id: int
    title: str
    description: Optional[str]
    price: float
    createdAt: datetime
    ownerId: Optional[int]
    categoryId: Optional[int]

    class Config:
        orm_mode = True


class CartItem(BaseModel):
    id: int
    userId: int
    productId: int
    quantity: int

    class Config:
        orm_mode = True


class ConversationCreate(BaseModel):
    userId: int
    sessionId: str
    message: str
    role: str


class ConversationOut(BaseModel):
    id: int
    userId: int
    sessionId: str
    message: str
    role: str
    timestamp: datetime

    class Config:
        orm_mode = True
