# Deployment Guide

This guide covers deploying the URL Shortener application to various environments, from local development to production.

## 📋 Prerequisites

### System Requirements
- **Node.js**: 18.x or higher
- **MySQL**: 8.0 or higher
- **pnpm**: Latest version (recommended package manager)
- **Git**: For version control and deployment

### Production Additional Requirements
- **Reverse Proxy**: Nginx or Apache
- **SSL Certificate**: Let's Encrypt or commercial SSL
- **Process Manager**: PM2 for Node.js applications
- **Domain Name**: For production deployment

## 🚀 Local Development Setup

### 1. Clone and Install

```bash
# Clone the repository
git clone https://github.com/ShenoudaMikhael/capstone_url_shotener.git
cd capstone_url_shotener

# Install backend dependencies
cd backend
pnpm install

# Install frontend dependencies
cd ../forntend
pnpm install
```

### 2. Database Setup

```sql
-- Create MySQL database
CREATE DATABASE urlshortner;
CREATE USER 'urlshortener'@'localhost' IDENTIFIED BY 'your_secure_password';
GRANT ALL PRIVILEGES ON urlshortner.* TO 'urlshortener'@'localhost';
FLUSH PRIVILEGES;
```

### 3. Environment Configuration

Create `.env` file in the `backend` directory:

```env
# Database Configuration
DB_HOST=localhost
DB_USER=urlshortener
DB_PASSWORD=your_secure_password
DB_NAME=urlshortner
DB_DIALECT=mysql

# Server Configuration
PORT=3000
NODE_ENV=development

# Application Settings
BASE_URL=http://localhost:3000
```

### 4. Initialize Database

```bash
cd backend
pnpm run db:sync
```

### 5. Start Development Servers

```bash
# Terminal 1: Backend
cd backend
pnpm run dev

# Terminal 2: Frontend
cd forntend
pnpm run dev
```

**Access Points:**
- Frontend: http://localhost:5173
- Backend API: http://localhost:3000
- Health Check: http://localhost:3000/health

## 🏭 Production Deployment

### Option 1: VPS/Cloud Server (Recommended)

#### 1. Server Setup (Ubuntu 22.04 LTS)

```bash
# Update system
sudo apt update && sudo apt upgrade -y

# Install Node.js 18.x
curl -fsSL https://deb.nodesource.com/setup_18.x | sudo -E bash -
sudo apt-get install -y nodejs

# Install pnpm
npm install -g pnpm

# Install MySQL
sudo apt install mysql-server -y
sudo mysql_secure_installation

# Install Nginx
sudo apt install nginx -y

# Install PM2 globally
npm install -g pm2

# Install certbot for SSL
sudo apt install certbot python3-certbot-nginx -y
```

#### 2. Application Deployment

```bash
# Create application directory
sudo mkdir -p /var/www/url-shortener
sudo chown $USER:$USER /var/www/url-shortener

# Clone and setup application
cd /var/www/url-shortener
git clone https://github.com/ShenoudaMikhael/capstone_url_shotener.git .

# Install dependencies
cd backend
pnpm install --production

cd ../forntend
pnpm install
pnpm run build
```

#### 3. Production Environment Configuration

Create `/var/www/url-shortener/backend/.env`:

```env
# Database Configuration
DB_HOST=localhost
DB_USER=urlshortener
DB_PASSWORD=your_secure_production_password
DB_NAME=urlshortner
DB_DIALECT=mysql

# Server Configuration
PORT=3000
NODE_ENV=production

# Application Settings
BASE_URL=https://yourdomain.com
```

#### 4. Database Setup

```bash
# Connect to MySQL
sudo mysql -u root -p

# Create production database and user
CREATE DATABASE urlshortner;
CREATE USER 'urlshortener'@'localhost' IDENTIFIED BY 'your_secure_production_password';
GRANT ALL PRIVILEGES ON urlshortner.* TO 'urlshortener'@'localhost';
FLUSH PRIVILEGES;
EXIT;

# Initialize database schema
cd /var/www/url-shortener/backend
pnpm run db:sync
```

#### 5. PM2 Process Management

Create `ecosystem.config.js` in the root directory:

```javascript
module.exports = {
  apps: [{
    name: 'url-shortener-api',
    script: './backend/app.js',
    cwd: '/var/www/url-shortener',
    instances: 'max',
    exec_mode: 'cluster',
    env: {
      NODE_ENV: 'production',
      PORT: 3000
    },
    error_file: './logs/err.log',
    out_file: './logs/out.log',
    log_file: './logs/combined.log',
    time: true,
    max_memory_restart: '1G',
    node_args: '--max_old_space_size=1024'
  }]
};
```

Start the application:

```bash
# Create logs directory
mkdir -p /var/www/url-shortener/logs

# Start with PM2
cd /var/www/url-shortener
pm2 start ecosystem.config.js

# Save PM2 configuration
pm2 save

# Setup PM2 to start on boot
pm2 startup
# Follow the instructions provided by the command above
```

#### 6. Nginx Configuration

Create `/etc/nginx/sites-available/url-shortener`:

```nginx
server {
    listen 80;
    server_name yourdomain.com www.yourdomain.com;
    
    # Redirect HTTP to HTTPS
    return 301 https://$server_name$request_uri;
}

server {
    listen 443 ssl http2;
    server_name yourdomain.com www.yourdomain.com;
    
    # SSL Configuration (will be added by certbot)
    
    # Security headers
    add_header X-Frame-Options "SAMEORIGIN" always;
    add_header X-XSS-Protection "1; mode=block" always;
    add_header X-Content-Type-Options "nosniff" always;
    add_header Referrer-Policy "no-referrer-when-downgrade" always;
    add_header Content-Security-Policy "default-src 'self' http: https: data: blob: 'unsafe-inline'" always;
    
    # Gzip compression
    gzip on;
    gzip_vary on;
    gzip_min_length 1024;
    gzip_proxied expired no-cache no-store private must-revalidate auth;
    gzip_types text/plain text/css text/xml text/javascript application/x-javascript application/xml+rss application/javascript;
    
    # Serve static files
    location / {
        root /var/www/url-shortener/forntend/dist;
        try_files $uri $uri/ /index.html;
        
        # Cache static assets
        location ~* \.(js|css|png|jpg|jpeg|gif|ico|svg)$ {
            expires 1y;
            add_header Cache-Control "public, immutable";
        }
    }
    
    # API proxy
    location /api/ {
        proxy_pass http://localhost:3000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
        proxy_cache_bypass $http_upgrade;
        
        # Timeout settings
        proxy_connect_timeout 60s;
        proxy_send_timeout 60s;
        proxy_read_timeout 60s;
    }
    
    # Health check endpoint
    location /health {
        proxy_pass http://localhost:3000;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
    }
    
    # Short URL redirects
    location ~ ^/[a-zA-Z0-9]+$ {
        proxy_pass http://localhost:3000;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
    }
}
```

Enable the site:

```bash
# Link the configuration
sudo ln -s /etc/nginx/sites-available/url-shortener /etc/nginx/sites-enabled/

# Test configuration
sudo nginx -t

# Start Nginx
sudo systemctl start nginx
sudo systemctl enable nginx
```

#### 7. SSL Certificate Setup

```bash
# Get SSL certificate from Let's Encrypt
sudo certbot --nginx -d yourdomain.com -d www.yourdomain.com

# Set up automatic renewal
sudo crontab -e
# Add this line:
# 0 12 * * * /usr/bin/certbot renew --quiet
```

#### 8. Firewall Configuration

```bash
# Enable UFW firewall
sudo ufw enable

# Allow necessary ports
sudo ufw allow ssh
sudo ufw allow 'Nginx Full'
sudo ufw allow 3306  # MySQL (only if external access needed)

# Check status
sudo ufw status
```

### Option 2: Docker Deployment

#### 1. Create Dockerfile for Backend

Create `backend/Dockerfile`:

```dockerfile
FROM node:18-alpine

WORKDIR /app

# Copy package files
COPY package*.json ./
COPY pnpm-lock.yaml ./

# Install pnpm
RUN npm install -g pnpm

# Install dependencies
RUN pnpm install --production

# Copy application code
COPY . .

# Create non-root user
RUN addgroup -g 1001 -S nodejs
RUN adduser -S nodejs -u 1001

# Change ownership
RUN chown -R nodejs:nodejs /app
USER nodejs

EXPOSE 3000

CMD ["node", "app.js"]
```

#### 2. Create Dockerfile for Frontend

Create `forntend/Dockerfile`:

```dockerfile
FROM node:18-alpine as builder

WORKDIR /app

# Copy package files
COPY package*.json ./
COPY pnpm-lock.yaml ./

# Install pnpm
RUN npm install -g pnpm

# Install dependencies
RUN pnpm install

# Copy source code
COPY . .

# Build application
RUN pnpm run build

# Production stage
FROM nginx:alpine

# Copy built assets
COPY --from=builder /app/dist /usr/share/nginx/html

# Copy nginx configuration
COPY nginx.conf /etc/nginx/conf.d/default.conf

EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]
```

#### 3. Docker Compose Configuration

Create `docker-compose.yml`:

```yaml
version: '3.8'

services:
  mysql:
    image: mysql:8.0
    environment:
      MYSQL_ROOT_PASSWORD: rootpassword
      MYSQL_DATABASE: urlshortner
      MYSQL_USER: urlshortener
      MYSQL_PASSWORD: password
    volumes:
      - mysql_data:/var/lib/mysql
    ports:
      - "3306:3306"
    restart: unless-stopped

  backend:
    build: ./backend
    environment:
      DB_HOST: mysql
      DB_USER: urlshortener
      DB_PASSWORD: password
      DB_NAME: urlshortner
      DB_DIALECT: mysql
      PORT: 3000
      NODE_ENV: production
      BASE_URL: http://localhost:3000
    ports:
      - "3000:3000"
    depends_on:
      - mysql
    restart: unless-stopped

  frontend:
    build: ./forntend
    ports:
      - "80:80"
    depends_on:
      - backend
    restart: unless-stopped

volumes:
  mysql_data:
```

#### 4. Deploy with Docker

```bash
# Build and start services
docker-compose up -d

# Check status
docker-compose ps

# View logs
docker-compose logs -f backend
```

## 📊 Monitoring and Maintenance

### 1. Application Monitoring

```bash
# PM2 monitoring
pm2 monit

# View logs
pm2 logs url-shortener-api

# Restart application
pm2 restart url-shortener-api

# Check application status
pm2 status
```

### 2. Database Backup

Create backup script `/var/www/url-shortener/scripts/backup.sh`:

```bash
#!/bin/bash

# Configuration
DB_NAME="urlshortner"
DB_USER="urlshortener"
DB_PASSWORD="your_password"
BACKUP_DIR="/var/backups/mysql"
DATE=$(date +"%Y%m%d_%H%M%S")

# Create backup directory
mkdir -p $BACKUP_DIR

# Create backup
mysqldump -u $DB_USER -p$DB_PASSWORD $DB_NAME > $BACKUP_DIR/urlshortner_$DATE.sql

# Compress backup
gzip $BACKUP_DIR/urlshortner_$DATE.sql

# Remove backups older than 7 days
find $BACKUP_DIR -name "urlshortner_*.sql.gz" -mtime +7 -delete

echo "Backup completed: urlshortner_$DATE.sql.gz"
```

Setup automated backups:

```bash
# Make script executable
chmod +x /var/www/url-shortener/scripts/backup.sh

# Add to crontab
sudo crontab -e
# Add this line for daily backup at 2 AM:
# 0 2 * * * /var/www/url-shortener/scripts/backup.sh
```

### 3. Log Rotation

Create `/etc/logrotate.d/url-shortener`:

```
/var/www/url-shortener/logs/*.log {
    daily
    missingok
    rotate 14
    compress
    delaycompress
    notifempty
    create 644 root root
    postrotate
        pm2 reloadLogs
    endscript
}
```

### 4. Health Monitoring

Create monitoring script `/var/www/url-shortener/scripts/health-check.sh`:

```bash
#!/bin/bash

# Check if application is responding
HEALTH_URL="http://localhost:3000/health"
RESPONSE=$(curl -s -o /dev/null -w "%{http_code}" $HEALTH_URL)

if [ $RESPONSE -eq 200 ]; then
    echo "Application is healthy"
    exit 0
else
    echo "Application is not responding (HTTP $RESPONSE)"
    # Restart application
    pm2 restart url-shortener-api
    exit 1
fi
```

## 🔧 Troubleshooting

### Common Issues

#### 1. Database Connection Errors

```bash
# Check MySQL status
sudo systemctl status mysql

# Check MySQL logs
sudo tail -f /var/log/mysql/error.log

# Test database connection
mysql -u urlshortener -p -h localhost urlshortner
```

#### 2. Application Not Starting

```bash
# Check PM2 logs
pm2 logs url-shortener-api

# Check if port is in use
sudo netstat -tulpn | grep :3000

# Restart application
pm2 restart url-shortener-api
```

#### 3. Nginx Configuration Issues

```bash
# Test Nginx configuration
sudo nginx -t

# Check Nginx logs
sudo tail -f /var/log/nginx/error.log

# Restart Nginx
sudo systemctl restart nginx
```

#### 4. SSL Certificate Issues

```bash
# Check certificate status
sudo certbot certificates

# Renew certificates manually
sudo certbot renew

# Test renewal
sudo certbot renew --dry-run
```

### Performance Optimization

#### 1. Database Optimization

```sql
-- Add indexes for better performance
ALTER TABLE urls ADD INDEX idx_created_at (createdAt);
ALTER TABLE urls ADD INDEX idx_click_count (clickCount);

-- Analyze table statistics
ANALYZE TABLE urls;
```

#### 2. Application Optimization

```bash
# Enable Node.js production optimizations
export NODE_ENV=production

# Increase Node.js memory limit
node --max_old_space_size=2048 app.js
```

#### 3. Nginx Optimization

Add to Nginx configuration:

```nginx
# Enable caching
proxy_cache_path /var/cache/nginx levels=1:2 keys_zone=app_cache:10m inactive=60m;

location /api/ {
    # Add caching for GET requests
    proxy_cache app_cache;
    proxy_cache_valid 200 5m;
    proxy_cache_key "$scheme$request_method$host$request_uri";
}
```

## 🚀 Deployment Checklist

### Pre-deployment

- [ ] All environment variables configured
- [ ] Database backup created
- [ ] SSL certificate obtained
- [ ] Firewall configured
- [ ] DNS records updated

### Deployment

- [ ] Application code deployed
- [ ] Dependencies installed
- [ ] Database schema updated
- [ ] Nginx configuration updated
- [ ] PM2 processes started
- [ ] SSL certificate installed

### Post-deployment

- [ ] Health check endpoint responding
- [ ] All API endpoints working
- [ ] Frontend loading correctly
- [ ] Database connections working
- [ ] Logs being generated
- [ ] Monitoring setup
- [ ] Backup schedule configured

## 📞 Support

For deployment issues:

1. Check the troubleshooting section above
2. Review application logs: `pm2 logs url-shortener-api`
3. Check system logs: `sudo journalctl -f`
4. Verify database connectivity
5. Test API endpoints manually

Remember to always test deployments in a staging environment before deploying to production!