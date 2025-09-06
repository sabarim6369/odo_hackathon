from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from .. import crud, schemas
from ..db import get_db

router = APIRouter()


@router.get("/cart/{user_id}", response_model=list[schemas.CartItem])
def get_cart(user_id: int, db: Session = Depends(get_db)):
    return crud.get_cart_for_user(db, user_id)


@router.post("/cart", response_model=schemas.CartItem)
def add_cart(item: schemas.CartItem, db: Session = Depends(get_db)):
    return crud.add_to_cart(db, user_id=item.userId, product_id=item.productId, quantity=item.quantity)


@router.delete("/cart/{cart_id}")
def delete_cart(cart_id: int, db: Session = Depends(get_db)):
    item = crud.remove_from_cart(db, cart_id)
    if not item:
        raise HTTPException(status_code=404, detail="Cart item not found")
    return {"status": "deleted"}
