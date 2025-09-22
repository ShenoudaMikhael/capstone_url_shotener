# Deployment Guide

This guide helps you deploy the URL Shortener backend to production.

## Environment Files

- `.env.example` - General template for all environments
- `.env.production.example` - Production-specific template with security considerations

## Quick Deployment Steps

### 1. Prepare Your Environment File

Copy the appropriate example file:
```bash
# For production
cp .env.production.example .env
```

### 2. Configure Database

Update the database settings in your `.env` file:
- `DB_NAME` - Your production database name
- `DB_USER` - Database user with full permissions
- `DB_PASSWORD` - Strong, unique password
- `DB_HOST` - Your database server hostname
- `DB_PORT` - Database port (usually 3306 for MySQL)

### 3. Set Environment Variables

**Important**: For production deployment, set environment variables through your hosting platform's dashboard, not the `.env` file.

### 4. Security Checklist

- [ ] Use strong, unique passwords
- [ ] Set `NODE_ENV=production`
- [ ] Configure CORS for your domain only
- [ ] Use HTTPS in production
- [ ] Keep database credentials secure
- [ ] Don't commit `.env` files to version control

## Platform-Specific Instructions

### Heroku
1. Create a new Heroku app
2. Add JawsDB MySQL add-on: `heroku addons:create jawsdb:kitefin`
3. Set environment variables in Heroku dashboard
4. Deploy: `git push heroku main`

### Railway
1. Create new project in Railway
2. Add MySQL database service
3. Set environment variables in Railway dashboard
4. Connect your GitHub repository

### Vercel
1. Connect your repository to Vercel
2. Use PlanetScale or similar for database
3. Set environment variables in Vercel dashboard
4. Deploy automatically on git push

### AWS (EC2 + RDS)
1. Create RDS MySQL instance
2. Launch EC2 instance
3. Configure security groups for database access
4. Set environment variables on the server
5. Use PM2 or similar for process management

### DigitalOcean
1. Create a Droplet
2. Add Managed MySQL Database
3. Configure firewall rules
4. Set environment variables on the server
5. Use PM2 for process management

## Database Setup

Your application will automatically create tables when it starts (via Sequelize sync). Ensure your database user has CREATE, ALTER, and INDEX permissions.

## Health Check

After deployment, verify your application is running:
```
GET https://your-domain.com/
```

Should return: "Hello World!"

## Troubleshooting

### Database Connection Issues
- Check database credentials
- Verify network connectivity
- Ensure database server is running
- Check firewall rules

### Application Won't Start
- Check logs for error messages
- Verify all required environment variables are set
- Ensure Node.js version compatibility
- Check database connectivity

### Performance Issues
- Monitor database connection pool
- Consider adding Redis for caching
- Use a CDN for static assets
- Enable gzip compression