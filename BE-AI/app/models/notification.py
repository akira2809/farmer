from datetime import datetime
from typing import Optional, Literal, List
from pydantic import BaseModel, Field, field_validator
from bson import ObjectId
from enum import Enum

from app.models.base import PyObjectId


class NotificationType(str, Enum):
    """Enum for notification types"""
    WEATHER_ALERT = "weather_alert"
    DISEASE_DETECTED = "disease_detected"
    SYSTEM = "system"


class NotificationInDB(BaseModel):
    """Notification model stored in MongoDB"""
    id: Optional[PyObjectId] = Field(default=None, alias="_id")
    user_id: str
    message: str
    type: NotificationType
    read_status: bool = False
    created_at: datetime = Field(default_factory=datetime.utcnow)
    
    class Config:
        populate_by_name = True
        arbitrary_types_allowed = True
        json_encoders = {
            ObjectId: str,
            datetime: lambda v: v.isoformat()
        }


class NotificationCreate(BaseModel):
    """Schema for creating a new notification"""
    user_id: str = Field(..., min_length=1)
    message: str = Field(..., min_length=1, max_length=500)
    type: NotificationType
    
    @field_validator('message')
    @classmethod
    def validate_message(cls, v: str) -> str:
        """Validate message is not empty"""
        v = v.strip()
        if not v:
            raise ValueError('Message cannot be empty or whitespace only')
        return v


class NotificationResponse(BaseModel):
    """Schema for notification response"""
    id: str
    user_id: str
    message: str
    type: NotificationType
    read_status: bool
    created_at: datetime
    
    class Config:
        json_encoders = {
            datetime: lambda v: v.isoformat()
        }


class PaginatedNotificationResponse(BaseModel):
    """Schema for paginated notification response"""
    notifications: List[NotificationResponse]
    total: int
    unread_count: int
    page: int
    page_size: int
    total_pages: int
