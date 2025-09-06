from sqlalchemy.orm import Session
from . import models
from typing import List, Optional


def get_products(db: Session, skip: int = 0, limit: int = 100) -> List[models.Product]:
    return db.query(models.Product).offset(skip).limit(limit).all()


def get_products_by_category(db: Session, category_id: int) -> List[models.Product]:
    return db.query(models.Product).filter(models.Product.categoryId == category_id).all()


def get_product(db: Session, product_id: int) -> Optional[models.Product]:
    return db.query(models.Product).filter(models.Product.id == product_id).first()


def get_cart_for_user(db: Session, user_id: int):
    return db.query(models.Cart).filter(models.Cart.userId == user_id).all()


def add_to_cart(db: Session, user_id: int, product_id: int, quantity: int = 1):
    item = db.query(models.Cart).filter(models.Cart.userId == user_id, models.Cart.productId == product_id).first()
    if item:
        item.quantity += quantity
        db.add(item)
        db.commit()
        db.refresh(item)
        return item
    item = models.Cart(userId=user_id, productId=product_id, quantity=quantity)
    db.add(item)
    db.commit()
    db.refresh(item)
    return item


def remove_from_cart(db: Session, cart_id: int):
    item = db.query(models.Cart).filter(models.Cart.id == cart_id).first()
    if item:
        db.delete(item)
        db.commit()
    return item


def get_purchases_for_user(db: Session, user_id: int):
    return db.query(models.Purchase).filter(models.Purchase.userId == user_id).all()


def save_conversation(db: Session, user_id: int, session_id: str, message: str, role: str):
    conv = models.Conversation(userId=user_id, sessionId=session_id, message=message, role=role)
    db.add(conv)
    db.commit()
    db.refresh(conv)
    return conv


def get_conversation_history(db: Session, user_id: int, session_id: str, limit: int = 100):
    return db.query(models.Conversation).filter(models.Conversation.userId == user_id, models.Conversation.sessionId == session_id).order_by(models.Conversation.timestamp.asc()).limit(limit).all()
