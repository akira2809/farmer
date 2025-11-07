# Environment Variables Reference

Complete reference for all environment variables used in NÔNG DÂN AI.

## Quick Setup

```bash
# Copy example file
cp .env.example .env

# Edit with your values
nano .env
```

## MongoDB Configuration

### MONGODB_URI
- **Description**: MongoDB connection string
- **Required**: Yes
- **Default**: `mongodb://localhost:27017`
- **Examples**:
  - Local: `mongodb://localhost:27017`
  - Docker: `mongodb://mongodb:27017`
  - Atlas: `mongodb+srv://user:pass@cluster.mongodb.net`
  - With auth: `mongodb://user:password@localhost:27017`

### MONGODB_DB_NAME
- **Description**: Database name to use
- **Required**: Yes
- **Default**: `nong_dan_ai`
- **Example**: `nong_dan_ai`

## JWT Authentication Configuration

### JWT_SECRET_KEY
- **Description**: Secret key for signing JWT tokens
- **Required**: Yes
- **Security**: Must be kept secret and changed in production
- **Generation**: `openssl rand -hex 32`
- **Example**: `09d25e094faa6ca2556c818166b7a9563b93f7099f6f0f4caa6cf63b88e8d3e7`
- **⚠️ Warning**: Never use the example value in production!

### JWT_ALGORITHM
- **Description**: Algorithm used for JWT signing
- **Required**: Yes
- **Default**: `HS256`
- **Options**: `HS256`, `HS384`, `HS512`, `RS256`, `RS384`, `RS512`
- **Recommended**: `HS256` for symmetric key signing

### ACCESS_TOKEN_EXPIRE_MINUTES
- **Description**: Access token expiration time in minutes
- **Required**: Yes
- **Default**: `15`
- **Recommended**: 15-30 minutes for security
- **Example**: `15`

### REFRESH_TOKEN_EXPIRE_DAYS
- **Description**: Refresh token expiration time in days
- **Required**: Yes
- **Default**: `7`
- **Recommended**: 7-30 days
- **Example**: `7`

## External API Configuration

### WEATHER_API_KEY
- **Description**: API key for weather service
- **Required**: Yes
- **Provider**: WeatherAPI.com or similar
- **How to get**: Sign up at https://www.weatherapi.com/
- **Example**: `abc123def456ghi789jkl012mno345pq`

### WEATHER_API_URL
- **Description**: Base URL for weather API
- **Required**: Yes
- **Default**: `https://api.weatherapi.com/v1`
- **Example**: `https://api.weatherapi.com/v1`

### IMAGE_AI_API_KEY
- **Description**: API key for plant disease diagnosis AI model
- **Required**: Yes
- **Provider**: Your AI model provider
- **Example**: `sk-abc123def456ghi789jkl012mno345pq`

### IMAGE_AI_API_URL
- **Description**: Base URL for image AI API
- **Required**: Yes
- **Example**: `https://api.imageai.com/v1`

### N8N_WEBHOOK_URL
- **Description**: Webhook URL for n8n chatbot workflow
- **Required**: Yes
- **Format**: `http://host:port/webhook/path`
- **Examples**:
  - Local: `http://localhost:5678/webhook/chat`
  - Docker: `http://n8n:5678/webhook/chat`
  - Production: `https://n8n.yourdomain.com/webhook/chat`

## Cloud Storage Configuration

### CLOUD_STORAGE_BUCKET
- **Description**: Cloud storage bucket name for image uploads
- **Required**: Yes
- **Provider**: Google Cloud Storage, AWS S3, or similar
- **Example**: `nong-dan-ai-images`

### CLOUD_STORAGE_CREDENTIALS
- **Description**: Path to cloud storage credentials file
- **Required**: Yes
- **Format**: JSON file path
- **Examples**:
  - Local: `/path/to/credentials.json`
  - Docker: `/app/credentials/gcs-key.json`
- **Note**: For GCS, download service account key JSON file

## Application Configuration

### APP_NAME
- **Description**: Application name
- **Required**: No
- **Default**: `NÔNG DÂN AI`
- **Example**: `NÔNG DÂN AI`

### APP_VERSION
- **Description**: Application version
- **Required**: No
- **Default**: `1.0.0`
- **Example**: `1.0.0`

### DEBUG
- **Description**: Enable debug mode
- **Required**: No
- **Default**: `False`
- **Options**: `True`, `False`
- **⚠️ Warning**: Always set to `False` in production!
- **Development**: `True`
- **Production**: `False`

### CORS_ORIGINS
- **Description**: Allowed CORS origins (JSON array format)
- **Required**: No
- **Default**: `["http://localhost:3000","http://localhost:8080"]`
- **Format**: JSON array of strings
- **Examples**:
  - Development: `["http://localhost:3000","http://localhost:8080"]`
  - Production: `["https://yourdomain.com","https://app.yourdomain.com"]`
  - All origins (not recommended): `["*"]`

## Environment-Specific Examples

### Development (.env.development)

```bash
# MongoDB
MONGODB_URI=mongodb://localhost:27017
MONGODB_DB_NAME=nong_dan_ai_dev

# JWT
JWT_SECRET_KEY=dev-secret-key-change-me
JWT_ALGORITHM=HS256
ACCESS_TOKEN_EXPIRE_MINUTES=30
REFRESH_TOKEN_EXPIRE_DAYS=7

# External APIs (use test keys)
WEATHER_API_KEY=test_key_123
WEATHER_API_URL=https://api.weatherapi.com/v1
IMAGE_AI_API_KEY=test_key_456
IMAGE_AI_API_URL=https://api.imageai.com/v1
N8N_WEBHOOK_URL=http://localhost:5678/webhook/chat

# Cloud Storage (use test bucket)
CLOUD_STORAGE_BUCKET=nong-dan-ai-dev
CLOUD_STORAGE_CREDENTIALS=./credentials-dev.json

# Application
APP_NAME=NÔNG DÂN AI (Dev)
APP_VERSION=1.0.0-dev
DEBUG=True
CORS_ORIGINS=["http://localhost:3000","http://localhost:8080"]
```

### Production (.env.production)

```bash
# MongoDB
MONGODB_URI=mongodb://mongodb:27017
MONGODB_DB_NAME=nong_dan_ai

# JWT (use strong keys!)
JWT_SECRET_KEY=09d25e094faa6ca2556c818166b7a9563b93f7099f6f0f4caa6cf63b88e8d3e7
JWT_ALGORITHM=HS256
ACCESS_TOKEN_EXPIRE_MINUTES=15
REFRESH_TOKEN_EXPIRE_DAYS=7

# External APIs (use production keys)
WEATHER_API_KEY=prod_abc123def456ghi789
WEATHER_API_URL=https://api.weatherapi.com/v1
IMAGE_AI_API_KEY=prod_sk-abc123def456ghi789
IMAGE_AI_API_URL=https://api.imageai.com/v1
N8N_WEBHOOK_URL=http://n8n:5678/webhook/chat

# Cloud Storage (use production bucket)
CLOUD_STORAGE_BUCKET=nong-dan-ai-prod
CLOUD_STORAGE_CREDENTIALS=/app/credentials/gcs-prod.json

# Application
APP_NAME=NÔNG DÂN AI
APP_VERSION=1.0.0
DEBUG=False
CORS_ORIGINS=["https://yourdomain.com"]
```

### Docker Compose (.env)

```bash
# MongoDB
MONGODB_URI=mongodb://mongodb:27017
MONGODB_DB_NAME=nong_dan_ai

# JWT
JWT_SECRET_KEY=your-secret-key-here-change-in-production
JWT_ALGORITHM=HS256
ACCESS_TOKEN_EXPIRE_MINUTES=15
REFRESH_TOKEN_EXPIRE_DAYS=7

# External APIs
WEATHER_API_KEY=your-weather-api-key
WEATHER_API_URL=https://api.weatherapi.com/v1
IMAGE_AI_API_KEY=your-image-ai-api-key
IMAGE_AI_API_URL=https://api.imageai.com/v1
N8N_WEBHOOK_URL=http://n8n:5678/webhook/chat

# Cloud Storage
CLOUD_STORAGE_BUCKET=nong-dan-ai-images
CLOUD_STORAGE_CREDENTIALS=/app/credentials/gcs-key.json

# Application
APP_NAME=NÔNG DÂN AI
APP_VERSION=1.0.0
DEBUG=False
CORS_ORIGINS=["http://localhost:3000","http://localhost:8080"]
```

## Security Best Practices

### 1. Secret Key Generation

```bash
# Generate strong JWT secret
openssl rand -hex 32

# Generate random password
openssl rand -base64 24

# Generate UUID
python -c "import uuid; print(uuid.uuid4())"
```

### 2. Never Commit Secrets

Add to `.gitignore`:
```
.env
.env.local
.env.*.local
.env.production
credentials*.json
```

### 3. Use Environment-Specific Files

- `.env.example` - Template (commit to git)
- `.env` - Local development (never commit)
- `.env.production` - Production (never commit)
- `.env.test` - Testing (never commit)

### 4. Rotate Keys Regularly

- Change JWT_SECRET_KEY every 90 days
- Rotate API keys according to provider recommendations
- Update passwords quarterly

### 5. Principle of Least Privilege

- Use read-only credentials where possible
- Limit API key permissions
- Use separate keys for dev/staging/prod

## Validation

### Check Required Variables

```python
# Python script to validate environment
import os

required_vars = [
    'MONGODB_URI',
    'MONGODB_DB_NAME',
    'JWT_SECRET_KEY',
    'WEATHER_API_KEY',
    'IMAGE_AI_API_KEY',
    'N8N_WEBHOOK_URL',
    'CLOUD_STORAGE_BUCKET',
]

missing = [var for var in required_vars if not os.getenv(var)]

if missing:
    print(f"Missing required variables: {', '.join(missing)}")
else:
    print("All required variables are set!")
```

### Test Configuration

```bash
# Test MongoDB connection
docker-compose exec api python -c "from app.core.database import connect_to_mongo; import asyncio; asyncio.run(connect_to_mongo())"

# Test API health
curl http://localhost:8000/health

# Verify environment variables are loaded
docker-compose exec api python -c "from app.core.config import settings; print(settings.APP_NAME)"
```

## Troubleshooting

### Common Issues

1. **"JWT_SECRET_KEY not set"**
   - Ensure `.env` file exists
   - Check variable name spelling
   - Verify file is in correct directory

2. **"MongoDB connection failed"**
   - Check MONGODB_URI format
   - Verify MongoDB is running
   - Check network connectivity

3. **"CORS error"**
   - Verify CORS_ORIGINS includes your frontend URL
   - Check JSON array format
   - Ensure no trailing slashes in URLs

4. **"API key invalid"**
   - Verify API key is correct
   - Check for extra spaces or quotes
   - Ensure key has required permissions

## Additional Resources

- [Pydantic Settings Documentation](https://docs.pydantic.dev/latest/concepts/pydantic_settings/)
- [FastAPI Environment Variables](https://fastapi.tiangolo.com/advanced/settings/)
- [12-Factor App Config](https://12factor.net/config)
