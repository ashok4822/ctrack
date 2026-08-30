# cTrack — Frontend

A modern, full-featured **Container Tracking & Yard Management** web application built with React 19, TypeScript, and Tailwind CSS. It serves three distinct user roles: **Customer**, **Operator**, and **Admin**, each with a dedicated portal.

---

## 🚀 Tech Stack

| Category | Technology |
|---|---|
| Framework | React 19 + Vite |
| Language | TypeScript |
| Styling | Tailwind CSS v3 + shadcn/ui (Radix UI) |
| State Management | Redux Toolkit + React Redux |
| Routing | React Router DOM v7 |
| Forms | React Hook Form + Zod |
| HTTP Client | Axios |
| Real-time | Socket.IO Client |
| AI Integration | Vercel AI SDK (`ai`, `@ai-sdk/react`) |
| Charts | Recharts |
| PDF Export | jsPDF + jspdf-autotable |
| Auth | Google OAuth (`@react-oauth/google`) |
| Themes | next-themes |
| Linting | ESLint + typescript-eslint |

---

## 📁 Project Structure

```
frontend/
├── public/               # Static assets
├── src/
│   ├── assets/           # Images, icons, and other static files
│   ├── components/       # Reusable UI components (shadcn/ui + custom)
│   ├── config/           # App-level configuration (Axios instance, etc.)
│   ├── constants/        # App-wide constants
│   ├── data/             # Static/mock data files
│   ├── hooks/            # Custom React hooks
│   ├── lib/              # Utility libraries (cn helper, etc.)
│   ├── pages/
│   │   ├── admin/        # Admin portal pages
│   │   ├── operator/     # Operator portal pages
│   │   ├── customer/     # Customer portal pages
│   │   └── common/       # Shared pages (Landing, NotFound, etc.)
│   ├── routes/           # React Router route definitions
│   ├── services/         # API service layer (Axios calls)
│   ├── store/            # Redux store, slices, and selectors
│   ├── types/            # TypeScript type/interface definitions
│   ├── utils/            # Helper/utility functions
│   ├── App.tsx           # Root application component
│   └── main.tsx          # Application entry point
├── index.html
├── vite.config.ts
├── tailwind.config.ts
├── tsconfig.json
└── vercel.json           # Vercel deployment config
```

---

## 👥 User Roles & Pages

### 🧑‍💼 Customer
| Page | Description |
|---|---|
| Login / Signup | Authentication with Google OAuth support |
| Dashboard | Overview of activity and stats |
| Request Container | Submit new container requests |
| My Containers | View and manage owned containers |
| Requests Listing | Track all submitted requests |
| Transit Tracking | Real-time container transit status |
| Stuffing & Destuffing | Manage cargo stuffing operations |
| Bills | View and download invoices |
| PDA | Pre-Disbursement Advice management |
| Payment | Pay dues via Razorpay |
| Payment Confirmation | Order confirmation page |
| Profile | Manage account details |

### 🏗️ Operator
| Page | Description |
|---|---|
| Login | Operator authentication |
| Dashboard | Operational overview |
| Cargo Requests | Handle incoming cargo requests |
| Gate Operations | Manage container gate in/out |
| Yard Operations | Yard slot and space management |
| Container Lookup | Search and view container info |
| Stuffing & Destuffing | Manage cargo operations |
| Transit Tracking | Track container movements |
| Vehicles & Equipment | Manage vehicles and equipment |
| Billing | Generate and manage bills |
| PDA View | View Pre-Disbursement Advice |
| Profile | Manage operator profile |

### 🔑 Admin
| Page | Description |
|---|---|
| Login | Admin authentication |
| Dashboard | System-wide overview |
| User Management | Manage customers and operators |
| Container Management | View and manage all containers |
| Container Details | Detailed single container view |
| Gate Operations | Monitor all gate activities |
| Yard Configuration | Configure yard layout and slots |
| Stuffing & Destuffing | Oversee all cargo operations |
| Transit Tracking | Track all container movements |
| Vehicles & Equipment | Fleet management |
| Shipping Line Management | Manage shipping lines |
| Activities & Charges | Configure tariff and charges |
| Reports & Analytics | Revenue, usage, and operational reports |
| Audit Logs | System audit trail |
| Profile | Admin profile settings |

---

## ⚙️ Getting Started

### Prerequisites

- Node.js >= 18
- npm or yarn

### Installation

```bash
# Clone the repository
git clone <your-repo-url>
cd frontend

# Install dependencies
npm install
```

### Environment Variables

Create a `.env` file in the root of the `frontend/` directory:

```env
VITE_API_BASE_URL=http://localhost:5001/api
VITE_GOOGLE_CLIENT_ID=your_google_oauth_client_id
VITE_RAZORPAY_KEY_ID=your_razorpay_key_id
```

### Running the App

```bash
# Development server
npm run dev

# Production build
npm run build

# Preview production build locally
npm run preview

# Lint
npm run lint
```

---

## 🌐 Deployment

This project is configured for deployment on **Vercel**. The `vercel.json` at the root handles SPA routing (all paths redirect to `index.html`).

```json
{
  "rewrites": [{ "source": "/(.*)", "destination": "/index.html" }]
}
```

Push to your GitHub repository and connect it to Vercel for automatic deployments.

---

## 🔗 Backend

This frontend communicates with the **cTrack Backend** (Node.js/Express + MongoDB). See the backend repository for setup instructions.

---

## 📄 License

ISC
