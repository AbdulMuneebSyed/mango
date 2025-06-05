# Chapter Performance Dashboard API

A RESTful API backend for managing chapter performance data with caching, rate limiting, and admin authentication.

## Features

- ✅ RESTful API endpoints for chapter management
- ✅ MongoDB integration with Mongoose
- ✅ Redis caching for improved performance
- ✅ Rate limiting (30 requests/minute per IP)
- ✅ Admin authentication with JWT
- ✅ File upload support for JSON data
- ✅ Data validation and error handling
- ✅ Pagination and filtering

## API Endpoints

### Authentication
- `POST /api/v1/auth/login` - Admin login

### Chapters
- `GET /api/v1/chapters` - Get all chapters with filtering and pagination
- `GET /api/v1/chapters/:id` - Get specific chapter by ID
- `POST /api/v1/chapters` - Upload chapters (Admin only)

## Quick Start

1. Install dependencies: `npm install`
2. Set up environment variables in `.env`
3. Start MongoDB and Redis services
4. Run development server: `npm run dev`

## Environment Variables

```env
PORT=5000
MONGODB_URI=mongodb://localhost:27017/chapter-dashboard
REDIS_URL=redis://localhost:6379
JWT_SECRET=your-secret-key
ADMIN_EMAIL=admin@mathongo.com
ADMIN_PASSWORD=admin123