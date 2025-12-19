# ⚡ QUICK START - IA FACTORY FULL-STACK

**Date**: 2025-12-16
**Status**: Ready to run in 5 minutes

---

## 🚀 5-MINUTE STARTUP

### Prerequisites

✅ **Required**:
- PostgreSQL 15+ (running on port 6330)
- Python 3.11+
- Node.js 20+

✅ **Optional**:
- Docker + Docker Compose

---

## 📦 OPTION 1: Manual Startup

### Step 1: Start PostgreSQL

```bash
# If using Docker
docker run -d \
  --name iafactory-postgres \
  -e POSTGRES_PASSWORD=ragdz2024secure \
  -e POSTGRES_DB=iafactory_dz \
  -p 6330:5432 \
  postgres:15-alpine

# Or use existing PostgreSQL server
```

### Step 2: Run Backend Migrations

```bash
cd backend/rag-compat

# Execute all migrations
PGPASSWORD=ragdz2024secure psql -U postgres -h localhost -p 6330 -d iafactory_dz -f migrations/009_token_system.sql
PGPASSWORD=ragdz2024secure psql -U postgres -h localhost -p 6330 -d iafactory_dz -f migrations/010_personal_lexicon.sql
PGPASSWORD=ragdz2024secure psql -U postgres -h localhost -p 6330 -d iafactory_dz -f migrations/011_geneva_multicultural.sql
PGPASSWORD=ragdz2024secure psql -U postgres -h localhost -p 6330 -d iafactory_dz -f migrations/012_life_operations.sql
```

### Step 3: Start Backend

```bash
cd backend/rag-compat

# Install dependencies (first time only)
pip install -r requirements.txt

# Start FastAPI server
python -m uvicorn app.main:app --host 0.0.0.0 --port 8002 --reload
```

**Test**: `curl http://localhost:8002/health`

### Step 4: Start Frontend

```bash
# Open new terminal
cd frontend/ia-factory-ui

# Install dependencies (first time only)
npm install

# Start Next.js
npm run dev
```

**Access**: `http://localhost:3000`

---

## 🐳 OPTION 2: Docker Compose (Fastest)

### Single Command

```bash
docker-compose up -d
```

**Services Started**:
- PostgreSQL: `localhost:6330`
- Backend API: `http://localhost:8002`
- Frontend UI: `http://localhost:3000`

**Health Check**:
```bash
curl http://localhost:8002/health
```

---

## 🧪 VERIFY INSTALLATION

### 1. Check Database

```bash
PGPASSWORD=ragdz2024secure psql -U postgres -h localhost -p 6330 -d iafactory_dz -c "SELECT table_name FROM information_schema.tables WHERE table_schema = 'public' AND table_name IN ('licence_codes', 'user_preferences_lexicon', 'cultural_nuances', 'daily_briefings') ORDER BY table_name;"
```

**Expected Output**: 14 tables total

### 2. Check Backend

```bash
# Health check
curl http://localhost:8002/health

# API docs (Swagger)
open http://localhost:8002/docs
```

**Expected**: `{"status":"healthy"}`

### 3. Check Frontend

```bash
# Open in browser
open http://localhost:3000
```

**Expected**: IA Factory Dashboard with dark theme

---

## 🎯 FIRST USE

### Test Voice Recording

1. **Go to Dashboard**: `http://localhost:3000/dashboard`
2. **Click central mic button** (large circular button)
3. **Speak** into your microphone
4. **See waveform** animate (40 bars)
5. **Click stop** (square button)
6. **Wait** for transcription (~2 seconds)
7. **See results**:
   - Transcription text appears
   - Keywords highlighted in yellow pills
   - Emotion analysis in right sidebar
   - ROI stats updated

### Test Token System

1. **Check balance** in header (top-right)
2. **Click "Redeem"** button
3. **Enter test code**: `TEST-1234-5678-9ABC`
4. **See success animation**
5. **Balance updated**

### Test Multi-Tenant

**Change hostname** to test tenant colors:

```bash
# Edit /etc/hosts (Mac/Linux) or C:\Windows\System32\drivers\etc\hosts (Windows)

127.0.0.1 suisse.localhost
127.0.0.1 algerie.localhost
127.0.0.1 geneva.localhost
```

**Then access**:
- `http://suisse.localhost:3000` → Red gradient (Switzerland)
- `http://algerie.localhost:3000` → Green gradient (Algeria)
- `http://geneva.localhost:3000` → Purple gradient (Geneva)

---

## 🔑 DEFAULT CREDENTIALS

### PostgreSQL

```
Host: localhost
Port: 6330
User: postgres
Password: ragdz2024secure
Database: iafactory_dz
```

### API Key (Mock - for testing)

```
X-API-Key: test-api-key-12345
X-Tenant-ID: 814c132a-1cdd-4db6-bc1f-21abd21ec37d
```

**To set in browser**:
```javascript
localStorage.setItem('api_key', 'test-api-key-12345')
localStorage.setItem('tenant_id', '814c132a-1cdd-4db6-bc1f-21abd21ec37d')
```

---

## 🛠️ COMMON ISSUES

### Issue 1: Port Already in Use

**Error**: `Address already in use: port 8002`

**Solution**:
```bash
# Kill process on port 8002
# Mac/Linux:
lsof -ti:8002 | xargs kill -9

# Windows:
netstat -ano | findstr :8002
taskkill /PID <PID> /F
```

### Issue 2: PostgreSQL Connection Failed

**Error**: `connection refused on localhost:6330`

**Solution**:
```bash
# Check PostgreSQL is running
docker ps | grep postgres

# Or start manually
docker start iafactory-postgres
```

### Issue 3: Faster-Whisper Model Not Found

**Error**: `Model 'base' not found`

**Solution**:
```bash
# Download model (first time only)
python -c "from faster_whisper import WhisperModel; WhisperModel('base', device='cpu')"
```

### Issue 4: Frontend Build Error

**Error**: `Module not found: @/lib/api`

**Solution**:
```bash
cd frontend/ia-factory-ui

# Clean install
rm -rf node_modules package-lock.json
npm install
```

---

## 📊 VERIFY ALL FEATURES

### Backend Features

| Feature | Test | Expected Result |
|---------|------|----------------|
| Health Check | `curl http://localhost:8002/health` | `{"status":"healthy"}` |
| API Docs | `open http://localhost:8002/docs` | Swagger UI |
| Token Balance | `GET /api/tokens/balance?tenant_id=...` | Balance JSON |
| Voice Transcribe | Upload audio via Swagger | Transcription result |
| Digital Twin | `GET /api/digital-twin/lexicon` | Lexicon JSON |
| ROI Stats | `GET /api/digital-twin/roi/stats` | ROI JSON |

### Frontend Features

| Feature | Test | Expected Result |
|---------|------|----------------|
| Dashboard Load | Open `http://localhost:3000` | Dark theme dashboard |
| Voice Recording | Click mic button | Waveform animates |
| Transcription | Stop recording | Text appears |
| Emotion Display | After transcription | Sidebar shows emotion |
| Token Widget | Check header | Balance displayed |
| Redeem Modal | Click "Redeem" | Scratch card UI opens |
| Multi-Tenant | Change hostname | Colors change |

---

## 🚀 NEXT STEPS

### 1. Configure External APIs (Optional)

**Edit** `backend/rag-compat/.env`:
```bash
# Google APIs
GOOGLE_MAPS_API_KEY=your_key_here
GMAIL_API_CLIENT_ID=your_client_id
GOOGLE_CALENDAR_API_KEY=your_key_here

# Weather API
OPENWEATHER_API_KEY=your_key_here

# LLM APIs
OPENAI_API_KEY=your_key_here
GROQ_API_KEY=your_key_here
GOOGLE_AI_API_KEY=your_key_here
```

### 2. Set Up Production Environment

**Backend** (`.env.production`):
```bash
POSTGRES_URL=postgresql://user:pass@prod-host:5432/iafactory_dz
API_SECRET_KEY=your-secret-key-here
ENVIRONMENT=production
```

**Frontend** (`.env.production`):
```bash
NEXT_PUBLIC_API_URL=https://api.iafactory.pro
NEXT_PUBLIC_WS_URL=wss://api.iafactory.pro
```

### 3. Deploy to Production

**Backend**:
```bash
cd backend/rag-compat
uvicorn app.main:app --host 0.0.0.0 --port 8002 --workers 4
```

**Frontend**:
```bash
cd frontend/ia-factory-ui
npm run build
npm start
```

**Or use Docker**:
```bash
docker-compose -f docker-compose.prod.yml up -d
```

---

## 📚 DOCUMENTATION

### Full Documentation

| Document | Description |
|----------|-------------|
| `MASTER_STATUS_3_PHASES_COMPLETE.md` | Backend overview (3 phases) |
| `FRONTEND_ARCHITECTURE_COMPLETE.md` | Frontend architecture |
| `PROJECT_STATUS_COMPLETE_2025-12-16.md` | Full project status |
| `DEPLOYMENT_STATUS_FINAL.md` | Deployment verification |
| `GENEVA_DIGITAL_BUTLER_SCENARIO.md` | Use case example |
| `backend/rag-compat/README.md` | Backend documentation |
| `frontend/ia-factory-ui/README.md` | Frontend documentation |

### API Documentation

**Swagger UI**: `http://localhost:8002/docs`
**ReDoc**: `http://localhost:8002/redoc`

---

## 🆘 SUPPORT

### Get Help

1. **Check logs**:
   ```bash
   # Backend logs
   docker logs -f iafactory-backend

   # Frontend logs
   cd frontend/ia-factory-ui && npm run dev
   ```

2. **Database debugging**:
   ```bash
   PGPASSWORD=ragdz2024secure psql -U postgres -h localhost -p 6330 -d iafactory_dz
   ```

3. **Reset everything**:
   ```bash
   docker-compose down -v
   docker-compose up -d
   ```

### Contact

- GitHub Issues: `https://github.com/iafactory/rag-dz/issues`
- Email: `support@iafactory.pro`

---

## ✅ CHECKLIST

Before reporting issues, verify:

- [ ] PostgreSQL is running on port 6330
- [ ] All 4 migrations executed successfully
- [ ] Backend returns `{"status":"healthy"}`
- [ ] Frontend loads at `http://localhost:3000`
- [ ] Microphone permissions granted in browser
- [ ] No console errors in browser DevTools
- [ ] API key set in localStorage (for testing)

---

## 🎉 SUCCESS!

If you see:
- ✅ Dark theme dashboard with IA Factory logo
- ✅ Central pulse microphone button
- ✅ Token widget in header
- ✅ Digital Twin sidebar on right
- ✅ No errors in console

**Congratulations! You're ready to use IA Factory.** 🚀

---

*Quick Start Guide - Geneva Digital Butler*
*Get running in 5 minutes*
