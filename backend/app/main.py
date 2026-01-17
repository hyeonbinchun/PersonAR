from fastapi import FastAPI
from . import routes

app = FastAPI()

app.include_router(routes.router)

@app.get("/")
def read_root():
    return {"Hello": "World"}
