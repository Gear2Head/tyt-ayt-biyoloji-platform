# 🚀 Xano Database & API Quick Setup Guide

## Adım 1: Database Tablolarını Oluştur

### 📋 Mevcut `user` Tablosunu Güncelle

**Xano'da:** Database > `user` tablosu > Edit

**Eklenecek Field'lar:**
1. `uid` (text, unique) - Frontend ID
2. `display_name` (text)
3. `last_login_at` (timestamp)
4. `favorites` (json, default: [])

**Not:** `role` field zaten var, sadece değerlerini kontrol edin: `admin`, `moderator`, `user`

---

### 📦 Yeni Tablo: `topics`

**Database > + Add table > "topics"**

| Field | Type | Required | Default |
|-------|------|----------|---------|
| id | integer | Auto | - |
| created_at | timestamp | Auto | now() |
| title | text | ✅ | - |
| category | text | ✅ | - |
| sub_category | text | ❌ | - |
| content | text | ✅ | - |
| images | json | ❌ | [] |
| videos | json | ❌ | [] |
| difficulty | text | ❌ | "orta" |
| priority | integer | ❌ | 0 |
| ai_summary | json | ❌ | - |
| updated_at | timestamp | ✅ | now() |

---

### 💬 Yeni Tablo: `comments`

**Database > + Add table > "comments"**

| Field | Type | Required | Default |
|-------|------|----------|---------|
| id | integer | Auto | - |
| created_at | timestamp | Auto | now() |
| topic_id | integer | ✅ | - |
| user_id | integer | ✅ | - |
| text | text | ✅ | - |
| likes | integer | ❌ | 0 |
| is_locked | boolean | ❌ | false |
| updated_at | timestamp | ✅ | now() |

**Foreign Keys:**
- `topic_id` → `topics.id`
- `user_id` → `user.id`

---

### 📚 Yeni Tablo: `study_plans`

**Database > + Add table > "study_plans"**

| Field | Type | Required | Default |
|-------|------|----------|---------|
| id | integer | Auto | - |
| created_at | timestamp | Auto | now() |
| user_id | integer | ✅ | - |
| exam_type | text | ✅ | - |
| target_score | integer | ❌ | - |
| daily_time_minutes | integer | ❌ | - |
| weak_topics | json | ❌ | [] |
| plan | json | ✅ | - |
| updated_at | timestamp | ✅ | now() |

**Foreign Key:**
- `user_id` → `user.id`

---

### 🔐 Yeni Tablo: `admin_console_logs`

**Database > + Add table > "admin_console_logs"**

| Field | Type | Required | Default |
|-------|------|----------|---------|
| id | integer | Auto | - |
| created_at | timestamp | Auto | now() |
| user_id | integer | ✅ | - |
| attempt_time | timestamp | ✅ | now() |
| success | boolean | ✅ | false |
| ip_address | text | ❌ | - |
| lockout_until | timestamp | ❌ | - |

**Foreign Key:**
- `user_id` → `user.id`

---

## Adım 2: API Endpoint'leri Oluştur

### 🔑 Authentication Group

**API > + Add API Group > "auth"**

---

#### 1️⃣ `POST /auth/signup`

**Inputs:**
- `email` (text, required)
- `password` (text, required)
- `display_name` (text, required)

**Functionstack:**
```
1. Query: Check if email exists
   - Table: user
   - Filter: email = input.email
   - If exists: Return error "Email already registered"

2. Variable: Generate UUID
   - var.uid = UUID()

3. Variable: Determine role
   - If input.email == "senerkadiralper@gmail.com"
     - var.role = "admin"
   - Else
     - var.role = "user"

4. Add Record: Create user
   - Table: user
   - Fields:
     - uid: var.uid
     - email: input.email
     - password: input.password (auto-hashed)
     - display_name: input.display_name
     - role: var.role
     - created_at: now()
     - last_login_at: now()
     - favorites: []

5. Authentication: Create auth token
   - Generate JWT for user

6. Response:
   {
     "authToken": <token>,
     "user": {
       "id": <user.id>,
       "uid": <user.uid>,
       "email": <user.email>,
       "display_name": <user.display_name>,
       "role": <user.role>,
       "created_at": <user.created_at>,
       "last_login_at": <user.last_login_at>,
       "favorites": <user.favorites>
     }
   }
```

---

#### 2️⃣ `POST /auth/login`

**Inputs:**
- `email` (text, required)
- `password` (text, required)

**Functionstack:**
```
1. Authentication: Login
   - Email: input.email
   - Password: input.password
   - If fail: Return error "Invalid credentials"

2. Update Record: Last login
   - Table: user
   - Record: <authenticated user>
   - Fields:
     - last_login_at: now()

3. Authentication: Create auth token
   - Generate JWT

4. Response:
   {
     "authToken": <token>,
     "user": {<user object>}
   }
```

---

#### 3️⃣ `GET /auth/me`

**Authentication Required:** ✅

**Functionstack:**
```
1. Get Authenticated User
   - var.user = auth.user

2. Response: Return user object
```

---

#### 4️⃣ `POST /auth/logout`

**Authentication Required:** ✅

**Functionstack:**
```
1. Invalidate Token (if needed)
2. Response: { "success": true }
```

---

#### 5️⃣ `POST /auth/refresh`

**Authentication Required:** ✅

**Functionstack:**
```
1. Get Authenticated User
2. Generate New Token
3. Response: { "authToken": <new_token> }
```

---

### 🛡️ Admin Group

**API > + Add API Group > "admin"**

---

#### 1️⃣ `POST /admin/unlock-console`

**Authentication Required:** ✅

**Inputs:**
- `code` (text, required)

**Functionstack:**
```
1. Get Authenticated User
   - var.user = auth.user

2. Check Admin Email
   - If var.user.email != "senerkadiralper@gmail.com"
     - Return error 403 "Not authorized"

3. Variable: Check code
   - var.correct_code = "GearAdmin9150"
   - var.success = (input.code == var.correct_code)

4. Add Record: Log attempt
   - Table: admin_console_logs
   - Fields:
     - user_id: var.user.id
     - success: var.success
     - attempt_time: now()

5. Condition: If success
   - Response: { "success": true }
   
   Else:
   - Query: Count failed attempts (last 10 minutes)
     - Table: admin_console_logs
     - Filter: user_id = var.user.id AND success = false
     - Created_at > (now - 10 minutes)
   
   - If count >= 5:
     - Response: {
         "success": false,
         "error": "Too many attempts",
         "lockedUntil": <now + 10 minutes>
       }
   - Else:
     - Response: {
         "success": false,
         "error": "Invalid code",
         "attemptsRemaining": <5 - count>
       }
```

---

## Adım 3: API Base URL'i Al

**Workspace > Settings > API**

URL Format: `https://x8ki-letl-twmt.n7.xano.io/api:xxxxx`

---

## Adım 4: Environment Variables

`.env.local` dosyası oluştur:

```env
NEXT_PUBLIC_XANO_BASE_URL=<yukarıdaki URL>
NEXT_PUBLIC_ADMIN_EMAIL=senerkadiralper@gmail.com
NEXT_PUBLIC_ADMIN_CONSOLE_CODE=GearAdmin9150
GEMINI_API_KEY=your_key_here
```

---

## Test Et

```bash
npm run dev
```

1. `http://localhost:3000/register` → Kayıt ol
2. `http://localhost:3000/login` → Giriş yap
3. `http://localhost:3000/profile` → Admin console unlock test

---

**Hazır olunca bana haber verin, API test edeceğiz! 🚀**
