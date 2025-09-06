from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from .. import crud, schemas
from ..db import get_db

router = APIRouter()


@router.get("/products", response_model=list[schemas.ProductOut])
def list_products(skip: int = 0, limit: int = 100, db: Session = Depends(get_db)):
    return crud.get_products(db, skip=skip, limit=limit)


@router.get("/products/category/{category_id}", response_model=list[schemas.ProductOut])
def products_by_category(category_id: int, db: Session = Depends(get_db)):
    return crud.get_products_by_category(db, category_id)


@router.get("/products/{product_id}", response_model=schemas.ProductOut)
def product_detail(product_id: int, db: Session = Depends(get_db)):
    p = crud.get_product(db, product_id)
    if not p:
        raise HTTPException(status_code=404, detail="Product not found")
    return p
