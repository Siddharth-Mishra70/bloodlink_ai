# BloodLink AI 🩸🤖

> **Intelligent Emergency Blood Banking & Donor Matching Platform**

BloodLink AI is a modern React application powered by Vite, Tailwind CSS, and OpenAI models. It streamlines blood donation management, provides predictive inventory forecasting with shortage alerts, calculates clinically valid alternative blood group compatibilities, and matches urgent hospital requisitions with nearby verified blood banks.

---

## 🚀 Key Features

- **Emergency Blood Request Portal (`/emergency-blood-request`)**: Real-time broadcast system for urgent hospital and trauma blood requirements with 1-click dispatch.
- **Predictive AI Demand Forecasting**: Integrates OpenAI (`gpt-5` structured JSON schema) to forecast regional blood supply shortages, seasonal demand spikes, and shelf-life expirations.
- **ABO/Rh Alternative Compatibility Engine**: Clinically validated red blood cell compatibility matrix suggesting viable alternative donor types (such as universal O- Negative) when requested units are depleted.
- **Real-Time Streaming AI Assistant (`AIChat`)**: Low-latency interactive conversational assistant powered by `gpt-5-mini` token streaming for patient and donor questions.
- **Nearby Blood Bank Locator (`/blood-bank-search`)**: Multi-filter discovery tool (distance radius, open 24/7, high availability, verified centers) with Google Maps integration.
- **Comprehensive Management Dashboards**:
  - **Blood Bank Administrative Portal (`/blood-bank-dashboard`)**: Stock tracking, expiration countdowns, request triage queue, and notification center.
  - **Donor & Patient Portal (`/user-dashboard`)**: Donation tracking, next eligible donation dates, in-flight request status, and personalized health guidance.

---

## 🛠️ Tech Stack

- **Frontend Core**: React 18 (Concurrent Mode), Vite 5
- **Routing**: React Router v6 with Error Boundaries and auto ScrollToTop
- **Styling**: Tailwind CSS 3.4, PostCSS, Lucide Icons, Class Variance Authority (CVA)
- **Data Visualization**: Recharts (Demand forecast charts)
- **AI / LLM Services**: OpenAI SDK (`gpt-5`, `gpt-5-mini`, `text-moderation-latest`)
- **State & Utilities**: Redux Toolkit, clsx, tailwind-merge

---

## 📋 Getting Started

### Prerequisites

- **Node.js**: v18.x or higher
- **npm** or **yarn** or **pnpm**

### 1. Installation

```bash
git clone https://github.com/Siddharth-Mishra70/bloodlink_ai.git
cd bloodlink_ai
npm install
```

### 2. Environment Configuration

Create or update the `.env` file in the root directory:

```env
VITE_OPENAI_API_KEY=your_openai_api_key_here
```

### 3. Start Development Server

```bash
npm start
# or
npm run dev
```

The application will run at `http://localhost:4028` (or available Vite port).

### 4. Build for Production

```bash
npm run build
```

---

## 📁 Project Structure

```
bloodlink_ai/
├── public/                      # Static assets, icons, and manifests
├── src/
│   ├── components/              # Shared core components
│   │   ├── ui/                  # UI design system (Button, Input, Select, Checkbox, Header)
│   │   ├── AIChat.jsx           # Streaming token AI chat widget
│   │   ├── AIRecommendations.jsx# Personalized health guidance card
│   │   ├── AppIcon.jsx          # Dynamic Lucide Icon resolver
│   │   ├── AppImage.jsx         # Safe fallback image component
│   │   ├── ErrorBoundary.jsx    # Uncaught runtime exception boundary
│   │   └── ScrollToTop.jsx      # Route transition scroll reset
│   ├── pages/
│   │   ├── blood-bank-dashboard/# Staff inventory & request management
│   │   ├── blood-bank-search/   # Map & list locator for blood banks
│   │   ├── emergency-blood-request/ # Urgent hospital requisition portal
│   │   ├── user-dashboard/      # Donor and patient personalized portal
│   │   ├── user-login/          # Multi-role authentication & credentials
│   │   ├── user-registration/   # Donor onboarding & social login
│   │   └── NotFound.jsx         # 404 Recovery screen
│   ├── services/
│   │   ├── openaiClient.js      # Singleton OpenAI client instance
│   │   └── openaiService.js     # AI triage, forecasting & streaming services
│   ├── styles/                  # Tailwind CSS & global styling rules
│   ├── utils/                   # Helper functions (cn.js, etc.)
│   ├── App.jsx                  # Root component
│   ├── index.jsx                # DOM mount entry point
│   └── Routes.jsx               # Centralized route definitions
├── package.json                 # Project dependencies & scripts
├── tailwind.config.js           # Tailwind theme configuration
└── vite.config.mjs              # Vite 5 server & build setup
```

---

## 📄 License

This project is licensed under the MIT License.
