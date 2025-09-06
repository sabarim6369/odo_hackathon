from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from .. import crud, schemas
from ..db import get_db

router = APIRouter()


@router.get("/orders/{user_id}", response_model=list[schemas.ProductOut])
def get_orders(user_id: int, db: Session = Depends(get_db)):
    purchases = crud.get_purchases_for_user(db, user_id)
    # map purchases to product outputs
    return [p.product for p in purchases]
