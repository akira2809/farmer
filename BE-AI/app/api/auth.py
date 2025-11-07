from fastapi import APIRouter, status
from typing import Dict, Any

from app.models.user import (
    UserRegistration,
    LoginCredentials,
    TokenResponse,
    RefreshTokenRequest,
    UserResponse
)
from app.models.api_response import APIResponse, success_response, error_response
from app.services.auth_service import AuthService


router = APIRouter(prefix="/api/auth", tags=["Authentication"])


@router.post("/register", response_model=APIResponse[UserResponse], status_code=status.HTTP_201_CREATED)
async def register(user_data: UserRegistration) -> Dict[str, Any]:
    """
    Register a new user.
    
    - **full_name**: User's full name
    - **phone**: Phone number (10-15 digits)
    - **password**: Password (minimum 8 characters)
    - **confirm_password**: Password confirmation
    - **province**: User's province/city
    """
    auth_service = AuthService()
    
    try:
        user = await auth_service.register_user(user_data)
        return success_response(
            data=user.model_dump(),
            message="User registered successfully"
        )
    except ValueError as e:
        error_msg = str(e)
        if "already registered" in error_msg:
            return error_response(
                message=error_msg,
                code="PHONE_ALREADY_EXISTS"
            )
        elif "Passwords do not match" in error_msg:
            return error_response(
                message=error_msg,
                code="PASSWORD_MISMATCH"
            )
        return error_response(
            message=error_msg,
            code="REGISTRATION_FAILED"
        )


@router.post("/login", response_model=APIResponse[TokenResponse])
async def login(credentials: LoginCredentials) -> Dict[str, Any]:
    """
    Login with phone and password.
    
    Returns both access token (15 minutes) and refresh token (7 days).
    
    - **phone**: User's phone number
    - **password**: User's password
    """
    auth_service = AuthService()
    
    try:
        tokens = await auth_service.login_user(credentials)
        return success_response(
            data=tokens.model_dump(),
            message="Login successful"
        )
    except ValueError as e:
        return error_response(
            message="Invalid phone number or password",
            code="INVALID_CREDENTIALS"
        )


@router.post("/refresh", response_model=APIResponse[TokenResponse])
async def refresh_token(request: RefreshTokenRequest) -> Dict[str, Any]:
    """
    Get a new access token using refresh token.
    
    - **refresh_token**: Valid refresh token
    """
    auth_service = AuthService()
    
    try:
        tokens = await auth_service.refresh_access_token(request.refresh_token)
        return success_response(
            data=tokens.model_dump(),
            message="Token refreshed successfully"
        )
    except ValueError as e:
        return error_response(
            message="Invalid or expired refresh token",
            code="INVALID_REFRESH_TOKEN"
        )


@router.post("/logout", response_model=APIResponse[None])
async def logout(request: RefreshTokenRequest) -> Dict[str, Any]:
    """
    Logout by revoking the refresh token.
    
    - **refresh_token**: Refresh token to revoke
    """
    auth_service = AuthService()
    
    revoked = await auth_service.revoke_refresh_token(request.refresh_token)
    
    if not revoked:
        return error_response(
            message="Invalid refresh token",
            code="INVALID_REFRESH_TOKEN"
        )
    
    return success_response(
        message="Logout successful"
    )
