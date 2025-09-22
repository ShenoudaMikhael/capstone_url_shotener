# Database Setup Documentation

## Database Schema

The URL Shortener application uses a MySQL database with the following structure:

### Table: `urls`

| Field | Type | Null | Key | Default | Extra |
|-------|------|------|-----|---------|-------|
| id | int | NO | PRI | null | auto_increment |
| originalUrl | text | NO | MUL | null | |
| shortCode | varchar(20) | NO | UNI | null | |
| customCode | tinyint(1) | YES | | 0 | |
| clickCount | int | YES | | 0 | |
| isActive | tinyint(1) | YES | MUL | 1 | |
| expiresAt | datetime | YES | | null | |
| createdAt | datetime | NO | MUL | null | |
| updatedAt | datetime | NO | | null | |

### Indexes

| Index Name | Column | Type | Unique |
|------------|--------|------|--------|
| PRIMARY | id | BTREE | Yes |
| shortCode | shortCode | BTREE | Yes |
| urls_short_code | shortCode | BTREE | Yes |
| urls_original_url_prefix | originalUrl(255) | BTREE | No |
| urls_created_at | createdAt | BTREE | No |
| urls_is_active | isActive | BTREE | No |

### Field Descriptions

- **id**: Primary key, auto-incrementing integer
- **originalUrl**: The original long URL to be shortened (TEXT type, max 2048 chars)
- **shortCode**: Unique short code for the URL (VARCHAR(20), alphanumeric)
- **customCode**: Boolean flag indicating if the short code was custom provided
- **clickCount**: Number of times the short URL has been accessed
- **isActive**: Boolean flag to soft-delete URLs
- **expiresAt**: Optional expiration date for the URL
- **createdAt**: Timestamp when the record was created
- **updatedAt**: Timestamp when the record was last modified

## Database Commands

### Available Scripts

```bash
# Sync database (creates tables if they don't exist)
pnpm run db:sync

# Alter database (updates table structure without dropping data)
pnpm run db:alter

# Force sync (WARNING: drops and recreates all tables, losing data)
pnpm run db:force

# Check database status and structure
pnpm run db:status
```

### Manual Sync Options

```bash
# Standard sync
node sync-db.js sync

# Alter existing tables
node sync-db.js alter

# Force recreate (with 5-second warning)
node sync-db.js force
```

## Model Features

### Validation
- **originalUrl**: Must be a valid URL, max 2048 characters
- **shortCode**: 3-20 characters, alphanumeric only
- **clickCount**: Must be >= 0

### Instance Methods
- `getShortUrl()`: Returns the complete short URL

### Class Methods
- `generateShortCode(length)`: Generates a random alphanumeric code
- `isCodeAvailable(shortCode)`: Checks if a short code is available

### Associations
Ready for future extensions like user management:
```javascript
// Example future associations
User.hasMany(Url, { foreignKey: 'userId' });
Url.belongsTo(User, { foreignKey: 'userId' });
```

## Performance Optimizations

### Indexes
- **shortCode**: Unique index for fast lookups during redirects
- **originalUrl**: Prefix index (255 chars) for duplicate URL detection
- **createdAt**: Index for chronological queries
- **isActive**: Index for filtering active URLs

### Query Patterns
- Short URL lookups: O(1) via unique index on shortCode
- URL duplication check: Optimized via originalUrl prefix index
- Analytics queries: Optimized via createdAt and isActive indexes

## Maintenance

### Regular Tasks
1. Monitor table size and performance
2. Clean up expired URLs periodically
3. Archive old inactive URLs
4. Monitor index usage and optimize as needed

### Backup Strategy
```bash
# Backup database
mysqldump -u shno -p urlshortner > backup_$(date +%Y%m%d).sql

# Restore database
mysql -u shno -p urlshortner < backup_20250922.sql
```

## Troubleshooting

### Common Issues

1. **Connection Errors**: Check .env file and database credentials
2. **Sync Failures**: Run `pnpm run db:status` to check current state
3. **Index Errors**: Use `pnpm run db:alter` to update table structure
4. **Performance Issues**: Monitor slow queries and index usage

### Debug Mode
Set environment variable for detailed logging:
```bash
NODE_ENV=development pnpm run db:sync
```