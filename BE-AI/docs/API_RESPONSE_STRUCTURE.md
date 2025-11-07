# API Response Structure

## Overview

Tất cả các API endpoints đều trả về response theo cấu trúc chuẩn với wrapper `APIResponse` để đảm bảo tính nhất quán và dễ dàng xử lý ở phía client.

## Response Format

### Success Response

```json
{
  "success": true,
  "message": "Operation completed successfully",
  "data": {
    // Response data here
  },
  "error": null
}
```

### Error Response (Single Error)

```json
{
  "success": false,
  "message": "Error message",
  "data": null,
  "error": {
    "code": "ERROR_CODE",
    "message": "Detailed error message",
    "errors": null
  }
}
```

### Error Response (Multiple Validation Errors)

```json
{
  "success": false,
  "message": "Validation failed for 3 field(s)",
  "data": null,
  "error": {
    "code": "VALIDATION_ERROR",
    "message": "Validation failed for 3 field(s)",
    "errors": [
      {
        "field": "phone",
        "message": "Invalid phone number format"
      },
      {
        "field": "password",
        "message": "Must be at least 8 characters"
      },
      {
        "field": "full_name",
        "message": "This field is required"
      }
    ]
  }
}
```

## Fields Description

| Field | Type | Description |
|-------|------|-------------|
| `success` | boolean | Indicates whether the request was successful |
| `message` | string | Human-readable message describing the result |
| `data` | object/null | Response data (null if error) |
| `error` | object/null | Error details (null if success) |
| `error.code` | string | Machine-readable error code |
| `error.message` | string | Detailed error message |
| `error.errors` | array/null | List of field-specific errors (for validation errors) |
| `error.errors[].field` | string | Field name causing the error |
| `error.errors[].message` | string | Error message for this specific field |

## Error Codes

### Authentication Errors

| Code | Description |
|------|-------------|
| `INVALID_CREDENTIALS` | Invalid phone number or password |
| `PHONE_ALREADY_EXISTS` | Phone number already registered |
| `PASSWORD_MISMATCH` | Password and confirm password do not match |
| `INVALID_REFRESH_TOKEN` | Invalid or expired refresh token |
| `REGISTRATION_FAILED` | User registration failed |

### Validation Errors

| Code | Description |
|------|-------------|
| `VALIDATION_ERROR` | Request validation failed |

### General Errors

| Code | Description |
|------|-------------|
| `INTERNAL_ERROR` | Internal server error |

## Examples

### 1. Successful Registration

**Request:**
```bash
POST /api/auth/register
{
  "full_name": "Nguyen Van A",
  "phone": "0123456789",
  "password": "password123",
  "confirm_password": "password123",
  "province": "Ha Noi"
}
```

**Response (201 Created):**
```json
{
  "success": true,
  "message": "User registered successfully",
  "data": {
    "id": "507f1f77bcf86cd799439011",
    "full_name": "Nguyen Van A",
    "phone": "0123456789",
    "province": "Ha Noi",
    "created_at": "2024-01-15T10:30:00Z"
  },
  "error": null
}
```

### 2. Multiple Validation Errors

**Request:**
```bash
POST /api/auth/register
{
  "phone": "123",
  "password": "short"
}
```

**Response (422 Unprocessable Entity):**
```json
{
  "success": false,
  "message": "Validation failed for 4 field(s)",
  "data": null,
  "error": {
    "code": "VALIDATION_ERROR",
    "message": "Validation failed for 4 field(s)",
    "errors": [
      {
        "field": "full_name",
        "message": "This field is required"
      },
      {
        "field": "phone",
        "message": "Invalid phone number format. Use Vietnamese format: 0xxxxxxxxx or +84xxxxxxxxx"
      },
      {
        "field": "password",
        "message": "Must be at least 8 characters"
      },
      {
        "field": "province",
        "message": "This field is required"
      }
    ]
  }
}
```

### 3. Failed Registration (Phone Already Exists)

**Request:**
```bash
POST /api/auth/register
{
  "full_name": "Nguyen Van B",
  "phone": "0123456789",
  "password": "password123",
  "confirm_password": "password123",
  "province": "Ha Noi"
}
```

**Response (201 Created with error):**
```json
{
  "success": false,
  "message": "Phone number already registered",
  "data": null,
  "error": {
    "code": "PHONE_ALREADY_EXISTS",
    "message": "Phone number already registered",
    "errors": null
  }
}
```

### 4. Successful Login

**Request:**
```bash
POST /api/auth/login
{
  "phone": "0123456789",
  "password": "password123"
}
```

**Response (200 OK):**
```json
{
  "success": true,
  "message": "Login successful",
  "data": {
    "access_token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
    "refresh_token": "a1b2c3d4e5f6g7h8i9j0k1l2m3n4o5p6",
    "token_type": "bearer",
    "expires_in": 900
  },
  "error": null
}
```

### 5. Failed Login

**Request:**
```bash
POST /api/auth/login
{
  "phone": "0123456789",
  "password": "wrongpassword"
}
```

**Response (200 OK with error):**
```json
{
  "success": false,
  "message": "Invalid phone number or password",
  "data": null,
  "error": {
    "code": "INVALID_CREDENTIALS",
    "message": "Invalid phone number or password",
    "field": null
  }
}
```

### 6. Single Validation Error

**Request:**
```bash
POST /api/auth/register
{
  "full_name": "A",
  "phone": "123",
  "password": "short"
}
```

**Response (422 Unprocessable Entity):**
```json
{
  "success": false,
  "message": "Validation error: Must be at least 8 characters",
  "data": null,
  "error": {
    "code": "VALIDATION_ERROR",
    "message": "Validation error: Must be at least 8 characters",
    "errors": [
      {
        "field": "password",
        "message": "Must be at least 8 characters"
      }
    ]
  }
}
```

## Client-Side Handling

### JavaScript/TypeScript Example

```typescript
interface FieldError {
  field: string;
  message: string;
}

interface ErrorDetail {
  code: string;
  message: string;
  errors?: FieldError[] | null;
}

interface APIResponse<T> {
  success: boolean;
  message: string;
  data: T | null;
  error: ErrorDetail | null;
}

async function login(phone: string, password: string) {
  const response = await fetch('/api/auth/login', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ phone, password })
  });
  
  const result: APIResponse<TokenResponse> = await response.json();
  
  if (result.success) {
    // Handle success
    console.log('Login successful:', result.data);
    localStorage.setItem('access_token', result.data.access_token);
    localStorage.setItem('refresh_token', result.data.refresh_token);
  } else {
    // Handle error
    console.error('Login failed:', result.error);
    
    // Handle validation errors
    if (result.error?.errors && result.error.errors.length > 0) {
      // Display field-specific errors
      result.error.errors.forEach(err => {
        console.error(`${err.field}: ${err.message}`);
        // Show error next to the specific field in your form
        showFieldError(err.field, err.message);
      });
    } else {
      // Display general error
      alert(result.message);
    }
  }
}

function showFieldError(field: string, message: string) {
  const fieldElement = document.querySelector(`[name="${field}"]`);
  if (fieldElement) {
    const errorElement = document.createElement('div');
    errorElement.className = 'error-message';
    errorElement.textContent = message;
    fieldElement.parentElement?.appendChild(errorElement);
  }
}
```

## Benefits

1. **Consistency**: All endpoints follow the same response structure
2. **Easy Error Handling**: Client can check `success` field to determine outcome
3. **Detailed Error Information**: Error codes and messages help with debugging
4. **Multiple Field Errors**: All validation errors returned at once for better UX
5. **Type Safety**: Generic type support for TypeScript/typed languages
6. **User-Friendly**: Clear messages for end users
7. **Developer-Friendly**: Error codes for programmatic handling
8. **Field-Specific Errors**: Easy to map errors to form fields
