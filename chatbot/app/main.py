from fastapi import FastAPI
from .routes import health, chat, products, cart, orders
from .db import engine, Base

app = FastAPI(title="EcoFinds Chatbot Backend")

# include routers
app.include_router(health.router, prefix="/api")
app.include_router(chat.router, prefix="/api")
app.include_router(products.router, prefix="/api")
app.include_router(cart.router, prefix="/api")
app.include_router(orders.router, prefix="/api")


@app.on_event("startup")
def on_startup():
    # ensure tables are created (for development; migrations should be used in prod)
    Base.metadata.create_all(bind=engine)
