# 🎨 IA Factory - Frontend UI

**Geneva Digital Butler** - Modern Next.js 14 Frontend with Swiss Design Principles

---

## 🚀 Quick Start

### Installation

```bash
cd frontend/ia-factory-ui
npm install
```

### Development

```bash
npm run dev
```

Visit `http://localhost:3000`

### Build

```bash
npm run build
npm start
```

---

## 📁 Architecture

```
frontend/ia-factory-ui/
├── app/                      # Next.js 14 App Router
│   ├── layout.tsx           # Root layout
│   ├── page.tsx             # Home (redirects to dashboard)
│   ├── globals.css          # Global styles + Tailwind
│   └── dashboard/
│       └── page.tsx         # Main dashboard
│
├── components/
│   ├── ui/                  # shadcn/ui primitives
│   │   ├── button.tsx
│   │   ├── card.tsx
│   │   ├── dialog.tsx
│   │   ├── toast.tsx
│   │   └── toaster.tsx
│   │
│   ├── voice/               # Voice Recording
│   │   ├── VoiceRecorder.tsx      # Central Pulse Microphone + Waveform
│   │   └── LiveTranscription.tsx  # Real-time transcription display
│   │
│   ├── digital-twin/        # AI Intelligence
│   │   └── DigitalTwinSidebar.tsx # Emotions + Lexicon + ROI
│   │
│   ├── tokens/              # Monetization
│   │   ├── TokenWidget.tsx        # Balance display
│   │   └── RedeemCodeModal.tsx    # Premium scratch card UI
│   │
│   └── briefing/
│       └── DailyBriefingCard.tsx  # Morning briefing
│
├── lib/
│   ├── api.ts               # Axios client + API functions
│   ├── utils.ts             # Helper functions
│   ├── hooks/
│   │   └── useToast.ts
│   └── providers/
│       └── TenantProvider.tsx     # Multi-tenant context
│
├── public/
│   └── logos/               # Tenant-specific logos
│
├── tailwind.config.js       # Tailwind + Custom colors
├── next.config.js           # Next.js + API proxy
├── tsconfig.json
└── package.json
```

---

## 🎨 Design Philosophy

### Swiss Design Principles
- **Clean**: Minimalist, no clutter
- **High Readability**: Clear typography, excellent contrast
- **Functional**: Every element serves a purpose
- **Professional**: Dark mode, elegant gradients

### Color System

**Multi-Tenant Support**:
- 🇨🇭 **Switzerland**: Red gradient (`#ef4444` → `#b91c1c`)
- 🇩🇿 **Algeria**: Green gradient (`#22c55e` → `#15803d`)
- 🌍 **Geneva**: Purple gradient (`#667eea` → `#764ba2`)

**Theme Colors**:
```css
/* Dark Mode (Default) */
--background: 222.2 84% 4.9%
--foreground: 210 40% 98%
--primary: 217.2 91.2% 59.8%
```

---

## 🧩 Key Components

### 1. **Voice Recorder** (`VoiceRecorder.tsx`)

**Features**:
- Central pulse button (mic/stop)
- Real-time waveform visualization (40 bars)
- Audio level detection
- Web Audio API integration
- Auto-transcription on stop

**Props**:
```typescript
{
  isRecording: boolean
  setIsRecording: (recording: boolean) => void
  onTranscriptionComplete: (result: any) => void
  gradientColor: string
}
```

### 2. **Live Transcription** (`LiveTranscription.tsx`)

**Features**:
- Auto-scrolling text display
- Keyword extraction highlighting
- Character/word count
- Smooth animations (Framer Motion)

### 3. **Digital Twin Sidebar** (`DigitalTwinSidebar.tsx`)

**Features**:
- **Emotion Display**: Detected emotion + stress level (0-10)
- **Heritage Detection**: Cultural nuances (proverbs, references)
- **Personal Lexicon**: Top 10 professional terms with frequency
- **ROI Tracker**: Total savings + hours transcribed

### 4. **Token Widget** (`TokenWidget.tsx`)

**Features**:
- Real-time balance display
- Progress bar (remaining %)
- Refresh on click
- Gradient styling per tenant

### 5. **Redeem Code Modal** (`RedeemCodeModal.tsx`)

**Features**:
- Premium scratch card design
- 16-digit code input (formatted: XXXX-XXXX-XXXX-XXXX)
- Success animation with confetti effect
- Error handling

### 6. **Daily Briefing Card** (`DailyBriefingCard.tsx`)

**Features** (Geneva Mode):
- ☀️ Weather + advice
- 📧 Top 3 priority emails
- 📅 Next meeting + route calculation
- 💊 Medication reminders

---

## 🔌 API Integration

### Configuration

**Environment Variables** (`.env.local`):
```bash
NEXT_PUBLIC_API_URL=http://localhost:8002
NEXT_PUBLIC_WS_URL=ws://localhost:8002
```

### API Client

**Base Setup** (`lib/api.ts`):
```typescript
import { api } from '@/lib/api'

// Automatic API key injection from localStorage
// Auto-redirect to /login on 401
```

### Available APIs

#### Token API
```typescript
tokenApi.getBalance(tenantId)
tokenApi.redeemCode(tenantId, code)
tokenApi.getHistory(tenantId, limit)
```

#### Voice API
```typescript
voiceApi.transcribe(audioBlob, userId, professionalContext?)
```

#### Digital Twin API
```typescript
digitalTwinApi.getLexicon(tenantId, userId, domain?)
digitalTwinApi.getROIStats(tenantId)
```

#### Mobile API
```typescript
mobileApi.createPairing(deviceName, deviceOS)
mobileApi.getBriefing(tenantId, userId, format)
```

---

## 🌐 Multi-Tenant Support

### Tenant Detection

**Hostname-based**:
- `suisse.iafactory.pro` or `switzerland.*` → Swiss tenant
- `algerie.iafactory.pro` or `algeria.*` → Algerian tenant
- Default → Geneva multicultural

**Usage**:
```typescript
import { useTenant } from '@/lib/providers/TenantProvider'

function MyComponent() {
  const { tenant, tenantId, logo, colors } = useTenant()

  return (
    <div style={{ background: colors.gradient }}>
      Tenant: {tenant}
    </div>
  )
}
```

---

## 🎭 Animations

### Framer Motion

**Used for**:
- Component entrance (fade-in, slide-up)
- Number counters (tokens balance)
- Success states (scale, bounce)
- List items (staggered entrance)

**Example**:
```typescript
<motion.div
  initial={{ opacity: 0, y: 20 }}
  animate={{ opacity: 1, y: 0 }}
  transition={{ duration: 0.5 }}
>
  Content
</motion.div>
```

---

## 📱 Mobile-First Design

### Responsive Classes

**Tailwind Breakpoints**:
```css
/* Mobile: default */
/* Tablet: md:... */
/* Desktop: lg:... */
/* Large: xl:... */
```

**Custom Mobile Classes**:
```css
.mobile-full { /* Full screen on mobile */ }
.mobile-padding { /* px-4 py-6 on mobile */ }
```

### Touch Optimization

- Large touch targets (min 44px)
- Smooth scroll with `scrollbar-thin`
- No hover-only interactions
- Auto-focus for inputs

---

## 🔐 Security

### API Key Storage

**localStorage**:
```typescript
localStorage.setItem('api_key', key)
localStorage.setItem('tenant_id', tenantId)
```

**Automatic Injection**:
- All API requests include `X-API-Key` header
- All requests include `X-Tenant-ID` header

### Auto-Redirect

**401 Unauthorized** → Redirect to `/login`

---

## 🧪 Testing

### Manual Testing Checklist

- [ ] Voice recording starts/stops correctly
- [ ] Waveform visualizes audio level
- [ ] Transcription appears after recording
- [ ] Emotion analysis displays (stress, heritage)
- [ ] Keywords extracted and highlighted
- [ ] Personal lexicon updates
- [ ] ROI stats load correctly
- [ ] Token balance refreshes
- [ ] Redeem code validates format
- [ ] Daily briefing loads (Geneva mode)
- [ ] Tenant colors change per hostname
- [ ] Mobile responsive layout works
- [ ] Dark mode throughout

---

## 🚀 Deployment

### Vercel (Recommended)

```bash
npm run build
vercel --prod
```

### Docker

```bash
docker build -t ia-factory-ui .
docker run -p 3000:3000 ia-factory-ui
```

### Environment Variables

**Production**:
```bash
NEXT_PUBLIC_API_URL=https://api.iafactory.pro
NEXT_PUBLIC_WS_URL=wss://api.iafactory.pro
```

---

## 📊 Performance

### Optimizations

- **Next.js 14 App Router**: Server components by default
- **Code Splitting**: Automatic per route
- **Image Optimization**: Next/Image for logos
- **Lazy Loading**: Framer Motion animations deferred
- **API Caching**: React Query recommended (TODO)

### Bundle Size

**Target**:
- First Load JS: < 200 KB
- Total Size: < 500 KB

---

## 🔮 Future Enhancements

### Phase 4 (Planned)

- [ ] Authentication UI (Login/Register)
- [ ] Mobile QR Code pairing UI
- [ ] Geneva Mode cultural selector
- [ ] Voice settings (language, accent)
- [ ] Notification system (WebSocket)
- [ ] Offline support (PWA)
- [ ] Multi-language i18n (fr, ar, en)
- [ ] Voice playback of briefing
- [ ] Export transcriptions (PDF, TXT)
- [ ] Team collaboration features

---

## 🤝 Contributing

### Code Style

- **TypeScript**: Strict mode enabled
- **ESLint**: Next.js config
- **Prettier**: Auto-format on save
- **Naming**: PascalCase for components, camelCase for functions

### Component Structure

```typescript
'use client' // If uses hooks

import { ... } from '...'

interface Props {
  // Props definition
}

export default function ComponentName({ prop1, prop2 }: Props) {
  // Hooks
  const [state, setState] = useState()

  // Effects
  useEffect(() => { ... }, [])

  // Handlers
  const handleClick = () => { ... }

  // Render
  return (
    <div>
      ...
    </div>
  )
}
```

---

## 📞 Support

**Issues**: [GitHub Issues](https://github.com/iafactory/rag-dz/issues)
**Documentation**: `/docs`
**API Docs**: `http://localhost:8002/docs`

---

**Built with ❤️ using Next.js 14, TypeScript, Tailwind CSS, and Swiss Design Principles**

*Geneva Digital Butler - Your AI-powered sovereign assistant*
