# NÔNG DÂN AI

Hệ thống hỗ trợ nông dân thông minh với AI - Smart farming support system with AI integration.

## Features

- 🔐 User authentication with JWT (Access & Refresh tokens)
- 🌾 Farm management with geospatial data and crop tracking
- 🌤️ Weather forecast integration
- 🔬 Plant disease diagnosis from images using AI
- 💬 AI chatbot for farming consultation (via n8n workflow)
- 🔔 Notification system

## Project Structure

```
.
├── app/
│   ├── api/          # API endpoints (auth, farms, weather, notifications)
│   ├── core/         # Core configuration, database, exception handlers
│   ├── models/       # Pydantic models and MongoDB schemas
│   ├── services/     # Business logic services
│   └── utils/        # Utility functions and helpers
├── docs/             # Additional documentation
├── main.py           # FastAPI application entry point
├── requirements.txt  # Python dependencies
├── Dockerfile        # Docker configuration
├── docker-compose.yml # Docker Compose orchestration
└── .env.example      # Environment variables template
```

## Quick Start with Docker (Recommended)

### Prerequisites

- Docker 20.10+
- Docker Compose 2.0+

### Setup and Run

1. Clone the repository:
   ```bash
   git clone <repository-url>
   cd nong-dan-ai
   ```

2. Create environment file:
   ```bash
   cp .env.example .env
   ```

3. Configure your `.env` file with required API keys and secrets (see Environment Variables section below)

4. Start all services:
   ```bash
   docker-compose up -d
   ```

5. Check service health:
   ```bash
   docker-compose ps
   ```

The services will be available at:
- **FastAPI Application**: http://localhost:8000
- **API Documentation (Swagger)**: http://localhost:8000/docs
- **API Documentation (ReDoc)**: http://localhost:8000/redoc
- **Health Check**: http://localhost:8000/health
- **n8n Workflow Editor**: http://localhost:5678 (admin/changeme)
- **MongoDB**: localhost:27017

### Docker Commands

```bash
# Start services
docker-compose up -d

# View logs
docker-compose logs -f api

# Stop services
docker-compose down

# Rebuild after code changes
docker-compose up -d --build

# Stop and remove volumes (WARNING: deletes all data)
docker-compose down -v
```

## Local Development Setup (Without Docker)

### Prerequisites

- Python 3.10+
- MongoDB 5.0+
- n8n (for chatbot workflow)

### Installation

1. Clone the repository

2. Create a virtual environment:
   ```bash
   python -m venv venv
   
   # On Windows
   venv\Scripts\activate
   
   # On Unix/Mac
   source venv/bin/activate
   ```

3. Install dependencies:
   ```bash
   pip install -r requirements.txt
   ```

4. Copy `.env.example` to `.env` and configure:
   ```bash
   cp .env.example .env
   ```

5. Update the `.env` file with your configuration

6. Start MongoDB locally (if not using Docker)

7. Start n8n locally (if not using Docker):
   ```bash
   npx n8n
   ```

### Running the Application

```bash
# Development mode with auto-reload
uvicorn main:app --reload

# Production mode
uvicorn main:app --host 0.0.0.0 --port 8000
```

## Environment Variables

### Required Variables

| Variable | Description | Example |
|----------|-------------|---------|
| `MONGODB_URI` | MongoDB connection string | `mongodb://localhost:27017` |
| `MONGODB_DB_NAME` | Database name | `nong_dan_ai` |
| `JWT_SECRET_KEY` | Secret key for JWT signing (change in production!) | `your-secret-key-here` |
| `JWT_ALGORITHM` | JWT algorithm | `HS256` |
| `ACCESS_TOKEN_EXPIRE_MINUTES` | Access token expiration | `15` |
| `REFRESH_TOKEN_EXPIRE_DAYS` | Refresh token expiration | `7` |

### External API Configuration

| Variable | Description | Required |
|----------|-------------|----------|
| `WEATHER_API_KEY` | Weather service API key | Yes |
| `WEATHER_API_URL` | Weather API base URL | Yes |
| `IMAGE_AI_API_KEY` | Image AI model API key | Yes |
| `IMAGE_AI_API_URL` | Image AI API base URL | Yes |
| `N8N_WEBHOOK_URL` | n8n webhook endpoint | Yes |

### Cloud Storage Configuration

| Variable | Description | Required |
|----------|-------------|----------|
| `CLOUD_STORAGE_BUCKET` | Cloud storage bucket name | Yes |
| `CLOUD_STORAGE_CREDENTIALS` | Path to credentials file | Yes |

### Application Configuration

| Variable | Description | Default |
|----------|-------------|---------|
| `APP_NAME` | Application name | `NÔNG DÂN AI` |
| `APP_VERSION` | Application version | `1.0.0` |
| `DEBUG` | Debug mode | `False` |
| `CORS_ORIGINS` | Allowed CORS origins (JSON array) | `["http://localhost:3000"]` |

See `.env.example` for complete configuration template.

## API Documentation

### Interactive Documentation

Once the application is running, visit:
- **Swagger UI**: http://localhost:8000/docs - Interactive API testing
- **ReDoc**: http://localhost:8000/redoc - Clean API documentation

### Main Endpoints

#### Authentication
- `POST /api/auth/register` - Register new user
- `POST /api/auth/login` - Login and get tokens
- `POST /api/auth/refresh` - Refresh access token
- `POST /api/auth/logout` - Logout and revoke refresh token

#### Farm Management
- `POST /api/farms` - Create new farm
- `GET /api/farms` - List user's farms (with optional crop_status filter)
- `GET /api/farms/{farm_id}` - Get farm details
- `PATCH /api/farms/{farm_id}` - Update farm information
- `PATCH /api/farms/{farm_id}/status` - Update crop status

#### Weather
- `GET /api/weather/farm/{farm_id}` - Get weather forecast for farm location

#### Notifications
- `GET /api/notifications` - Get user notifications
- `PATCH /api/notifications/{notification_id}/read` - Mark notification as read

#### Health & Info
- `GET /health` - Health check endpoint
- `GET /` - Root endpoint with API information

### Authentication

Most endpoints require authentication. Include the access token in the Authorization header:

```
Authorization: Bearer <access_token>
```

Access tokens expire after 15 minutes. Use the refresh token to get a new access token via `/api/auth/refresh`.

## Development

### Running Tests

```bash
# Run all tests
pytest

# Run with coverage
pytest --cov=app

# Run specific test file
pytest tests/test_auth.py
```

### Code Style

This project follows PEP 8 style guidelines.

### Project Architecture

The application follows a layered architecture:

- **API Layer** (`app/api/`): HTTP request/response handling
- **Service Layer** (`app/services/`): Business logic
- **Models Layer** (`app/models/`): Data validation and schemas
- **Core Layer** (`app/core/`): Configuration and infrastructure

See `docs/` folder for detailed documentation on:
- API Response Structure
- Input Validation
- Notification Integration

## n8n Chatbot Workflow Setup

1. Access n8n at http://localhost:5678
2. Login with credentials (default: admin/changeme)
3. Create a new workflow with:
   - Webhook trigger node
   - MongoDB node to fetch chat history
   - LLM node (Gemini/OpenAI) for AI responses
   - MongoDB node to update chat history
   - Response node to return result

4. Configure the webhook URL in your `.env`:
   ```
   N8N_WEBHOOK_URL=http://n8n:5678/webhook/chat
   ```

## Deployment

### Production Considerations

1. **Security**:
   - Change `JWT_SECRET_KEY` to a strong random value
   - Update n8n credentials (N8N_BASIC_AUTH_USER/PASSWORD)
   - Use HTTPS in production
   - Configure proper CORS origins
   - Enable rate limiting

2. **Database**:
   - Use MongoDB replica set for high availability
   - Configure regular backups
   - Set up monitoring

3. **Scaling**:
   - Use a reverse proxy (nginx) for load balancing
   - Scale FastAPI containers horizontally
   - Consider Redis for caching weather data

4. **Monitoring**:
   - Set up application logging
   - Configure health check monitoring
   - Use error tracking (e.g., Sentry)

### Environment-Specific Configuration

Create separate `.env` files for different environments:
- `.env.development`
- `.env.staging`
- `.env.production`

## Troubleshooting

### Common Issues

**MongoDB connection failed**
```bash
# Check if MongoDB is running
docker-compose ps mongodb

# View MongoDB logs
docker-compose logs mongodb
```

**API not responding**
```bash
# Check API logs
docker-compose logs api

# Restart API service
docker-compose restart api
```

**n8n webhook not working**
- Ensure n8n service is healthy
- Verify webhook URL in `.env` matches n8n workflow
- Check n8n logs: `docker-compose logs n8n`

## Contributing

1. Follow the existing code structure and patterns
2. Write tests for new features
3. Update documentation as needed
4. Follow PEP 8 style guidelines

## License

Proprietary

## Support

For issues and questions, please contact the development team.
