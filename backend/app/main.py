from fastapi import FastAPI
from contextlib import asynccontextmanager
from . import routes
from .database import create_vector_index

@asynccontextmanager
async def lifespan(app: FastAPI):
    # On startup
    await create_vector_index()
    yield
    # On shutdown
    

app = FastAPI(lifespan=lifespan)

app.include_router(routes.router)

@app.get("/")
def read_root():
    return {"message": "Welcome to the PersonAR API"}