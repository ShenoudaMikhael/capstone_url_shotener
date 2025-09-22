# URL Shortener

A full-stack URL shortening service built with Node.js, Express, React, and MySQL. This application allows users to create short URLs, track analytics, and manage their links through a modern web interface.

## 🚀 Features

- **URL Shortening**: Convert long URLs into short, shareable links
- **Click Analytics**: Track click counts and detailed statistics
- **Custom Short Codes**: Generate automatic or custom short codes
- **Real-time Stats**: View comprehensive analytics for your shortened URLs
- **Responsive Design**: Modern, mobile-friendly interface
- **RESTful API**: Complete REST API for all operations

## 🛠 Tech Stack

### Backend
- **Node.js** with **Express.js 5.1.0**
- **MySQL** database with **Sequelize 6.37.7** ORM
- **CORS** for cross-origin requests
- **dotenv** for environment configuration
- **express-validator** for input validation

### Frontend
- **React 18** with **TypeScript**
- **Vite** for fast development and building
- **TailwindCSS** for styling
- **shadcn/ui** components
- **React Hook Form** with **Zod** validation
- **Lucide React** icons

### Development Tools
- **pnpm** package manager
- **ESLint** for code quality
- **TypeScript** for type safety

## 📁 Project Structure

```
capstone_url_shotener/
├── backend/                 # Express.js API server
│   ├── app.js              # Main application file
│   ├── package.json        # Backend dependencies
│   ├── models/             # Sequelize database models
│   │   └── Url.js          # URL model with analytics
│   ├── controllers/        # Business logic controllers
│   │   └── urlController.js # URL operations (shorten, redirect, stats)
│   ├── routes/             # API route definitions
│   │   └── urlRoutes.js    # URL-related endpoints
│   └── config/             # Configuration files
│       └── database.js     # Database connection setup
├── forntend/               # React frontend application
│   ├── src/
│   │   ├── components/     # React components
│   │   │   ├── url-shortener-form.tsx    # Main URL shortening form
│   │   │   ├── url-stats-checker.tsx     # Statistics viewer
│   │   │   ├── features-section.tsx      # Feature showcase
│   │   │   └── ui/         # Reusable UI components
│   │   ├── lib/            # Utility functions
│   │   │   ├── api.ts      # API configuration
│   │   │   └── config.ts   # Frontend configuration
│   │   └── App.tsx         # Main application component
│   ├── package.json        # Frontend dependencies
│   └── vite.config.ts      # Vite configuration with proxy
└── README.md               # This file
```

## 🚀 Quick Start

### Prerequisites

- **Node.js** 18 or higher
- **MySQL** 8.0 or higher
- **pnpm** package manager

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/ShenoudaMikhael/capstone_url_shotener.git
   cd capstone_url_shotener
   ```

2. **Install backend dependencies**
   ```bash
   cd backend
   pnpm install
   ```

3. **Install frontend dependencies**
   ```bash
   cd ../forntend
   pnpm install
   ```

4. **Database Setup**
   
   Create a MySQL database named `urlshortner`:
   ```sql
   CREATE DATABASE urlshortner;
   ```

5. **Environment Configuration**
   
   Create a `.env` file in the `backend` directory:
   ```env
   # Database Configuration
   DB_HOST=localhost
   DB_USER=your_mysql_username
   DB_PASSWORD=your_mysql_password
   DB_NAME=urlshortner
   DB_DIALECT=mysql
   
   # Server Configuration
   PORT=3000
   NODE_ENV=development
   
   # Application Settings
   BASE_URL=http://localhost:3000
   ```

6. **Initialize Database**
   ```bash
   cd backend
   pnpm run db:sync
   ```

### Running the Application

1. **Start the backend server**
   ```bash
   cd backend
   pnpm run dev
   ```
   The API will be available at `http://localhost:3000`

2. **Start the frontend development server**
   ```bash
   cd forntend
   pnpm run dev
   ```
   The web application will be available at `http://localhost:5173`

## 📡 API Endpoints

### Base URL: `http://localhost:3000`

| Method | Endpoint | Description |
|--------|----------|-------------|
| `POST` | `/api/urls/shorten` | Create a shortened URL |
| `GET` | `/:shortCode` | Redirect to original URL |
| `GET` | `/api/urls/stats/:shortCode` | Get URL statistics |
| `GET` | `/health` | Health check endpoint |

### API Examples

**Shorten a URL:**
```bash
curl -X POST http://localhost:3000/api/urls/shorten \
  -H "Content-Type: application/json" \
  -d '{
    "originalUrl": "https://www.example.com/very/long/url",
    "customCode": "example" // optional
  }'
```

**Get URL Statistics:**
```bash
curl -X GET http://localhost:3000/api/urls/stats/abc123
```

**Access Shortened URL:**
```bash
curl -X GET http://localhost:3000/abc123
```

## 🗄 Database Schema

### URLs Table
```sql
CREATE TABLE urls (
  id INT AUTO_INCREMENT PRIMARY KEY,
  originalUrl TEXT NOT NULL,
  shortCode VARCHAR(255) UNIQUE NOT NULL,
  clickCount INT DEFAULT 0,
  isActive BOOLEAN DEFAULT true,
  isCustom BOOLEAN DEFAULT false,
  createdAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updatedAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  KEY idx_short_code (shortCode(10)),
  KEY idx_original_url (originalUrl(100))
);
```

## 💻 Frontend Components

### UrlShortenerForm
The main component for creating shortened URLs with:
- URL validation
- Custom short code option
- Loading states
- Error handling
- Result display with copy functionality

### UrlStatsChecker
Analytics component featuring:
- Short code input and validation
- Comprehensive statistics display
- Click count tracking
- URL information panel
- Direct link access

### Features
- Responsive design
- Form validation with Zod
- Modern UI with shadcn/ui components
- TypeScript for type safety

## 🎯 Development Scripts

### Backend Scripts
```bash
# Development with auto-reload
pnpm run dev

# Production start
pnpm start

# Database operations
pnpm run db:sync      # Sync database schema
pnpm run db:status    # Check database status
```

### Frontend Scripts
```bash
# Development server
pnpm run dev

# Build for production
pnpm run build

# Preview production build
pnpm run preview

# Linting
pnpm run lint
```

## 🤖 AI-Assisted Development

This project was developed with significant assistance from AI tools, particularly GitHub Copilot. Key areas where AI was utilized:

### Code Generation
- **Component Architecture**: AI helped generate React components with proper TypeScript interfaces
- **API Route Structure**: Generated Express.js routes with validation and error handling
- **Database Models**: Created Sequelize models with appropriate relationships and constraints
- **Form Validation**: Generated Zod schemas for robust input validation

### Problem Solving
- **Express 5 Compatibility**: AI identified and resolved routing compatibility issues
- **Database Optimization**: Suggested proper indexing strategies for MySQL TEXT columns
- **CORS Configuration**: Helped configure proper CORS settings for development
- **Proxy Setup**: Assisted in configuring Vite proxy for API requests

### Best Practices
- **Error Handling**: Implemented comprehensive error handling patterns
- **TypeScript Integration**: Ensured type safety across the entire application
- **Component Design**: Created reusable, maintainable React components
- **API Design**: Followed RESTful principles and proper HTTP status codes

### Iterative Development
The development process involved:
1. **Initial Setup**: AI helped structure the project and dependencies
2. **Feature Implementation**: Iterative development with AI assistance for each feature
3. **Bug Fixing**: AI helped identify and resolve issues during development
4. **Code Optimization**: Suggestions for performance and maintainability improvements

## 🔧 Configuration

### Vite Proxy Configuration
The frontend uses Vite's proxy feature to route API requests to the backend during development:

```typescript
// vite.config.ts
export default defineConfig({
  plugins: [react()],
  server: {
    proxy: {
      '/api': {
        target: 'http://localhost:3000',
        changeOrigin: true,
      },
      '/health': {
        target: 'http://localhost:3000',
        changeOrigin: true,
      }
    }
  }
})
```

### Environment Variables
The application uses environment variables for configuration:
- Database connection settings
- Server port configuration
- Base URL for shortened links
- Development/production environment flags

## 📋 Future Enhancements

- [ ] User authentication and personal dashboards
- [ ] QR code generation for shortened URLs
- [ ] Custom domain support
- [ ] Bulk URL operations
- [ ] Advanced analytics (referrers, devices, locations)
- [ ] URL expiration dates
- [ ] Password protection for sensitive URLs
- [ ] Rate limiting and abuse prevention
- [ ] API key authentication
- [ ] Export analytics data

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📄 License

This project is part of a capstone assignment and is for educational purposes.

## 🙏 Acknowledgments

- Built with assistance from AI development tools
- Uses modern web technologies and best practices
- Implements responsive design principles
- Follows RESTful API conventions

---

**Note**: This is an educational project demonstrating full-stack web development with modern technologies and AI-assisted development practices.