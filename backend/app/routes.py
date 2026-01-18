from fastapi import APIRouter, Body, Depends, HTTPException, status, Request
from fastapi.responses import JSONResponse
from uuid import UUID

from .database import user_collection
from .models import UserCreate, UserPublic, UserInDB, Login, Token, VectorSearchRequest, UserUpdate
from .auth import get_password_hash, verify_password, create_access_token, get_current_user

router = APIRouter()

@router.post("/signup", response_model=UserPublic)
async def signup(user_data: UserCreate = Body(...)):
    if await user_collection.find_one({"email": user_data.email}):
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail="Email already registered")
    if await user_collection.find_one({"ar_handle": user_data.ar_handle}):
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail="AR Handle already taken")

    hashed_password = get_password_hash(user_data.password)
    link = f"https://personar.world/p/{user_data.ar_handle}"

    user_in_db = UserInDB(
        **user_data.dict(exclude={"password"}),
        hashed_password=hashed_password,
        link=link
    )

    await user_collection.insert_one(user_in_db.dict())

    return UserPublic(**user_in_db.dict())

@router.post("/login", response_model=Token)
async def login(form_data: Login = Body(...)):
    user = await user_collection.find_one({"email": form_data.email})
    if not user or not verify_password(form_data.password, user["hashed_password"]):
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Incorrect email or password",
            headers={"WWW-Authenticate": "Bearer"},
        )
    
    access_token = create_access_token(data={"sub": user["email"]})
    return {"access_token": access_token, "token_type": "bearer"}

@router.get("/users/me", response_model=UserPublic)
async def read_users_me(current_user_email: str = Depends(get_current_user)):
    user = await user_collection.find_one({"email": current_user_email})
    if user:
        return UserPublic(**user)
    raise HTTPException(status_code=404, detail="User not found")

@router.put("/users/me", response_model=UserPublic)
async def update_user_me(user_update: UserUpdate = Body(...), current_user_email: str = Depends(get_current_user)):
    update_data = {k: v for k, v in user_update.dict(exclude_unset=True).items()}

    if len(update_data) >= 1:
        await user_collection.update_one({"email": current_user_email}, {"$set": update_data})

    if (updated_user := await user_collection.find_one({"email": current_user_email})) is not None:
        return UserPublic(**updated_user)

    raise HTTPException(status_code=404, detail="User not found")

@router.get("/users/{ar_handle}", response_model=UserPublic)
async def find_user_by_ar_handle(ar_handle: str):
    user = await user_collection.find_one({"ar_handle": ar_handle})
    if user:
        return UserPublic(**user)
    raise HTTPException(status_code=404, detail=f"User with AR Handle '{ar_handle}' not found")

@router.post("/users/find-by-vector", response_model=UserPublic)
async def find_user_by_vector(search_data: VectorSearchRequest = Body(...)):
    pipeline = [
        {
            "$vectorSearch": {
                "index": "vector_index",
                "path": "face_vectors",
                "queryVector": search_data.face_vector,
                "numCandidates": 10,
                "limit": 1
            }
        },
        {
            "$project": {
                "score": { "$meta": "vectorSearchScore" },
                "full_name": 1,
                "email": 1,
                "ar_handle": 1,
                "status_quote": 1,
                "expanded_bio": 1,
                "id": 1,
                "link": 1,
                "_id": 0
            }
        }
    ]

    async for user in user_collection.aggregate(pipeline):
        return UserPublic(**user)

    raise HTTPException(status_code=404, detail="No similar user found")

@router.get("/dev/list-endpoints")
async def list_endpoints(request: Request):
    url_list = [
        {"path": route.path, "name": route.name, "methods": route.methods}
        for route in request.app.routes
    ]
    
    with open("endpoints.txt", "w") as f:
        for endpoint in url_list:
            f.write(f"Path: {endpoint['path']}, Name: {endpoint['name']}, Methods: {endpoint['methods']}\n")
            
    return JSONResponse(content={"message": "endpoints.txt file generated."})
