# 📇 ContactHub — Full Stack Contact Management System

A production-grade, responsive full-stack Contact Management System organized into dedicated, modular folders for **Frontend (`client`)**, **Backend (`server`)**, and **Database (`database`)**.

---

## 📁 Project Architecture & Folder Structure

```text
contact-management-system/
│
├── 📂 client/                   # Frontend Web Application (React 18 + Vite + Tailwind CSS)
│   ├── src/
│   │   ├── components/          # Reusable UI components
│   │   │   ├── Navbar.jsx               # Header with global actions & DB status badge
│   │   │   ├── StatsOverview.jsx        # Interactive counter cards for quick filtering
│   │   │   ├── SearchAndFilters.jsx     # Live search, category pills, sort dropdown, grid/table view toggle
│   │   │   ├── ContactCard.jsx          # Polished contact cards with quick actions
│   │   │   ├── ContactTableView.jsx     # Dense list/table view mode
│   │   │   ├── ContactFormModal.jsx     # Add & Edit modal with validation & avatar color palette
│   │   │   ├── ContactDetailsModal.jsx  # Detailed contact view with phone/email shortcuts & timestamps
│   │   │   ├── DeleteConfirmModal.jsx   # Safe deletion confirmation modal
│   │   │   ├── ImportModal.jsx          # Bulk JSON import with sample payload
│   │   │   └── Toast.jsx                # Non-blocking animated feedback notifications
│   │   ├── services/
│   │   │   └── api.js                   # Unified fetch API service
│   │   ├── App.jsx                      # Primary state orchestration
│   │   ├── main.jsx                     # Entry mounting script
│   │   └── index.css                    # Tailwind directives & aesthetic styling
│   ├── index.html                       # HTML template with Google Plus Jakarta Sans font
│   ├── tailwind.config.js               # Tailwind design system configuration
│   ├── vite.config.js                   # Vite config with API proxy to port 5000
│   └── package.json                     # Client dependencies & scripts
│
├── 📂 server/                   # Backend REST API Service (Node.js + Express)
│   ├── src/
│   │   ├── controllers/
│   │   │   └── contactController.js     # Contact CRUD, stats, CSV export, bulk import logic
│   │   ├── routes/
│   │   │   └── contactRoutes.js         # Express routing definitions
│   │   ├── middleware/
│   │   │   └── errorHandler.js          # Centralized error handler & 404 middleware
│   │   ├── config.js                    # Environment & server config
│   │   └── server.js                    # Express app bootstrap & route registration
│   ├── .env.example                     # Environment template
│   └── package.json                     # Server dependencies & scripts
│
├── 📂 database/                 # Dedicated SQLite Database & Persistence Layer
│   ├── schema.sql                       # DDL table creation, indices, and updated_at triggers
│   ├── seed.sql                         # Pre-loaded realistic sample contacts across categories
│   ├── db.js                            # Data Access Layer using Node.js DatabaseSync (node:sqlite)
│   ├── contacts.db                      # SQLite database file (WAL mode enabled)
│   ├── package.json                     # Database package config
│   └── README.md                        # Database schema reference & documentation
│
├── dev.js                       # Cross-platform concurrent runner for client + server
├── start.bat                    # Double-click launcher for Windows
├── package.json                 # Root workflow commands
└── README.md                    # Main documentation
```

---

## ⚡ Tech Stack

| Layer | Technologies |
|---|---|
| **Frontend** | React 18, Vite 6, Tailwind CSS, Lucide React Icons |
| **Backend** | Node.js (v24), Express 4, CORS, Dotenv |
| **Database** | SQLite 3 (using Node's native `node:sqlite` `DatabaseSync`), WAL journaling, full indexes |

---

## ✨ Features

- 👤 **Full CRUD Operations**:
  - **Create**: Add new contacts with first name, last name, phone, email, category, company, role, address, notes, avatar color, and favorite flag.
  - **Read**: View contacts in customizable **Grid Card View** or dense **Table View**.
  - **Update**: Edit any existing contact with live form validation.
  - **Delete**: Safe delete workflow with dedicated confirmation dialog.
- 🔍 **Live Search & Filtering**:
  - Instant search across first name, last name, phone, email, and company.
  - Category filters: `All`, `Work`, `Family`, `Friends`, `Personal`, `Other`.
  - One-click **Starred / Favorites** filter.
- 🗂️ **Sorting**:
  - Sort by Name (A → Z or Z → A), Recently Added, or Company (A → Z).
- 📊 **Interactive Analytics Dashboard**:
  - Real-time count of Total Contacts, Starred Favorites, Work, Family, and Friends.
  - Click on any stat badge to immediately filter the view.
- 📥 **Export & Import**:
  - **Export to CSV**: Download standard CSV file with one click (`/api/contacts/export/csv`).
  - **Import JSON**: Upload `.json` file or paste JSON array with sample format preview.
- 📞 **One-Click Communication**:
  - Native `tel:` and `mailto:` links directly from contact cards and details modal.
- 🎨 **Modern Design**:
  - Designed with Tailwind CSS, clean typography (Plus Jakarta Sans), smooth modal animations, and intuitive responsive layout.

---

## 🚀 Quick Start Guide

### 1. Requirements
- Node.js (v20+ recommended, v24 tested)
- npm (v9+)

### 2. Run Both Frontend and Backend Concurrently

From the root directory (`contact-management-system`):

```bash
# If running for the first time, install dependencies:
npm run install:all

# Start both backend and frontend together:
npm run dev
```

Or on Windows, simply double-click:
```cmd
start.bat
```

- **Frontend Application**: `http://localhost:3000`
- **Backend REST API**: `http://localhost:5000`
- **Database File**: `database/contacts.db`

---

## 📡 REST API Reference

| Method | Endpoint | Description |
|---|---|---|
| `GET` | `/api/health` | Health check and server status |
| `GET` | `/api/contacts` | Get contacts with optional `search`, `category`, `favorite`, `sortBy`, `sortOrder` |
| `GET` | `/api/contacts/stats` | Get contact aggregate metrics (total, favorites, categories) |
| `GET` | `/api/contacts/:id` | Get single contact by ID |
| `POST` | `/api/contacts` | Create a new contact |
| `PUT` | `/api/contacts/:id` | Update an existing contact |
| `PATCH` | `/api/contacts/:id/favorite` | Toggle contact favorite status |
| `DELETE` | `/api/contacts/:id` | Delete contact by ID |
| `POST` | `/api/contacts/bulk-import` | Bulk insert contacts from JSON array |
| `GET` | `/api/contacts/export/csv` | Download contacts as CSV file |

---

## 🗄️ Database Details

The database is completely self-contained in the `database/` folder:
- Database engine: SQLite (WAL mode, normal synchronous for high throughput)
- Auto-seeding: Automatically runs `schema.sql` and `seed.sql` on first start if the database is new or empty.
- Indexes:
  - `idx_contacts_name`: `(first_name, last_name)`
  - `idx_contacts_category`: `(category)`
  - `idx_contacts_favorite`: `(is_favorite)`
  - `idx_contacts_email`: `(email)`
  - `idx_contacts_phone`: `(phone)`
- Automatic updated_at trigger: `trigger_contacts_updated_at` updates the `updated_at` column whenever a contact is modified.
