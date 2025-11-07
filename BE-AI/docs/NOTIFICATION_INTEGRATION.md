# Notification Integration Guide

This document provides guidance on how to integrate notification creation in other services.

## Overview

The notification system is implemented and ready to be integrated into other services. When implementing features like disease diagnosis or weather alerts, use the NotificationService helper methods to create notifications for users.

## Integration Points

### 1. Disease Diagnosis (DiagnosisService)

When implementing the DiagnosisService (Task 5.3), integrate notification creation when a disease is detected:

```python
from app.services.notification_service import NotificationService

class DiagnosisService:
    def __init__(self, db: AsyncIOMotorDatabase):
        self.db = db
        self.notification_service = NotificationService(db)
    
    async def create_diagnosis_record(self, diagnosis_data):
        # ... save diagnosis to database ...
        
        # Create notification for disease detection
        await self.notification_service.create_disease_notification(
            user_id=diagnosis_data.user_id,
            disease_name=diagnosis_data.disease_result["disease_name"],
            farm_name=farm.name  # Optional: get farm name from farm_id
        )
        
        return diagnosis
```

### 2. Weather Alerts (WeatherService)

If implementing weather alert functionality, use the weather alert notification helper:

```python
from app.services.notification_service import NotificationService

class WeatherService:
    def __init__(self, db: AsyncIOMotorDatabase):
        self.db = db
        self.notification_service = NotificationService(db)
    
    async def check_weather_alerts(self, user_id: str, weather_data: dict):
        # Check for severe weather conditions
        if weather_data.get("rainfall") > 50:  # Example threshold
            await self.notification_service.create_weather_alert_notification(
                user_id=user_id,
                alert_message="Heavy rain expected in your area. Consider protective measures for your crops."
            )
```

## Available Helper Methods

### create_disease_notification

Creates a notification when a disease is detected on a farm.

**Parameters:**
- `user_id` (str): ID of the user to notify
- `disease_name` (str): Name of the detected disease
- `farm_name` (str, optional): Name of the farm for context

**Example:**
```python
await notification_service.create_disease_notification(
    user_id="user123",
    disease_name="Rice Blast",
    farm_name="North Field"
)
```

### create_weather_alert_notification

Creates a notification for weather alerts.

**Parameters:**
- `user_id` (str): ID of the user to notify
- `alert_message` (str): Weather alert message

**Example:**
```python
await notification_service.create_weather_alert_notification(
    user_id="user123",
    alert_message="Heavy rain expected in your area. Consider protective measures."
)
```

### create_notification (Generic)

For custom notification types, use the generic create_notification method:

```python
from app.models.notification import NotificationCreate, NotificationType

notification_data = NotificationCreate(
    user_id="user123",
    message="Your custom message here",
    type=NotificationType.SYSTEM
)

await notification_service.create_notification(notification_data)
```

## Notification Types

The system supports three notification types:

1. **DISEASE_DETECTED**: For plant disease detection alerts
2. **WEATHER_ALERT**: For weather-related warnings
3. **SYSTEM**: For general system notifications

## Best Practices

1. **Always create notifications asynchronously** - Don't block the main operation
2. **Keep messages concise and actionable** - Users should understand what action to take
3. **Include context** - Add farm names or specific details when available
4. **Handle errors gracefully** - Notification creation should not fail the main operation

```python
try:
    await notification_service.create_disease_notification(...)
except Exception as e:
    # Log the error but don't fail the diagnosis
    logger.error(f"Failed to create notification: {e}")
```

## Testing

When testing services that create notifications, verify:

1. Notifications are created with correct data
2. Notifications are associated with the correct user
3. Notification type is set correctly
4. Message content is appropriate

Example test:
```python
async def test_diagnosis_creates_notification():
    # Create diagnosis
    diagnosis = await diagnosis_service.create_diagnosis_record(...)
    
    # Verify notification was created
    notifications = await notification_service.get_user_notifications(user_id)
    assert len(notifications) == 1
    assert notifications[0].type == NotificationType.DISEASE_DETECTED
    assert "disease_name" in notifications[0].message
```
