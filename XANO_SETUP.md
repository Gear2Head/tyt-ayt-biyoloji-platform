# 🔧 Xano.io Backend Setup Guide

## 📋 Prerequisites

Before running the application, you need to set up your Xano.io backend.

---

## 1️⃣ Database Setup in Xano

Login to your Xano workspace: https://x8ki-letl-twmt.n7.xano.io/workspace/135476-0/settings

### Create Tables

#### Table: `users`
```sql
id (INT, auto-increment, primary key)
uid (VARCHAR(36), unique, required) -- UUID for frontend
email (VARCHAR(255), unique, required)
password (TEXT) -- Xano auto-hashes this
display_name (VARCHAR(255), required)
role (TEXT, default: 'user') -- 'admin', 'moderator', or 'user'
created_at (TIMESTAMP, default: now())
last_login_at (TIMESTAMP, default: now())
favorites (JSON, default: [])
```

#### Table: `admin_console_logs`
```sql
id (INT, auto-increment, primary key)
user_id (INT, foreign key → users.id)
attempt_time (TIMESTAMP, default: now())
success (BOOLEAN)
ip_address (VARCHAR(45), nullable)
lockout_until (TIMESTAMP, nullable)
```

#### Table: `topics`
```sql
id (INT, auto-increment, primary key)
title (VARCHAR(500), required)
category (TEXT, required) -- '9-sinif', '10-sinif', '11-sinif', '12-sinif', 'tyt', 'ayt'
sub_category (VARCHAR(255), nullable)
content (TEXT, required)
images (JSON, default: [])
videos (JSON, default: [])
difficulty (TEXT, default: 'orta') -- 'kolay', 'orta', 'zor'
priority (INT, default: 0)
ai_summary (JSON, nullable)
created_at (TIMESTAMP, default: now())
updated_at (TIMESTAMP, default: now())
```

#### Table: `comments`
```sql
id (INT, auto-increment, primary key)
topic_id (INT, foreign key → topics.id)
user_id (INT, foreign key → users.id)
text (TEXT, required)
likes (INT, default: 0)
is_locked (BOOLEAN, default: false)
created_at (TIMESTAMP, default: now())
updated_at (TIMESTAMP, default: now())
```

#### Table: `study_plans`
```sql
id (INT, auto-increment, primary key)
user_id (INT, foreign key → users.id)
exam_type (TEXT, required) -- 'TYT', 'AYT', 'BOTH'
target_score (INT)
daily_time_minutes (INT)
weak_topics (JSON, default: [])
plan (JSON, required)
created_at (TIMESTAMP, default: now())
updated_at (TIMESTAMP, default: now())
```

---

## 2️⃣ API Endpoints Setup

### Authentication Group (`/auth`)

#### `POST /auth/signup`
**Input:**
```json
{
  "email": "string",
  "password": "string",
  "display_name": "string"
}
```

**Function Stack:**
1. Check if email exists → if yes, return error
2. Generate UUID for `uid` field
3. Create user record with hashed password
4. Determine role: if email == "senerkadiralper@gmail.com" set role = "admin", else "user"
5. Generate auth token (JWT)
6. Return: `{ "authToken": "...", "user": {...} }`

---

#### `POST /auth/login`
**Input:**
```json
{
  "email": "string",
  "password": "string"
}
```

**Function Stack:**
1. Query user by email
2. Verify password (Xano built-in)
3. Update `last_login_at` to now()
4. Generate auth token (JWT)
5. Return: `{ "authToken": "...", "user": {...} }`

---

#### `GET /auth/me`
**Authentication Required:** Yes (Bearer token)

**Function Stack:**
1. Get authenticated user from token
2. Return user object

---

#### `POST /auth/logout` (Optional)
**Authentication Required:** Yes

**Function Stack:**
1. Invalidate token (optional, JWT is stateless)
2. Return success

---

#### `POST /auth/refresh`
**Authentication Required:** Yes

**Function Stack:**
1. Verify current token
2. Generate new token
3. Return: `{ "authToken": "..." }`

---

### Admin Group (`/admin`)

#### `POST /admin/verify-email`
**Input:**
```json
{
  "email": "string"
}
```

**Function Stack:**
1. Check if email == "senerkadiralper@gmail.com"
2. Return: `{ "isAdmin": true/false }`

---

#### `POST /admin/unlock-console`
**Authentication Required:** Yes (Admin only)

**Input:**
```json
{
  "code": "string"
}
```

**Function Stack:**
1. Verify user is admin
2. Check if code == "GearAdmin9150"
3. Log attempt to `admin_console_logs` table
4. If failed: check attempt count, apply lockout if needed
5. Return: `{ "success": true/false, "lockedUntil": timestamp }`

---

#### `GET /admin/users`
**Authentication Required:** Yes (Admin only)

**Function Stack:**
1. Verify user is admin
2. Query all users
3. Return user list

---

#### `PATCH /admin/users/:id/role`
**Authentication Required:** Yes (Admin only)

**Input:**
```json
{
  "role": "admin" | "moderator" | "user"
}
```

**Function Stack:**
1. Verify user is admin
2. Update target user's role
3. Return updated user

---

## 3️⃣ Environment Variables

Create a `.env.local` file in the project root:

```env
# Get your API base URL from Xano
# Format: https://x8ki-letl-twmt.n7.xano.io/api:YOUR_WORKSPACE_ID
NEXT_PUBLIC_XANO_BASE_URL=https://x8ki-letl-twmt.n7.xano.io/api:xxxxx

# Admin Configuration (DO NOT CHANGE)
NEXT_PUBLIC_ADMIN_EMAIL=senerkadiralper@gmail.com
NEXT_PUBLIC_ADMIN_CONSOLE_CODE=GearAdmin9150

# Gemini AI (Optional - for AI features)
GEMINI_API_KEY=your_gemini_api_key_here
```

**To get your Xano API URL:**
1. Go to https://x8ki-letl-twmt.n7.xano.io/workspace/135476-0/settings
2. Look for "API Base URL" or go to API section
3. Copy the full URL (should include `/api:xxxxx`)

---

## 4️⃣ Run the Application

```bash
# Install dependencies
npm install

# Start development server
npm run dev
```

Visit: http://localhost:3000

---

## 5️⃣ First Time Setup

1. **Create Admin Account:**
   - Go to `/register`
   - Email: `senerkadiralper@gmail.com`
   - Password: Your choice (min 6 characters recommended)
   - Name: Your name

2. **Test Login:**
   - Go to `/login`
   - Login with admin credentials

3. **Unlock Admin Console:**
   - Go to `/profile`
   - You'll see "Admin Console Unlock" section
   - Enter code: `GearAdmin9150`
   - Admin panel will activate

---

## 🔒 Security Notes

- **Never commit `.env.local`** to git (it's gitignored)
- Admin email is hardcoded: `senerkadiralper@gmail.com`
- Console code is: `GearAdmin9150`
- 5 failed unlock attempts = 10 minute lockout
- All passwords are auto-hashed by Xano
- JWT tokens expire after 15 minutes (configurable in Xano)

---

## 📚 API Testing

Use Postman or Thunder Client to test endpoints before frontend integration:

**Example: Signup**
```http
POST https://x8ki-letl-twmt.n7.xano.io/api:xxxxx/auth/signup
Content-Type: application/json

{
  "email": "test@example.com",
  "password": "Test123!",
  "display_name": "Test User"
}
```

**Example: Login**
```http
POST https://x8ki-letl-twmt.n7.xano.io/api:xxxxx/auth/login
Content-Type: application/json

{
  "email": "test@example.com",
  "password": "Test123!"
}
```

**Example: Get Current User**
```http
GET https://x8ki-letl-twmt.n7.xano.io/api:xxxxx/auth/me
Authorization: Bearer YOUR_TOKEN_HERE
```

---

## 🐛 Troubleshooting

### "Cannot connect to Xano"
- Check if `NEXT_PUBLIC_XANO_BASE_URL` is correct in `.env.local`
- Verify Xano workspace is active
- Check if API endpoints are published in Xano

### "401 Unauthorized"
- Token might be expired
- Check if Authorization header is sent
- Verify token is stored in localStorage

### "Admin console not showing"
- Make sure logged in with: `senerkadiralper@gmail.com`
- Check user role in Xano database (should be "admin")

---

## 📞 Support

For Xano-specific issues:
- Xano Docs: https://docs.xano.com/
- Xano Community: https://community.xano.com/

For project issues:
- Email: senerkadiralper@gmail.com
