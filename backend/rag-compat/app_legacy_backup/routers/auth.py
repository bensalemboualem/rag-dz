"""
Authentication Routes - Login, Register, Profile
"""
from fastapi import APIRouter, HTTPException, status, Depends
from fastapi.security import OAuth2PasswordRequestForm
from datetime import timedelta
import logging

from app.models.user import UserCreate, UserLogin, UserResponse, Token, User
from app.services.user_repository import user_repository
from app.services.auth_service import auth_service, ACCESS_TOKEN_EXPIRE_MINUTES
from app.dependencies import get_current_active_user

logger = logging.getLogger(__name__)

router = APIRouter(prefix="/api/auth", tags=["auth"])


@router.post("/register", response_model=UserResponse, status_code=status.HTTP_201_CREATED)
def register(user_data: UserCreate):
    """
    Register a new user

    Args:
        user_data: User registration data (email, password, full_name)

    Returns:
        User object with access token

    Raises:
        HTTPException 400: If user already exists
    """
    try:
        # Create user in database
        user = user_repository.create_user(user_data)

        # Generate access token
        access_token_expires = timedelta(minutes=ACCESS_TOKEN_EXPIRE_MINUTES)
        access_token = auth_service.create_access_token(
            data={"sub": user.email, "user_id": user.id},
            expires_delta=access_token_expires
        )

        logger.info(f"✅ User registered successfully: {user.email}")

        return UserResponse(
            user=User(
                id=user.id,
                email=user.email,
                full_name=user.full_name,
                is_active=user.is_active,
                is_superuser=user.is_superuser,
                created_at=user.created_at,
                updated_at=user.updated_at
            ),
            access_token=access_token,
            token_type="bearer"
        )

    except Exception as e:
        logger.error(f"Registration error: {e}")
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=str(e)
        )


@router.post("/login", response_model=Token)
def login(form_data: OAuth2PasswordRequestForm = Depends()):
    """
    Login user with email and password (OAuth2 compatible)

    Args:
        form_data: OAuth2 form with username (email) and password

    Returns:
        Access token

    Raises:
        HTTPException 401: If credentials are invalid
    """
    # Authenticate user
    user = user_repository.authenticate_user(
        email=form_data.username,  # OAuth2 uses 'username' field
        password=form_data.password
    )

    if not user:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Incorrect email or password",
            headers={"WWW-Authenticate": "Bearer"},
        )

    # Generate access token
    access_token_expires = timedelta(minutes=ACCESS_TOKEN_EXPIRE_MINUTES)
    access_token = auth_service.create_access_token(
        data={"sub": user.email, "user_id": user.id},
        expires_delta=access_token_expires
    )

    logger.info(f"✅ User logged in: {user.email}")

    return Token(access_token=access_token, token_type="bearer")


@router.post("/login/json", response_model=Token)
def login_json(credentials: UserLogin):
    """
    Login user with JSON body (alternative to OAuth2 form)

    Args:
        credentials: User login data (email, password)

    Returns:
        Access token

    Raises:
        HTTPException 401: If credentials are invalid
    """
    # Authenticate user
    user = user_repository.authenticate_user(
        email=credentials.email,
        password=credentials.password
    )

    if not user:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Incorrect email or password",
            headers={"WWW-Authenticate": "Bearer"},
        )

    # Generate access token
    access_token_expires = timedelta(minutes=ACCESS_TOKEN_EXPIRE_MINUTES)
    access_token = auth_service.create_access_token(
        data={"sub": user.email, "user_id": user.id},
        expires_delta=access_token_expires
    )

    logger.info(f"✅ User logged in (JSON): {user.email}")

    return Token(access_token=access_token, token_type="bearer")


@router.get("/me", response_model=User)
def get_current_user_profile(current_user = Depends(get_current_active_user)):
    """
    Get current user profile

    Args:
        current_user: Current authenticated user (from dependency)

    Returns:
        User profile
    """
    return User(
        id=current_user.id,
        email=current_user.email,
        full_name=current_user.full_name,
        is_active=current_user.is_active,
        is_superuser=current_user.is_superuser,
        created_at=current_user.created_at,
        updated_at=current_user.updated_at
    )


@router.get("/health")
def auth_health():
    """Auth service health check"""
    return {
        "status": "healthy",
        "service": "Authentication Service",
        "token_expiry_minutes": ACCESS_TOKEN_EXPIRE_MINUTES
    }
