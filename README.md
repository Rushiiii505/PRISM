# ✦ PRISM | Automated Dev Community Content Engine

> **Prism** ingests technical GitHub PRs or release notes payloads and translates them into a ready-to-publish suite of omni-channel social media posts, visual 5-slide carousels, and downloadable localized community hype kits (.zip packages).

---

## 🎨 Design System & Visual Identity

Prism strictly adheres to a friendly, modern design aesthetic blending clean typography with distinct color blocking and vector accents:

| Token | Hex / Value | Description |
| :--- | :--- | :--- |
| **Background** | `#F7F7F5` | Warm light cream canvas background |
| **Primary Accent** | `#3B28CC` | Electric blue for primary actions & slide highlights |
| **Secondary Highlight** | `#D4FF33` | Energetic lime green for CTA badges & text highlights |
| **Text** | `#1A1A1A` | Deep charcoal for high contrast readability |
| **Buttons** | `rounded-full` | Heavy pill-shaped buttons with directional arrow `↗` badges |
| **Cards** | `rounded-3xl` | Distinct 2XL/3XL cards with subtle borders (`border-gray-300`) |
| **Accents** | `✦` | Vector 8-point asterisks to punctuate negative space |

---

## ⚙️ Core Architecture & System Modules

```
 ┌────────────────┐     ┌────────────────┐     ┌────────────────┐
 │    THE BEAM    │ ──> │   THE CANVAS   │ ──> │  WAVELENGTHS   │
 │ GitHub PR / Diff│     │ Live AI Engine │     │ Social & Slides│
 └────────────────┘     └────────────────┘     └────────────────┘
         │                      │                      │
         ▼                      ▼                      ▼
 ┌────────────────┐     ┌────────────────┐     ┌────────────────┐
 │   THE VAULT    │     │   REACT BITS   │     │    SCATTER     │
 │ AES-256 Keys DB│     │  Curved & Blur │     │ JSZip Packager │
 └────────────────┘     └────────────────┘     └────────────────┘
```

### 1. 🔐 "The Vault" (Secure API & Key Storage)
- **Encryption**: Standard Node.js `crypto` module (AES-256-GCM) encrypts OpenAI, Anthropic, Replicate, and fal.ai keys before writing to SQLite / PostgreSQL.
- **ORM & Database**: Prisma Client v7 with SQLite local driver adapter (`@prisma/adapter-better-sqlite3`).
- **Brand Kit Engine**: Customizable Brand Name, primary/accent color codes, tone of voice, and audience targeting.

### 2. ⚡ "The Beam" (Live PR & Diff Extraction)
- Ingests GitHub PR URLs (`https://github.com/owner/repo/pull/123`).
- Fetches PR details, commits, description, and raw `.diff` payload using the official GitHub REST API.

### 3. 🎨 "The Canvas" (Live AI Streaming Engine)
- Formats code diffs into structured omni-channel release kits using Vercel AI SDK (`@ai-sdk/openai`, `@ai-sdk/anthropic`).
- Connects to Replicate & fal.ai for real visual image generation.

### 4. 📢 "Wavelengths" (Omni-Channel Output & Direct Publishing)
- **Instagram 5-Slide Carousel**: Horizontal scrolling gallery of 5 customizable slide cards with code highlight blocks.
- **X/Twitter & LinkedIn**: Editable technical thread and executive post copy.
- **Discord Announcement**: Formatted markdown payload with live Discord Webhook execution.

### 5. 📦 "Scatter" (Community Multiplier Engine)
- Client-side `JSZip` utility packages all generated copy (`x_thread.txt`, `linkedin_post.txt`, `discord_announcement.md`), slide assets (`slide_1.txt` ... `slide_5.txt`), and `hype_kit_instructions.md` into a single downloadable `.zip` file with one click.

---

## 🚀 React Bits Components Integrated

- **`<CurvedLoop />`**: Marquee effect rendering curved text paths across headers.
- **`<GradualBlur />`**: Gradient backdrop blur overlay appended to bottom navigation and footer containers.

---

## 🛠️ Tech Stack

- **Framework**: Next.js 14+ (App Router) with React 19 & TypeScript (Strict Mode)
- **Styling**: Tailwind CSS
- **Database / ORM**: Prisma ORM v7 with SQLite / PostgreSQL
- **State Management**: Zustand
- **AI SDK**: Vercel AI SDK (`ai`, `@ai-sdk/openai`, `@ai-sdk/anthropic`)
- **Package Utilities**: `jszip`, `file-saver`, `lucide-react`

---

## 💻 Quick Start & Setup

### 1. Clone the repository
```bash
git clone https://github.com/your-username/prism.git
cd prism
```

### 2. Install dependencies
```bash
npm install
```

### 3. Setup Environment Variables
Create a `.env` file in the root directory:
```env
DATABASE_URL="file:./dev.db"
ENCRYPTION_SECRET="prism_secure_vault_secret_32bytes_key!!"
NEXTAUTH_SECRET="prism_nextauth_secret_key_123456789"
NEXTAUTH_URL="http://localhost:3000"

# Optional global fallback keys (or configure directly in UI Vault)
OPENAI_API_KEY=""
ANTHROPIC_API_KEY=""
FAL_KEY=""
REPLICATE_API_TOKEN=""
```

### 4. Push Prisma Database Schema
```bash
npx prisma db push
```

### 5. Run the Development Server
```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser to view Prism.

---

## 🛡️ License

MIT License. Designed with ✦ by the Prism Core Dev Team.
