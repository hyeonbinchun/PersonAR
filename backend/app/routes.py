from fastapi import APIRouter, Body, HTTPException, status, Request
from fastapi.responses import RedirectResponse
from passlib.context import CryptContext
from authlib.integrations.starlette_client import OAuth
from starlette.config import Config
import uuid

from .database import user_collection
from .models import User, UserCreate, UserInDB, UserUpdate, Login

# Router setup
router = APIRouter()

# Password hashing context
pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")

# OAuth setup
config = Config('.env')
oauth = OAuth(config)
oauth.register(
    name='google',
    server_metadata_url='https://accounts.google.com/.well-known/openid-configuration',
    client_kwargs={'scope': 'openid email profile'}
)

# --- Password Utils ---
def verify_password(plain_password, hashed_password):
    return pwd_context.verify(plain_password, hashed_password)

def get_password_hash(password):
    return pwd_context.hash(password)

# --- Standard Authentication Endpoints ---
@router.post("/signup", response_model=User)
async def signup(user: UserCreate = Body(...)):
    # Check for existing user by email or name
    if await user_collection.find_one({"email": user.email}):
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail="Email already registered")
    if await user_collection.find_one({"name": user.name}):
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail="Username already taken")

    user_id = str(uuid.uuid4())
    hashed_password = get_password_hash(user.password)
    
    user_in_db = UserInDB(
        id=user_id,
        name=user.name,
        email=user.email,
        dob=user.dob,
        instagram_handle=user.instagram_handle,
        description=user.description,
        hashed_password=hashed_password
    )
    
    await user_collection.insert_one(user_in_db.dict())
    
    return User(**user_in_db.dict())

@router.post("/login")
async def login(login_data: Login = Body(...)):
    user = await user_collection.find_one({"email": login_data.email})
    if not user or not user.get("hashed_password") or not verify_password(login_data.password, user["hashed_password"]):
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Incorrect email or password",
            headers={"WWW-Authenticate": "Bearer"},
        )
    return User(**user)

@router.put("/edit-info/{user_id}", response_model=User)
async def edit_info(user_id: str, user_update: UserUpdate = Body(...)):
    update_data = {k: v for k, v in user_update.dict(exclude_unset=True).items()}

    if len(update_data) >= 1:
        await user_collection.update_one({"id": user_id}, {"$set": update_data})

    if (updated_user := await user_collection.find_one({"id": user_id})) is not None:
        return User(**updated_user)

    raise HTTPException(status_code=404, detail=f"User {user_id} not found")

# --- Google OAuth2 Endpoints ---
@router.get('/login/google')
async def login_google(request: Request):
    redirect_uri = request.url_for('auth_google')
    return await oauth.google.authorize_redirect(request, redirect_uri)

@router.get('/auth/google')
async def auth_google(request: Request):
    try:
        token = await oauth.google.authorize_access_token(request)
    except Exception as e:
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="Could not validate credentials")
    
    user_info = token.get('userinfo')
    if not user_info:
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail="Could not fetch user info")

    user_email = user_info['email']
    
    # Check if user exists
    db_user = await user_collection.find_one({"email": user_email})
    
    if db_user:
        # User exists, log them in (for now, just return user info)
        return User(**db_user)
    else:
        # User doesn't exist, create a new one
        new_user = UserInDB(
            id=str(uuid.uuid4()),
            name=user_info.get('name', user_info.get('given_name', 'New User')),
            email=user_email,
            dob="N/A",  # Or prompt user to fill this in later
            instagram_handle=None,
            description=None,
            hashed_password=None # No password for OAuth users
        )
        await user_collection.insert_one(new_user.dict())
        return User(**new_user.dict())
