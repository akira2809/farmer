# Input Validation Rules

## Overview

Tất cả các API endpoints đều có validation đầu vào nghiêm ngặt để đảm bảo tính toàn vẹn dữ liệu và bảo mật.

## User Registration Validation

### Full Name
- **Required**: Yes
- **Min Length**: 2 characters
- **Max Length**: 100 characters
- **Format**: Chỉ chấp nhận chữ cái (bao gồm tiếng Việt có dấu) và khoảng trắng
- **Rules**:
  - Không được để trống hoặc chỉ có khoảng trắng
  - Tự động trim khoảng trắng đầu/cuối

**Valid Examples:**
```
✓ "Nguyễn Văn A"
✓ "Trần Thị Bích Ngọc"
✓ "Lê Hoàng"
```

**Invalid Examples:**
```
✗ "A" (quá ngắn)
✗ "Nguyen123" (chứa số)
✗ "Nguyen@Van" (chứa ký tự đặc biệt)
✗ "   " (chỉ có khoảng trắng)
```

### Phone Number
- **Required**: Yes
- **Format**: Số điện thoại Việt Nam
  - Bắt đầu bằng `0` và có 10 chữ số: `0xxxxxxxxx`
  - Hoặc bắt đầu bằng `+84` và có 9-10 chữ số: `+84xxxxxxxxx`
- **Rules**:
  - Tự động loại bỏ khoảng trắng và dấu gạch ngang
  - Phải là số điện thoại Việt Nam hợp lệ

**Valid Examples:**
```
✓ "0123456789"
✓ "0987654321"
✓ "+84123456789"
✓ "+84987654321"
✓ "0123 456 789" (sẽ được chuẩn hóa thành 0123456789)
✓ "0123-456-789" (sẽ được chuẩn hóa thành 0123456789)
```

**Invalid Examples:**
```
✗ "123456789" (thiếu số 0 hoặc +84)
✗ "01234" (quá ngắn)
✗ "0123456789012" (quá dài)
✗ "+1234567890" (không phải số Việt Nam)
```

### Password
- **Required**: Yes
- **Min Length**: 8 characters
- **Max Length**: 100 characters
- **Rules**:
  - Phải chứa ít nhất 1 chữ cái (A-Z hoặc a-z)
  - Phải chứa ít nhất 1 chữ số (0-9)
  - Có thể chứa ký tự đặc biệt

**Valid Examples:**
```
✓ "password123"
✓ "MyPass123"
✓ "Secure@Pass1"
✓ "12345678a"
```

**Invalid Examples:**
```
✗ "pass123" (quá ngắn, dưới 8 ký tự)
✗ "password" (không có số)
✗ "12345678" (không có chữ cái)
```

### Confirm Password
- **Required**: Yes
- **Rules**:
  - Phải khớp với trường `password`
  - Validation này được thực hiện ở model level

### Province
- **Required**: Yes
- **Min Length**: 2 characters
- **Max Length**: 100 characters
- **Rules**:
  - Không được để trống hoặc chỉ có khoảng trắng
  - Tự động trim khoảng trắng đầu/cuối

**Valid Examples:**
```
✓ "Hà Nội"
✓ "TP. Hồ Chí Minh"
✓ "Đà Nẵng"
✓ "Cần Thơ"
```

**Invalid Examples:**
```
✗ "H" (quá ngắn)
✗ "   " (chỉ có khoảng trắng)
```

## Login Validation

### Phone Number
- **Required**: Yes
- **Rules**:
  - Không được để trống
  - Tự động loại bỏ khoảng trắng và dấu gạch ngang
  - Không validate format nghiêm ngặt (để tránh lộ thông tin user có tồn tại hay không)

### Password
- **Required**: Yes
- **Rules**:
  - Không được để trống
  - Không validate format (để tránh lộ thông tin)

## Refresh Token Validation

### Refresh Token
- **Required**: Yes
- **Min Length**: 10 characters
- **Rules**:
  - Không được để trống
  - Phải có độ dài tối thiểu 10 ký tự

## Validation Error Response Format

Khi validation thất bại, API sẽ trả về response với format:

### Single Field Error

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

### Multiple Field Errors

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
        "message": "Invalid phone number format. Use Vietnamese format: 0xxxxxxxxx or +84xxxxxxxxx"
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

## Validation Error Examples

### 1. Missing Required Field

**Request:**
```json
{
  "full_name": "Nguyen Van A",
  "password": "password123",
  "confirm_password": "password123",
  "province": "Ha Noi"
}
```

**Response (422):**
```json
{
  "success": false,
  "message": "Validation error: This field is required",
  "data": null,
  "error": {
    "code": "VALIDATION_ERROR",
    "message": "Validation error: This field is required",
    "errors": [
      {
        "field": "phone",
        "message": "This field is required"
      }
    ]
  }
}
```

### 2. Invalid Phone Format

**Request:**
```json
{
  "full_name": "Nguyen Van A",
  "phone": "123",
  "password": "password123",
  "confirm_password": "password123",
  "province": "Ha Noi"
}
```

**Response (422):**
```json
{
  "success": false,
  "message": "Validation error: Invalid phone number format. Use Vietnamese format: 0xxxxxxxxx or +84xxxxxxxxx",
  "data": null,
  "error": {
    "code": "VALIDATION_ERROR",
    "message": "Validation error: Invalid phone number format. Use Vietnamese format: 0xxxxxxxxx or +84xxxxxxxxx",
    "errors": [
      {
        "field": "phone",
        "message": "Invalid phone number format. Use Vietnamese format: 0xxxxxxxxx or +84xxxxxxxxx"
      }
    ]
  }
}
```

### 3. Weak Password

**Request:**
```json
{
  "full_name": "Nguyen Van A",
  "phone": "0123456789",
  "password": "password",
  "confirm_password": "password",
  "province": "Ha Noi"
}
```

**Response (422):**
```json
{
  "success": false,
  "message": "Validation error: Password must contain at least one number",
  "data": null,
  "error": {
    "code": "VALIDATION_ERROR",
    "message": "Validation error: Password must contain at least one number",
    "errors": [
      {
        "field": "password",
        "message": "Password must contain at least one number"
      }
    ]
  }
}
```

### 4. Password Mismatch

**Request:**
```json
{
  "full_name": "Nguyen Van A",
  "phone": "0123456789",
  "password": "password123",
  "confirm_password": "password456",
  "province": "Ha Noi"
}
```

**Response (422):**
```json
{
  "success": false,
  "message": "Validation error: Passwords do not match",
  "data": null,
  "error": {
    "code": "VALIDATION_ERROR",
    "message": "Validation error: Passwords do not match",
    "errors": [
      {
        "field": "confirm_password",
        "message": "Passwords do not match"
      }
    ]
  }
}
```

### 5. Invalid Full Name

**Request:**
```json
{
  "full_name": "Nguyen123",
  "phone": "0123456789",
  "password": "password123",
  "confirm_password": "password123",
  "province": "Ha Noi"
}
```

**Response (422):**
```json
{
  "success": false,
  "message": "Validation error: Full name can only contain letters and spaces",
  "data": null,
  "error": {
    "code": "VALIDATION_ERROR",
    "message": "Validation error: Full name can only contain letters and spaces",
    "errors": [
      {
        "field": "full_name",
        "message": "Full name can only contain letters and spaces"
      }
    ]
  }
}
```

## Best Practices for Client-Side

1. **Pre-validate on Client**: Validate input trước khi gửi request để cải thiện UX
2. **Show Field-Specific Errors**: Sử dụng `error.errors` array để hiển thị lỗi tại đúng input field
3. **Display All Errors**: Hiển thị tất cả lỗi validation cùng lúc thay vì từng lỗi một
4. **Clear Error Messages**: Hiển thị `error.message` cho từng field
5. **Handle All Cases**: Xử lý cả validation errors (422) và business logic errors (200 with success=false)

## Client-Side Validation Example (JavaScript)

```javascript
function validateRegistration(formData) {
  const errors = {};
  
  // Full name validation
  if (!formData.full_name || formData.full_name.trim().length < 2) {
    errors.full_name = 'Full name must be at least 2 characters';
  } else if (!/^[a-zA-ZÀ-ỹ\s]+$/.test(formData.full_name)) {
    errors.full_name = 'Full name can only contain letters and spaces';
  }
  
  // Phone validation
  const phoneClean = formData.phone.replace(/[\s\-]/g, '');
  if (!/^(\+84|0)[0-9]{9,10}$/.test(phoneClean)) {
    errors.phone = 'Invalid phone number format';
  }
  
  // Password validation
  if (formData.password.length < 8) {
    errors.password = 'Password must be at least 8 characters';
  } else if (!/[A-Za-z]/.test(formData.password)) {
    errors.password = 'Password must contain at least one letter';
  } else if (!/[0-9]/.test(formData.password)) {
    errors.password = 'Password must contain at least one number';
  }
  
  // Confirm password validation
  if (formData.password !== formData.confirm_password) {
    errors.confirm_password = 'Passwords do not match';
  }
  
  // Province validation
  if (!formData.province || formData.province.trim().length < 2) {
    errors.province = 'Province must be at least 2 characters';
  }
  
  return {
    isValid: Object.keys(errors).length === 0,
    errors
  };
}

// Handle API response with multiple errors
async function handleRegistration(formData) {
  try {
    const response = await fetch('/api/auth/register', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(formData)
    });
    
    const result = await response.json();
    
    if (result.success) {
      // Success
      console.log('Registration successful:', result.data);
      return { success: true };
    } else {
      // Handle errors
      if (result.error?.errors && result.error.errors.length > 0) {
        // Multiple field errors
        const fieldErrors = {};
        result.error.errors.forEach(err => {
          fieldErrors[err.field] = err.message;
        });
        return { success: false, errors: fieldErrors };
      } else {
        // Single general error
        return { success: false, message: result.message };
      }
    }
  } catch (error) {
    return { success: false, message: 'Network error' };
  }
}

// Display errors in form
function displayErrors(errors) {
  // Clear previous errors
  document.querySelectorAll('.error-message').forEach(el => el.remove());
  
  // Display new errors
  Object.keys(errors).forEach(field => {
    const input = document.querySelector(`[name="${field}"]`);
    if (input) {
      const errorDiv = document.createElement('div');
      errorDiv.className = 'error-message';
      errorDiv.textContent = errors[field];
      input.parentElement.appendChild(errorDiv);
      input.classList.add('error');
    }
  });
}
```

## Security Considerations

1. **Password Strength**: Yêu cầu password phải có chữ và số để tăng độ bảo mật
2. **Phone Format**: Chỉ chấp nhận số điện thoại Việt Nam để tránh spam
3. **Input Sanitization**: Tự động trim và clean input để tránh injection attacks
4. **Error Messages**: Không tiết lộ thông tin nhạy cảm trong error messages (ví dụ: không nói "phone exists" trong login)
