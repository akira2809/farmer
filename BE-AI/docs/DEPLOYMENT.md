# Deployment Guide

This guide provides detailed instructions for deploying NÔNG DÂN AI in various environments.

## Table of Contents

- [Docker Deployment](#docker-deployment)
- [Production Deployment](#production-deployment)
- [Cloud Deployment](#cloud-deployment)
- [Environment Configuration](#environment-configuration)
- [Security Checklist](#security-checklist)
- [Monitoring and Maintenance](#monitoring-and-maintenance)

## Docker Deployment

### Local Development with Docker

1. **Prerequisites**
   - Docker 20.10 or higher
   - Docker Compose 2.0 or higher
   - At least 2GB free RAM
   - 5GB free disk space

2. **Initial Setup**
   ```bash
   # Clone repository
   git clone <repository-url>
   cd nong-dan-ai

   # Create environment file
   cp .env.example .env

   # Edit .env with your configuration
   nano .env  # or use your preferred editor
   ```

3. **Start Services**
   ```bash
   # Build and start all services
   docker-compose up -d

   # Check service status
   docker-compose ps

   # View logs
   docker-compose logs -f
   ```

4. **Verify Deployment**
   ```bash
   # Check API health
   curl http://localhost:8000/health

   # Access API documentation
   # Open browser: http://localhost:8000/docs
   ```

### Docker Compose Services

The `docker-compose.yml` includes three main services:

1. **MongoDB** (Port 27017)
   - Database for application data
   - Persistent volumes for data storage
   - Health checks enabled

2. **n8n** (Port 5678)
   - Workflow automation for chatbot
   - Persistent volumes for workflow data
   - Basic authentication enabled

3. **FastAPI Application** (Port 8000)
   - Main application service
   - Auto-restart on failure
   - Health checks enabled

### Docker Commands Reference

```bash
# Start services
docker-compose up -d

# Stop services
docker-compose down

# Restart specific service
docker-compose restart api

# View logs for specific service
docker-compose logs -f api

# Execute command in container
docker-compose exec api python -c "print('Hello')"

# Rebuild after code changes
docker-compose up -d --build api

# Scale API service (multiple instances)
docker-compose up -d --scale api=3

# Remove all data (WARNING: destructive)
docker-compose down -v
```

## Production Deployment

### Prerequisites

- Linux server (Ubuntu 20.04+ recommended)
- Docker and Docker Compose installed
- Domain name configured
- SSL certificate (Let's Encrypt recommended)
- Minimum 2 CPU cores, 4GB RAM

### Production Setup Steps

1. **Server Preparation**
   ```bash
   # Update system
   sudo apt update && sudo apt upgrade -y

   # Install Docker
   curl -fsSL https://get.docker.com -o get-docker.sh
   sudo sh get-docker.sh

   # Install Docker Compose
   sudo curl -L "https://github.com/docker/compose/releases/latest/download/docker-compose-$(uname -s)-$(uname -m)" -o /usr/local/bin/docker-compose
   sudo chmod +x /usr/local/bin/docker-compose

   # Add user to docker group
   sudo usermod -aG docker $USER
   ```

2. **Application Deployment**
   ```bash
   # Create application directory
   sudo mkdir -p /opt/nong-dan-ai
   cd /opt/nong-dan-ai

   # Clone repository
   git clone <repository-url> .

   # Create production environment file
   cp .env.example .env.production
   nano .env.production
   ```

3. **Configure Production Environment**
   
   Edit `.env.production` with production values:
   ```bash
   # Use strong secret key
   JWT_SECRET_KEY=$(openssl rand -hex 32)

   # Production MongoDB
   MONGODB_URI=mongodb://mongodb:27017

   # Disable debug mode
   DEBUG=False

   # Configure CORS for your domain
   CORS_ORIGINS=["https://yourdomain.com"]

   # Add all required API keys
   WEATHER_API_KEY=your_production_key
   IMAGE_AI_API_KEY=your_production_key
   ```

4. **Start Production Services**
   ```bash
   # Start with production env file
   docker-compose --env-file .env.production up -d

   # Verify services
   docker-compose ps
   ```

5. **Set Up Reverse Proxy (Nginx)**
   ```bash
   # Install Nginx
   sudo apt install nginx -y

   # Create Nginx configuration
   sudo nano /etc/nginx/sites-available/nong-dan-ai
   ```

   Nginx configuration:
   ```nginx
   server {
       listen 80;
       server_name yourdomain.com;

       location / {
           proxy_pass http://localhost:8000;
           proxy_set_header Host $host;
           proxy_set_header X-Real-IP $remote_addr;
           proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
           proxy_set_header X-Forwarded-Proto $scheme;
       }

       location /n8n/ {
           proxy_pass http://localhost:5678/;
           proxy_set_header Host $host;
           proxy_set_header X-Real-IP $remote_addr;
       }
   }
   ```

   Enable site:
   ```bash
   sudo ln -s /etc/nginx/sites-available/nong-dan-ai /etc/nginx/sites-enabled/
   sudo nginx -t
   sudo systemctl restart nginx
   ```

6. **Set Up SSL with Let's Encrypt**
   ```bash
   # Install Certbot
   sudo apt install certbot python3-certbot-nginx -y

   # Obtain SSL certificate
   sudo certbot --nginx -d yourdomain.com

   # Auto-renewal is configured automatically
   ```

### Production Docker Compose Override

Create `docker-compose.prod.yml` for production-specific settings:

```yaml
version: '3.8'

services:
  mongodb:
    restart: always
    volumes:
      - /data/mongodb:/data/db

  n8n:
    restart: always
    environment:
      - N8N_BASIC_AUTH_USER=${N8N_USER}
      - N8N_BASIC_AUTH_PASSWORD=${N8N_PASSWORD}

  api:
    restart: always
    environment:
      - DEBUG=False
    deploy:
      replicas: 2
      resources:
        limits:
          cpus: '1'
          memory: 1G
```

Start with override:
```bash
docker-compose -f docker-compose.yml -f docker-compose.prod.yml up -d
```

## Cloud Deployment

### AWS Deployment

1. **Using AWS ECS (Elastic Container Service)**
   - Push Docker images to ECR
   - Create ECS task definitions
   - Set up Application Load Balancer
   - Configure Auto Scaling

2. **Using AWS EC2**
   - Launch EC2 instance (t3.medium or larger)
   - Follow production deployment steps
   - Configure security groups
   - Set up Elastic IP

### Google Cloud Platform

1. **Using Cloud Run**
   - Build and push to Google Container Registry
   - Deploy to Cloud Run
   - Configure Cloud SQL for MongoDB alternative

2. **Using Compute Engine**
   - Create VM instance
   - Follow production deployment steps
   - Configure firewall rules

### DigitalOcean

1. **Using App Platform**
   - Connect GitHub repository
   - Configure build settings
   - Add MongoDB managed database

2. **Using Droplets**
   - Create droplet (2GB RAM minimum)
   - Follow production deployment steps
   - Configure firewall

## Environment Configuration

### Required Environment Variables

```bash
# MongoDB
MONGODB_URI=mongodb://mongodb:27017
MONGODB_DB_NAME=nong_dan_ai

# JWT Authentication
JWT_SECRET_KEY=<generate-strong-key>
JWT_ALGORITHM=HS256
ACCESS_TOKEN_EXPIRE_MINUTES=15
REFRESH_TOKEN_EXPIRE_DAYS=7

# External APIs
WEATHER_API_KEY=<your-key>
WEATHER_API_URL=https://api.weatherapi.com/v1
IMAGE_AI_API_KEY=<your-key>
IMAGE_AI_API_URL=https://api.imageai.com/v1
N8N_WEBHOOK_URL=http://n8n:5678/webhook/chat

# Cloud Storage
CLOUD_STORAGE_BUCKET=nong-dan-ai-images
CLOUD_STORAGE_CREDENTIALS=/path/to/credentials.json

# Application
APP_NAME=NÔNG DÂN AI
APP_VERSION=1.0.0
DEBUG=False
CORS_ORIGINS=["https://yourdomain.com"]
```

### Generating Secure Keys

```bash
# Generate JWT secret key
openssl rand -hex 32

# Generate random password
openssl rand -base64 24
```

## Security Checklist

### Pre-Deployment

- [ ] Change all default passwords
- [ ] Generate strong JWT_SECRET_KEY
- [ ] Configure CORS_ORIGINS for your domain only
- [ ] Set DEBUG=False in production
- [ ] Review and update n8n authentication
- [ ] Secure MongoDB with authentication
- [ ] Use environment-specific .env files
- [ ] Never commit .env files to version control

### Network Security

- [ ] Configure firewall rules (UFW/iptables)
- [ ] Use HTTPS/SSL certificates
- [ ] Restrict MongoDB port (27017) to localhost
- [ ] Restrict n8n port (5678) or use VPN
- [ ] Set up fail2ban for SSH protection
- [ ] Enable rate limiting on API endpoints

### Application Security

- [ ] Implement API rate limiting
- [ ] Validate all user inputs
- [ ] Sanitize file uploads
- [ ] Use secure headers (HSTS, CSP)
- [ ] Regular security updates
- [ ] Monitor for vulnerabilities

### Data Security

- [ ] Enable MongoDB authentication
- [ ] Encrypt sensitive data at rest
- [ ] Regular database backups
- [ ] Secure backup storage
- [ ] Implement data retention policies

## Monitoring and Maintenance

### Health Checks

```bash
# API health check
curl http://localhost:8000/health

# MongoDB health check
docker-compose exec mongodb mongosh --eval "db.adminCommand('ping')"

# n8n health check
curl http://localhost:5678/healthz
```

### Logging

```bash
# View all logs
docker-compose logs -f

# View specific service logs
docker-compose logs -f api

# View last 100 lines
docker-compose logs --tail=100 api

# Save logs to file
docker-compose logs api > api.log
```

### Backup Strategy

1. **Database Backup**
   ```bash
   # Create backup
   docker-compose exec mongodb mongodump --out=/backup

   # Copy backup from container
   docker cp nong-dan-ai-mongodb:/backup ./backup-$(date +%Y%m%d)

   # Restore backup
   docker-compose exec mongodb mongorestore /backup
   ```

2. **Automated Backups**
   ```bash
   # Create backup script
   cat > backup.sh << 'EOF'
   #!/bin/bash
   BACKUP_DIR="/backups/mongodb"
   DATE=$(date +%Y%m%d_%H%M%S)
   
   docker-compose exec -T mongodb mongodump --archive > "$BACKUP_DIR/backup_$DATE.archive"
   
   # Keep only last 7 days
   find $BACKUP_DIR -name "backup_*.archive" -mtime +7 -delete
   EOF

   chmod +x backup.sh

   # Add to crontab (daily at 2 AM)
   echo "0 2 * * * /opt/nong-dan-ai/backup.sh" | crontab -
   ```

### Updates and Maintenance

```bash
# Pull latest code
git pull origin main

# Rebuild and restart services
docker-compose up -d --build

# Clean up old images
docker image prune -a

# Clean up old volumes (careful!)
docker volume prune
```

### Performance Monitoring

1. **Container Stats**
   ```bash
   docker stats
   ```

2. **Resource Usage**
   ```bash
   # Check disk usage
   df -h

   # Check memory usage
   free -h

   # Check CPU usage
   top
   ```

3. **Application Metrics**
   - Monitor API response times
   - Track error rates
   - Monitor database query performance
   - Set up alerts for service downtime

## Troubleshooting

### Common Issues

1. **Services won't start**
   ```bash
   # Check logs
   docker-compose logs

   # Check port conflicts
   sudo netstat -tulpn | grep -E '8000|27017|5678'
   ```

2. **MongoDB connection errors**
   ```bash
   # Verify MongoDB is running
   docker-compose ps mongodb

   # Check MongoDB logs
   docker-compose logs mongodb

   # Test connection
   docker-compose exec mongodb mongosh
   ```

3. **API returns 502/504 errors**
   - Check if API container is running
   - Verify environment variables
   - Check application logs
   - Verify external API connectivity

4. **Out of disk space**
   ```bash
   # Clean Docker resources
   docker system prune -a --volumes

   # Check disk usage
   du -sh /var/lib/docker
   ```

## Support

For deployment issues or questions:
- Check logs: `docker-compose logs`
- Review documentation in `/docs`
- Contact development team

## Additional Resources

- [Docker Documentation](https://docs.docker.com/)
- [FastAPI Deployment](https://fastapi.tiangolo.com/deployment/)
- [MongoDB Production Notes](https://docs.mongodb.com/manual/administration/production-notes/)
- [n8n Self-Hosting](https://docs.n8n.io/hosting/)
