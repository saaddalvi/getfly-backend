# GetFly Backend API

REST API for project management with daily progress reports (DPR).

## Tech Stack

- **Runtime:** Node.js
- **Framework:** Express.js
- **Database:** MySQL
- **ORM:** Sequelize
- **Authentication:** JWT (JSON Web Tokens)
- **Password Hashing:** bcryptjs
- **Validation:** express-validator

## Project Structure

```
backend/
├── src/
│   ├── config/
│   │   └── database.js          # Sequelize connection config
│   ├── models/
│   │   ├── index.js             # Model associations
│   │   ├── User.js
│   │   ├── Project.js
│   │   └── DailyReport.js
│   ├── controllers/
│   │   ├── authController.js    # Register & login logic
│   │   ├── projectController.js # Project CRUD logic
│   │   └── dprController.js     # DPR create & list logic
│   ├── routes/
│   │   ├── authRoutes.js
│   │   ├── projectRoutes.js
│   │   └── dprRoutes.js
│   ├── middleware/
│   │   ├── auth.js              # JWT verification
│   │   ├── roleCheck.js         # Role-based access control
│   │   └── validate.js          # Input validation handler
│   └── app.js                   # Express app setup
├── schema.sql                   # SQL script to create tables
├── server.js                    # Entry point
├── .env.example                
└── package.json
```

## Database Setup

1. Install MySQL and start the server.

2. Create the database and tables using the provided SQL script:

```bash
mysql -u root -p < schema.sql
```

Or log into MySQL and run:

```sql
source schema.sql;
```

## Installation & Running

1. Clone the repo and navigate to the backend folder.

2. Install dependencies:

```bash
npm install
```

3. Create a `.env` file by copying the example:

```bash
cp .env.example .env
```

4. Edit `.env` with your credentials JWT secret:

```
PORT=3000
DB_HOST=localhost
DB_PORT=3306
DB_NAME=getfly_db
DB_USER=root
DB_PASSWORD=your_mysql_password
JWT_SECRET=your_secret_key
JWT_EXPIRES_IN=24h
```

5. Start the server:

```bash
# Development (auto-restarts using nodemon)
npm run dev

# Production
npm start
```

The server runs on `http://localhost:3000` by default.

## API Endpoints

### Authentication

| Method | Endpoint         | Description          | Auth Required |
|--------|-----------------|----------------------|---------------|
| POST   | `/auth/register` | Register a new user  | No            |
| POST   | `/auth/login`    | Login and get token  | No            |

### Projects

| Method | Endpoint         | Description          | Auth Required | Role          |
|--------|-----------------|----------------------|---------------|---------------|
| POST   | `/projects`      | Create project       | Yes           | admin, manager |
| GET    | `/projects`      | List all projects    | Yes           | Any           |
| GET    | `/projects/:id`  | Get project details  | Yes           | Any           |
| PUT    | `/projects/:id`  | Update project       | Yes           | admin, manager |
| DELETE | `/projects/:id`  | Delete project       | Yes           | admin         |

### Daily Progress Reports (DPR)

| Method | Endpoint                | Description           | Auth Required |
|--------|------------------------|-----------------------|---------------|
| POST   | `/projects/:id/dpr`    | Create DPR            | Yes           |
| GET    | `/projects/:id/dpr`    | List DPRs for project | Yes           |

## Example API Requests

### Register a user

```bash
curl -X POST http://localhost:3000/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "name": "John Doe",
    "email": "john@example.com",
    "password": "password123",
    "phone": "1234567890"
  }'
```

**Response (201):**
```json
{
  "userId": 1,
  "message": "User registered successfully."
}
```

### Login

```bash
curl -X POST http://localhost:3000/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "john@example.com",
    "password": "password123"
  }'
```

**Response (200):**
```json
{
  "token": "eyJhbGciOiJIUzI1NiIs...",
  "user": {
    "id": 1,
    "name": "John Doe",
    "email": "john@example.com",
    "role": "worker"
  }
}
```

### Create a project (requires admin/manager role)

```bash
curl -X POST http://localhost:3000/projects \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_JWT_TOKEN" \
  -d '{
    "name": "Highway Construction",
    "description": "Building a 50km highway",
    "startDate": "2026-04-01",
    "endDate": "2026-12-31",
    "budget": 5000000.00,
    "location": "Mumbai"
  }'
```

**Response (201):**
```json
{
  "projectId": 1,
  "message": "Project created successfully."
}
```

### List projects

```bash
# List all projects
curl http://localhost:3000/projects \
  -H "Authorization: Bearer YOUR_JWT_TOKEN"

# Filter by status with pagination
curl "http://localhost:3000/projects?status=active&limit=10&offset=0" \
  -H "Authorization: Bearer YOUR_JWT_TOKEN"
```

### Get single project

```bash
curl http://localhost:3000/projects/1 \
  -H "Authorization: Bearer YOUR_JWT_TOKEN"
```

### Update a project

```bash
curl -X PUT http://localhost:3000/projects/1 \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_JWT_TOKEN" \
  -d '{
    "status": "active"
  }'
```

### Delete a project (admin only)

```bash
curl -X DELETE http://localhost:3000/projects/1 \
  -H "Authorization: Bearer YOUR_JWT_TOKEN"
```

### Create a DPR

```bash
curl -X POST http://localhost:3000/projects/1/dpr \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_JWT_TOKEN" \
  -d '{
    "date": "2026-04-01",
    "work_description": "Foundation work completed for section A",
    "weather": "Sunny",
    "worker_count": 25
  }'
```

**Response (201):**
```json
{
  "dprId": 1,
  "message": "Daily progress report created successfully."
}
```

### List DPRs for a project

```bash
# All DPRs
curl http://localhost:3000/projects/1/dpr \
  -H "Authorization: Bearer YOUR_JWT_TOKEN"

# Filter by date
curl "http://localhost:3000/projects/1/dpr?date=2026-04-01" \
  -H "Authorization: Bearer YOUR_JWT_TOKEN"
```

## HTTP Status Codes

| Code | Meaning                          |
|------|----------------------------------|
| 200  | Success                          |
| 201  | Created                          |
| 400  | Bad request / validation error   |
| 401  | Unauthorized (missing/bad token) |
| 403  | Forbidden (insufficient role)    |
| 404  | Not found                        |
| 500  | Internal server error            |

## Role-Based Access Control

- **admin**: Full access — create, read, update, delete projects
- **manager**: Can create, read, update projects (cannot delete)
- **worker**: Can read projects and create/read DPRs
