# Curalink Backend Server

A robust Node.js/Express REST API backend for the Curalink healthcare platform. This server handles authentication, user management, clinical trial data, publications, geolocation services, and AI-powered content summarization.

---

## Table of Contents

- [Overview](#overview)
- [Tech Stack](#tech-stack)
- [Getting Started](#getting-started)
  - [Prerequisites](#prerequisites)
  - [Installation](#installation)
  - [Environment Setup](#environment-setup)
  - [Running the Server](#running-the-server)
- [Project Structure](#project-structure)
- [Architecture](#architecture)
- [API Endpoints](#api-endpoints)
- [Database Models](#database-models)
- [Middleware](#middleware)
- [Services](#services)
- [Controllers](#controllers)
- [Error Handling](#error-handling)
- [Security](#security)
- [Development](#development)
- [Troubleshooting](#troubleshooting)

---

## Overview

The Curalink backend server provides a comprehensive API for:

- **User Authentication**: Secure login/registration for patients and researchers
- **User Onboarding**: Medical condition extraction and profile setup
- **Trial Management**: Clinical trial CRUD operations and data retrieval
- **Publication Management**: Research publication storage and retrieval
- **Geolocation Services**: Location-based expert and collaborator discovery
- **AI Integration**: Gemini AI for content summarization and condition extraction
- **Dashboard Services**: Personalized data aggregation and recommendations
- **Search Functionality**: Global search across trials, publications, and experts

---

## Tech Stack

| Category | Technology | Version |
|----------|-----------|---------|
| **Runtime** | Node.js | v18+ |
| **Framework** | Express | 5.2.1 |
| **Database** | MongoDB | Via Mongoose |
| **ODM** | Mongoose | 9.0.0 |
| **Authentication** | JWT | jsonwebtoken 9.0.2 |
| **Password Hashing** | Bcrypt | 6.0.0 |
| **AI/ML** | Google Generative AI | @google/generative-ai 0.24.1 |
| **Geolocation** | Nominatim OSM | Via axios |
| **Validation** | Validator.js | 13.15.23 |
| **Security** | Helmet | 8.1.0 |
| **Logging** | Morgan | 1.10.1 |
| **HTTP Client** | Axios | 1.13.2 |
| **Dev Server** | Nodemon | 3.1.11 |
| **Environment** | Dotenv | 17.2.3 |

---

## Getting Started

### Prerequisites

- **Node.js** (v18 or higher)
- **npm** (comes with Node.js)
- **MongoDB** (local instance or MongoDB Atlas account)
- **Google Cloud Account** with Generative AI API enabled
- **Environment variables configured**

### Installation

1. **Navigate to the server directory**
   ```bash
   cd server
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

### Environment Setup

Create a `.env` file in the `server/config/` directory with the following variables:

```env
# Database Configuration
MONGO_URI=mongodb+srv://username:password@cluster.mongodb.net/curalink?retryWrites=true&w=majority

# Authentication
JWT_SECRET=your_secure_random_string_here_min_32_chars

# AI/ML Services
GEMINI_API_KEY=your_google_generative_ai_api_key_here
GOOGLE_MAPS_API_KEY=your_google_maps_api_key_here

# Server Configuration
PORT=5000
NODE_ENV=development

# CORS
CLIENT_URL=http://localhost:3000
```

#### Environment Variables Explained

| Variable | Description | Example |
|----------|-------------|---------|
| `MONGO_URI` | MongoDB connection string | `mongodb+srv://user:pass@cluster.mongodb.net/db` |
| `JWT_SECRET` | Secret key for JWT signing | Random 32+ character string |
| `GEMINI_API_KEY` | Google Generative AI API key | Get from Google Cloud Console |
| `GOOGLE_MAPS_API_KEY` | Google Maps API key | Get from Google Cloud Console |
| `PORT` | Server port | `5000` |
| `NODE_ENV` | Environment mode | `development` or `production` |
| `CLIENT_URL` | Frontend origin for CORS | `http://localhost:3000` |

### Running the Server

**Development Mode (with auto-reload):**
```bash
npm start
```

**Production Mode:**
```bash
NODE_ENV=production npm start
```

The server will start on `http://localhost:5000` by default.

---

## Project Structure

```
server/
├── server.js                        # Main application entry point
├── config/
│   ├── index.js                     # Database connection setup
│   └── .env                         # Environment variables (not tracked)
├── controllers/
│   ├── authController.js            # Authentication logic (login)
│   ├── userController.js            # User registration and onboarding
│   ├── dashboardController.js       # Dashboard data aggregation
│   ├── searchController.js          # Global search functionality
│   └── geoController.js             # Geolocation services
├── models/
│   ├── User.js                      # User schema (patient/researcher)
│   ├── ClinicalTrial.js             # Clinical trial schema
│   ├── Publication.js               # Research publication schema
│   └── Expert.js                    # Expert profile schema
├── routes/
│   ├── authRoutes.js                # Auth endpoints (/api/v1/auth)
│   ├── userRoutes.js                # User endpoints (/api/v1/users)
│   └── dashboardRoutes.js           # Dashboard endpoints (/api/v1/dashboard)
├── middleware/
│   ├── authMiddleware.js            # JWT verification and role authorization
│   └── errorMiddleware.js           # Global error handling
├── services/
│   ├── aiService.js                 # Google Gemini AI integration
│   ├── geoService.js                # Geolocation and reverse geocoding
│   └── trialService.js              # Clinical trial business logic
├── package.json                     # Dependencies and scripts
└── README.md                        # This file
```

---

## Architecture

### Request Flow

```
HTTP Request
    ↓
Express Middleware (CORS, Helmet, Morgan)
    ↓
Route Handler
    ↓
Controller
    ↓
Service/Business Logic
    ↓
Database Models (Mongoose)
    ↓
MongoDB
    ↓
Response JSON
```

### Layer Responsibilities

**Routes**: Handle HTTP requests and delegate to controllers
**Controllers**: Parse requests, call services, format responses
**Services**: Business logic, AI integration, external API calls
**Models**: Database schema definitions and validation
**Middleware**: Authentication, error handling, request logging

---

## API Endpoints

### Authentication Endpoints
Base URL: `http://localhost:5000/api/v1/auth`

#### Login
```http
POST /login
Content-Type: application/json

{
  "email": "user@example.com",
  "password": "password123"
}

Response (200 OK):
{
  "_id": "user_id",
  "email": "user@example.com",
  "role": "patient",
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
}
```

#### Register Patient
```http
POST /register/patient
Content-Type: application/json

{
  "name": "John Doe",
  "email": "john@example.com",
  "password": "password123"
}

Response (201 Created):
{
  "_id": "user_id",
  "email": "john@example.com",
  "name": "John Doe",
  "role": "patient",
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
}
```

#### Register Researcher
```http
POST /register/researcher
Content-Type: application/json

{
  "name": "Dr. Jane Smith",
  "email": "jane@example.com",
  "password": "password123"
}

Response (201 Created):
{
  "_id": "user_id",
  "email": "jane@example.com",
  "name": "Dr. Jane Smith",
  "role": "researcher",
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
}
```

### User Endpoints
Base URL: `http://localhost:5000/api/v1/users`

#### Detect Location
```http
POST /location/detect
Content-Type: application/json

{
  "latitude": 40.7128,
  "longitude": -74.0060
}

Response (200 OK):
{
  "city": "New York",
  "country": "United States"
}
```

#### Onboard Patient
```http
PUT /patient/onboard
Authorization: Bearer <token>
Content-Type: application/json

{
  "conditionText": "I have type 2 diabetes and hypertension",
  "location": {
    "type": "Point",
    "coordinates": [-74.0060, 40.7128]
  }
}

Response (200 OK):
{
  "message": "Patient profile onboarded",
  "user": {
    "_id": "user_id",
    "email": "patient@example.com",
    "role": "patient",
    "patientProfile": {
      "condition": "diabetes",
      "conditionFilters": ["diabetes", "hypertension"]
    },
    "location": { "type": "Point", "coordinates": [-74.0060, 40.7128] }
  }
}
```

#### Onboard Researcher
```http
PUT /researcher/onboard
Authorization: Bearer <token>
Content-Type: application/json

{
  "specialties": ["Oncology", "Immunology"],
  "researchInterests": ["Cancer immunotherapy", "CAR-T cells"],
  "orcidID": "0000-0002-1825-0097",
  "location": {
    "type": "Point",
    "coordinates": [-74.0060, 40.7128]
  }
}

Response (200 OK):
{
  "message": "Researcher profile onboarded",
  "user": { ... }
}
```

### Dashboard Endpoints
Base URL: `http://localhost:5000/api/v1/dashboard`

#### Get Personalized Dashboard Data
```http
GET /
Authorization: Bearer <token>

Response (200 OK):
{
  "message": "Patient dashboard data" // or "Researcher dashboard data"
}
```

#### Global Search
```http
GET /search?keywords=diabetes
Authorization: Bearer <token>

Response (200 OK):
{
  "message": "Search results for: diabetes"
}
```

---

## Database Models

### User Schema

```javascript
{
  email: {
    type: String,
    required: true,
    unique: true,
    match: [/^\S+@\S+\.\S+$/, 'Please use a valid email address']
  },
  name: {
    type: String,
    required: true
  },
  password: {
    type: String,
    required: true
  },
  role: {
    type: String,
    enum: ['patient', 'researcher'],
    default: 'patient'
  },
  isActive: {
    type: Boolean,
    default: true
  },
  location: {
    type: {
      type: String,
      enum: ['Point'],
      default: 'Point'
    },
    coordinates: {
      type: [Number],
      index: '2dsphere'
    }
  },
  patientProfile: {
    condition: String,
    conditionFilters: [String]
  },
  researcherProfile: {
    specialties: [String],
    researchInterests: [String],
    orcidID: String
  },
  favorites: [{
    type: String,
    itemId: String
  }],
  createdAt: {
    type: Date,
    default: Date.now
  }
}
```

### Clinical Trial Schema

```javascript
{
  trialID: {
    type: String,
    unique: true,
    required: true
  },
  title: String,
  description: String,
  phase: String,
  status: String,
  aiSummary: String,
  createdAt: {
    type: Date,
    default: Date.now
  }
}
```

### Publication Schema

```javascript
{
  doi: {
    type: String,
    unique: true
  },
  title: String,
  journal: String,
  authors: [String],
  abstract: String,
  aiSummary: String,
  publishedDate: Date,
  createdAt: {
    type: Date,
    default: Date.now
  }
}
```

### Expert Schema

```javascript
{
  name: String,
  primaryAffiliation: String,
  specialties: [String],
  userID: {
    type: mongoose.Schema.ObjectId,
    ref: 'User'
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
}
```

---

## Middleware

### Authentication Middleware (`authMiddleware.js`)

#### `protect()` - JWT Verification

Verifies JWT token from Authorization header and attaches user to request object.

```javascript
// Usage in routes
router.get('/protected-route', protect, controller);
```

**Flow:**
1. Extract token from `Authorization: Bearer <token>` header
2. Verify token signature using `JWT_SECRET`
3. Decode token and fetch user from database (excluding password)
4. Attach user to `req.user`
5. Pass to next middleware/controller

**Errors:**
- 401: No token provided
- 401: Token verification failed
- 401: Token expired

#### `authorize(...roles)` - Role-Based Access Control

Restricts access based on user role.

```javascript
// Usage in routes
router.get('/researcher-only', protect, authorize('researcher'), controller);
```

**Parameters:**
- `roles`: Variable number of role strings (e.g., 'patient', 'researcher')

**Errors:**
- 403: User role not authorized

### Error Middleware (`errorMiddleware.js`)

Global error handler that catches all errors and formats responses consistently.

```javascript
// Caught errors are formatted as:
{
  message: "Error message",
  status: 400
}
```

---

## Services

### AI Service (`services/aiService.js`)

Integrates Google's Gemini 2.5 Flash model for intelligent content processing.

#### `extractConditions(naturalLanguageText)`

Extracts medical conditions and keywords from natural language text.

**Parameters:**
- `naturalLanguageText` (string): User-provided text describing medical conditions

**Returns:**
- Array of extracted conditions/keywords

**Example:**
```javascript
const conditions = await extractConditions("I have type 2 diabetes and hypertension");
// Returns: ["diabetes", "hypertension", "type 2 diabetes"]
```

**Implementation Details:**
- Uses Gemini 2.5 Flash model for fast inference
- Returns structured JSON array
- Handles errors gracefully, returns empty array on failure

#### `generateSummary(fullAbstract, targetAudience)`

Generates audience-specific summaries of medical content.

**Parameters:**
- `fullAbstract` (string): Full medical text/abstract
- `targetAudience` (string): One of:
  - `"Patient-friendly"`: Simplified language, practical implications
  - `"Researcher-focused"`: Technical depth, methodology emphasis
  - Other: Generic summary

**Returns:**
- String containing the generated summary

**Example:**
```javascript
const patientSummary = await generateSummary(abstractText, "Patient-friendly");
const researcherSummary = await generateSummary(abstractText, "Researcher-focused");
```

**Implementation Details:**
- Customized prompts based on target audience
- Streaming response handling
- Error handling with fallback message

### Geolocation Service (`services/geoService.js`)

Provides geolocation and reverse geocoding capabilities.

#### `reverseGeocode(latitude, longitude)`

Converts coordinates to human-readable location information.

**Parameters:**
- `latitude` (number): Latitude coordinate
- `longitude` (number): Longitude coordinate

**Returns:**
- Object with city and country information

**Example:**
```javascript
const location = await reverseGeocode(40.7128, -74.0060);
// Returns: { city: "New York", country: "United States" }
```

**Implementation Details:**
- Uses OpenStreetMap's Nominatim API (free, no key required)
- Falls back to "Unknown" on error
- Prioritizes city over town or village

### Trial Service (`services/trialService.js`)

Business logic for clinical trial operations (expandable).

---

## Controllers

### Authentication Controller (`controllers/authController.js`)

#### `login(req, res)`

Authenticates user with email and password.

**Request Body:**
```json
{
  "email": "user@example.com",
  "password": "password123"
}
```

**Response:**
```json
{
  "_id": "user_id",
  "email": "user@example.com",
  "role": "patient",
  "token": "jwt_token"
}
```

**Validation:**
- Email and password required
- Valid user exists
- Password matches bcrypt hash

**Errors:**
- 400: Missing fields
- 401: Invalid credentials

### User Controller (`controllers/userController.js`)

#### `registerPatient(req, res)`

Registers a new patient account.

**Request Body:**
```json
{
  "name": "John Doe",
  "email": "john@example.com",
  "password": "password123"
}
```

**Process:**
1. Validate all fields provided
2. Validate email format
3. Check if user already exists
4. Hash password with bcrypt (salt rounds: 10)
5. Create new user document
6. Return user data with JWT token

**Errors:**
- 400: Missing fields
- 400: Invalid email format
- 400: User already exists
- 400: Invalid user data

#### `registerResearcher(req, res)`

Similar to `registerPatient` but with `role: 'researcher'`.

#### `onboardPatient(req, res)`

Completes patient profile after registration.

**Request Body:**
```json
{
  "conditionText": "I have type 2 diabetes and hypertension",
  "location": {
    "type": "Point",
    "coordinates": [-74.0060, 40.7128]
  }
}
```

**Process:**
1. Validate input fields
2. Extract medical conditions using AI service
3. Update user document with profile data
4. Save to database

**Errors:**
- 400: Missing required fields

#### `onboardResearcher(req, res)`

Completes researcher profile after registration.

**Request Body:**
```json
{
  "specialties": ["Oncology", "Immunology"],
  "researchInterests": ["Cancer therapy", "CAR-T cells"],
  "orcidID": "0000-0002-1825-0097",
  "location": {
    "type": "Point",
    "coordinates": [-74.0060, 40.7128]
  }
}
```

### Dashboard Controller (`controllers/dashboardController.js`)

#### `getPersonalizedData(req, res)`

Returns personalized dashboard data based on user role.

**For Patients:**
- Clinical trials matching medical conditions
- Relevant publications
- Recommended experts

**For Researchers:**
- Potential collaborators
- Relevant clinical trials
- Collaboration opportunities

#### `globalSearch(req, res)`

Performs cross-database search for trials, publications, and experts.

**Query Parameters:**
- `keywords` (string): Search terms

---

## Error Handling

### Error Middleware

All errors are caught and formatted consistently:

```javascript
{
  message: "Error description",
  status: 400 // HTTP status code
}
```

### Common Error Scenarios

| Error | Status | Message |
|-------|--------|---------|
| Missing fields | 400 | "Please enter all fields" |
| Invalid email | 400 | "Please enter a valid email address" |
| User exists | 400 | "User already exists" |
| Invalid credentials | 401 | "Invalid credentials" |
| No token | 401 | "Not authorized, no token" |
| Invalid token | 401 | "Not authorized, token failed" |
| Unauthorized role | 403 | "User role is not authorized" |
| Database error | 500 | "Internal server error" |

### Async Error Handling

All controllers use `express-async-handler` to automatically catch promise rejections:

```javascript
const controller = asyncHandler(async (req, res) => {
  // Errors automatically caught and passed to error middleware
  const user = await User.findById(id);
});
```

---

## Security

### Authentication & Authorization

- **JWT Tokens**: 1-hour expiration, signed with `JWT_SECRET`
- **Password Hashing**: Bcrypt with 10 salt rounds
- **Protected Routes**: All sensitive operations require `protect` middleware
- **Role-Based Access**: `authorize` middleware restricts by user role

### CORS Protection

```javascript
app.use(cors({ origin: process.env.CLIENT_URL }));
```

Only requests from the configured frontend URL are accepted.

### Security Headers

**Helmet Middleware** sets security headers:
- `X-Content-Type-Options: nosniff`
- `X-Frame-Options: DENY`
- `X-XSS-Protection: 1; mode=block`
- Strict-Transport-Security
- Content Security Policy

### Input Validation

- **Email validation** with validator.js
- **Field presence validation** on all endpoints
- **Schema validation** through Mongoose models
- **Bcrypt password hashing** prevents plaintext storage

### Environment Security

- Sensitive keys stored in `.env` (not tracked in git)
- Database credentials never in code
- API keys protected via environment variables

---

## Development

### Code Style

- **Async/Await**: Preferred over callbacks
- **Express Async Handler**: Automatic error catching
- **Consistent formatting**: 2-space indentation
- **Comments**: Explain complex logic

### Adding a New Endpoint

1. **Define route** in `routes/` file
2. **Create controller** in `controllers/` file
3. **Add service logic** if needed in `services/`
4. **Add model** if new data type in `models/`
5. **Test** with API client (Postman, cURL, etc.)

### Example: Adding a New Trial Search Endpoint

```javascript
// routes/dashboardRoutes.js
router.get('/trials/search', protect, searchTrials);

// controllers/dashboardController.js
const searchTrials = asyncHandler(async (req, res) => {
  const { condition, location } = req.query;
  
  // Find trials matching condition and nearby location
  const trials = await ClinicalTrial.find({
    // Query logic
  });
  
  res.status(200).json(trials);
});
```

### Running Tests

Currently no test suite configured. To add tests:

```bash
npm install --save-dev jest supertest
npm test
```

---

## Troubleshooting

### Common Issues

#### MongoDB Connection Error
```
Error: Error: mongodb connection failed
```

**Solutions:**
- Verify `MONGO_URI` in `.env` is correct
- Ensure MongoDB service is running (local) or Atlas cluster is accessible
- Check IP whitelist in MongoDB Atlas
- Verify credentials are URL-encoded (special characters)

#### JWT Secret Error
```
Error: JsonWebTokenError: invalid token
```

**Solutions:**
- Ensure `JWT_SECRET` is set in `.env`
- Verify token format: `Authorization: Bearer <token>`
- Check token hasn't expired (1-hour expiration)

#### Gemini API Error
```
Error: API Error (403): Requests from this IP are blocked
```

**Solutions:**
- Verify `GEMINI_API_KEY` is valid in Google Cloud Console
- Check API quota and usage limits
- Ensure Generative AI API is enabled in Google Cloud

#### CORS Error
```
Access to XMLHttpRequest blocked by CORS policy
```

**Solutions:**
- Verify `CLIENT_URL` in `.env` matches frontend origin
- Ensure frontend is running on configured URL
- Check CORS middleware configuration in `server.js`

#### Port Already in Use
```
Error: listen EADDRINUSE: address already in use :::5000
```

**Solutions:**
- Change `PORT` in `.env` to unused port
- Kill process using port: `lsof -i :5000` then `kill -9 <PID>`
- Or: `netstat -ano | findstr :5000` (Windows)

---

## Performance Optimization

### Database Optimization

- **Indexing**: Location field has 2dsphere index for geospatial queries
- **Lean queries**: Use `.lean()` for read-only operations
- **Pagination**: Implement limit/skip for large datasets
- **Projection**: Select only needed fields

### API Optimization

- **Caching**: Consider Redis for frequently accessed data
- **Compression**: Enable gzip compression
- **Query optimization**: Avoid N+1 queries with `.populate()`
- **Rate limiting**: Consider rate limiter middleware

### Code Optimization

- **Async operations**: Don't block event loop
- **Connection pooling**: Mongoose handles automatically
- **Lazy loading**: Load data only when needed

---

## Future Enhancements

- [ ] Email verification for new accounts
- [ ] Password reset functionality
- [ ] Refresh token rotation
- [ ] Rate limiting on auth endpoints
- [ ] Advanced search with Elasticsearch
- [ ] Pagination for large datasets
- [ ] Data export functionality
- [ ] Audit logging
- [ ] WebSocket support for real-time updates
- [ ] API versioning (v2, v3)
- [ ] GraphQL alternative to REST
- [ ] Integration tests with Jest/Supertest

---

## Contributing

To contribute to the backend:

1. Create a feature branch: `git checkout -b feature/your-feature`
2. Make changes following code style guidelines
3. Test thoroughly with API client
4. Commit with clear messages: `git commit -m 'feat: add new endpoint'`
5. Push to branch: `git push origin feature/your-feature`
6. Submit pull request for review

---

## Support

For issues or questions:
- Check the troubleshooting section above
- Review error logs in console output
- Test endpoints with Postman or similar tool
- Open a GitHub issue with error details

---

**Last Updated**: December 2025
**Version**: 1.0.0
**Maintainer**: Curalink Development Team
