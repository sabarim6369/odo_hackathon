from sqlalchemy import Column, Integer, String, Float, ForeignKey, DateTime, Text
from sqlalchemy.orm import relationship
from datetime import datetime
from .db import Base


class User(Base):
    __tablename__ = "users"
    id = Column(Integer, primary_key=True, index=True)
    name = Column(String(255), nullable=False)
    email = Column(String(255), unique=True, nullable=False, index=True)
    password = Column(String(255), nullable=False)
    profilePic = Column(String(1024), nullable=True)
    createdAt = Column(DateTime, default=datetime.utcnow)

    products = relationship("Product", back_populates="owner")
    carts = relationship("Cart", back_populates="user")
    purchases = relationship("Purchase", back_populates="user")
    conversations = relationship("Conversation", back_populates="user")


class Category(Base):
    __tablename__ = "categories"
    id = Column(Integer, primary_key=True, index=True)
    name = Column(String(255), nullable=False, unique=True)

    products = relationship("Product", back_populates="category")


class Product(Base):
    __tablename__ = "products"
    id = Column(Integer, primary_key=True, index=True)
    title = Column(String(255), nullable=False)
    description = Column(Text, nullable=True)
    price = Column(Float, nullable=False, default=0.0)
    createdAt = Column(DateTime, default=datetime.utcnow)
    ownerId = Column(Integer, ForeignKey("users.id"))
    categoryId = Column(Integer, ForeignKey("categories.id"))

    owner = relationship("User", back_populates="products")
    category = relationship("Category", back_populates="products")
    images = relationship("ProductImage", back_populates="product")
    attributes = relationship("ProductAttribute", back_populates="product")
    carts = relationship("Cart", back_populates="product")
    purchases = relationship("Purchase", back_populates="product")


class ProductImage(Base):
    __tablename__ = "product_images"
    id = Column(Integer, primary_key=True, index=True)
    url = Column(String(1024), nullable=False)
    productId = Column(Integer, ForeignKey("products.id"))

    product = relationship("Product", back_populates="images")


class ProductAttribute(Base):
    __tablename__ = "product_attributes"
    id = Column(Integer, primary_key=True, index=True)
    key = Column(String(255), nullable=False)
    value = Column(String(1024), nullable=False)
    productId = Column(Integer, ForeignKey("products.id"))

    product = relationship("Product", back_populates="attributes")


class Cart(Base):
    __tablename__ = "carts"
    id = Column(Integer, primary_key=True, index=True)
    userId = Column(Integer, ForeignKey("users.id"))
    productId = Column(Integer, ForeignKey("products.id"))
    quantity = Column(Integer, default=1)

    user = relationship("User", back_populates="carts")
    product = relationship("Product", back_populates="carts")


class Purchase(Base):
    __tablename__ = "purchases"
    id = Column(Integer, primary_key=True, index=True)
    userId = Column(Integer, ForeignKey("users.id"))
    productId = Column(Integer, ForeignKey("products.id"))
    purchasedAt = Column(DateTime, default=datetime.utcnow)

    user = relationship("User", back_populates="purchases")
    product = relationship("Product", back_populates="purchases")


class Conversation(Base):
    __tablename__ = "conversations"
    id = Column(Integer, primary_key=True, index=True)
    userId = Column(Integer, ForeignKey("users.id"))
    sessionId = Column(String(255), index=True)
    message = Column(Text, nullable=False)
    role = Column(String(32), nullable=False)
    timestamp = Column(DateTime, default=datetime.utcnow)

    user = relationship("User", back_populates="conversations")
