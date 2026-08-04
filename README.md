# Procrutmen
## Enterprise Procurement Management System

**Versi:** 1.1  
**Tanggal:** 4 Agustus 2026  
**Status:** Production Ready  

---

## Daftar Isi

1. [Gambaran Umum](#1-gambaran-umum)
2. [Fitur Utama](#2-fitur-utama)
3. [Tech Stack](#3-tech-stack)
4. [Arsitektur](#4-arsitektur)
5. [Instalasi & Deployment](#5-instalasi--deployment)
6. [Konfigurasi](#6-konfigurasi)
7. [API Endpoints](#7-api-endpoints)
8. [Database Schema](#8-database-schema)
9. [Role-Based Access Control](#9-role-based-access-control)
10. [Testing](#10-testing)
11. [Compliance](#11-compliance)
12. [Security](#12-security)
13. [Troubleshooting](#13-troubleshooting)
14. [Contributing](#14-contributing)
15. [License](#15-license)

---

## 1. Gambaran Umum

**Procrutmen** adalah sistem manajemen pengadaan enterprise yang dirancang untuk mengotomatisasi dan menyederhanakan seluruh siklus pengadaan (procurement) di dalam perusahaan. Sistem ini mencakup manajemen vendor, purchase requisition, purchase order, invoice, three-way matching, analytics dashboard, dan role-based access control.

### Tujuan Bisnis
- Efisiensi biaya pengadaan melalui e-auction dan negosiasi
- Transparansi proses pengadaan
- Kepatuhan terhadap ISO 27001 dan UU PDP
- Visualisasi data untuk pengambilan keputusan strategis
- Pengelolaan hak akses berbasis role

### Target Pengguna
- Super Admin
- Admin
- Manager Procurement
- Staff/Employee
- Director
- Compliance Officer
- Finance/Accounting
- Vendor/Supplier

---

## 2. Fitur Utama

### 2.1 Manajemen Vendor
- Registrasi vendor mandiri dengan dokumen lengkap
- Evaluasi kinerja vendor (quality, timeliness, compliance)
- Sistem rating dan review
- Blacklist/suspension vendor
- Cetak surat pemutusan kontrak (PDF)

### 2.2 Purchase Requisition (PR)
- Pengajuan kebutuhan barang/jasa secara digital
- Upload penawaran vendor (multiple quotes)
- Approval workflow (Manager → Director → Board)
- Validasi budget/plafon bulanan
- Role-based approval authorization

### 2.3 Purchase Order (e-PO)
- Pembuatan e-PO dari PR yang disetujui
- Pengiriman e-PO ke vendor
- Konfirmasi penerimaan PO oleh vendor
- Pelacakan status pengiriman
- Cetak PDF e-PO
- Role-based access (Admin, Manager, Vendor)

### 2.4 Invoice & Pembayaran
- Pencatatan invoice masuk
- Three-Way Matching (PO vs GRN vs Invoice)
- Validasi otomatis amount, quantity, dan GRN
- Cetak bukti pembayaran (PDF)
- Role-based access (Admin, Finance, Manager)

### 2.5 Analytics Dashboard
- **KPI Cards:** Total Penghematan, Efisiensi Waktu Siklus, Total Vendor Aktif, Tingkat Kepatuhan
- **Grafik:** Top 5 Kategori Pengeluaran, Top 5 Vendor by Transaksi
- **Compliance:** Real-time Audit Log Feed, Consent Status
- **Recent Activity:** PR Terbaru, e-PO Terbaru

### 2.6 Compliance & Privacy
- Audit logging immutable (ISO 27001)
- Consent management (UU PDP)
- Privacy notice
- Data retention policy
- Subject rights: data export, profile update, delete request

### 2.7 User Management & RBAC
- 8 role types: SUPER_ADMIN, ADMIN, MANAGER, STAFF, DIRECTOR, COMPLIANCE, FINANCE, VENDOR
- Admin can create, update, delete users
- Force password change on first login
- Role-based menu visibility
- Role-based action buttons

---

## 3. Tech Stack

### Backend
- **Runtime:** Node.js 18
- **Framework:** Express.js 4.18
- **Database:** PostgreSQL 18
- **Session:** express-session + connect-pg-simple
- **Authentication:** Session-based (bcrypt)
- **File Upload:** Multer
- **PDF Generation:** PDFKit
- **QR Code:** qrcode
- **Logging:** Winston

### Frontend
- **HTML5** dengan Vanilla JavaScript
- **CSS:** Custom CSS dengan CSS Variables
- **Charts:** Chart.js v4.4.0 (CDN)
- **Font:** Inter (Google Fonts)

### DevOps
- **Containerization:** Docker & Docker Compose
- **Process Manager:** PM2 (recommended for production)

### Testing
- **Framework:** Jest 29
- **HTTP Testing:** Supertest 7
- **Environment:** cross-env

---

## 4. Arsitektur

### 4.1 High-Level Architecture

```
┌─────────────────────────────────────────────────────────────┐
│                        Load Balancer / Reverse Proxy         │
│                         (Nginx/Apache)                       │
└─────────────────────────────────────────────────────────────┘
                            │
                            ▼
┌─────────────────────────────────────────────────────────────┐
│                        Docker Container                      │
│  ┌─────────────────────────────────────────────────────────┐│
│  │                   Node.js + Express                      ││
│  │  ┌─────────────┐  ┌─────────────┐  ┌─────────────────┐ ││
│  │  │   Routes    │  │ Middleware  │  │   Controllers   │ ││
│  │  │ - Vendor    │  │ - Auth      │  │ - Vendor        │ ││
│  │  │ - PR        │  │ - Audit     │  │ - PR            │ ││
│  │  │ - PO        │  │ - RBAC      │  │ - PO            │ ││
│  │  │ - Invoice   │  │ - Security  │  │ - Invoice       │ ││
│  │  │ - Analytics │  │ - Compliance│  │ - Analytics     │ ││
│  │  └─────────────┘  └─────────────┘  └─────────────────┘ ││
│  │                          │                               ││
│  │  ┌─────────────────────────────────────────────────────┐││
│  │  │                   Services Layer                    │││
│  │  │  - AuditService  - ConsentService  - ReportService │││
│  │  └─────────────────────────────────────────────────────┘││
│  └─────────────────────────────────────────────────────────┘│
└─────────────────────────────────────────────────────────────┘
                            │
                            ▼
┌─────────────────────────────────────────────────────────────┐
│                      PostgreSQL Database                     │
│  ┌─────────────┐  ┌─────────────┐  ┌─────────────────────┐ │
│  │   vendors   │  │ purchase_   │  │   audit_logs        │ │
│  │             │  │ requisitions│  │   (immutable)       │ │
│  ├─────────────┤  ├─────────────┤  ├─────────────────────┤ │
│  │   purchase  │  │   invoices  │  │   user_consents     │ │
│  │   orders    │  │             │  │                     │ │
│  ├─────────────┤  ├─────────────┤  ├─────────────────────┤ │
│  │   three_way │  │   grns      │  │   privacy_notices   │ │
│  │   matches   │  │             │  │                     │ │
│  ├─────────────┤  ├─────────────┤  ├─────────────────────┤ │
│  │   sessions  │  │   users     │  │   data_retention_   │ │
│  │             │  │             │  │   policies          │ │
│  └─────────────┘  └─────────────┘  └─────────────────────┘ │
└─────────────────────────────────────────────────────────────┘
```

### 4.2 Application Layers

| Layer | Technology | Responsibility |
|-------|------------|----------------|
| **Frontend** | HTML5, Vanilla JS, Chart.js | UI, navigation, chart rendering, role-based visibility |
| **API Routes** | Express Router | Endpoint definitions with RBAC guards |
| **Middleware** | Custom Express middleware | Auth, RBAC, audit logging, security headers |
| **Controllers** | Route handlers | Business logic orchestration |
| **Services** | Node.js modules | Reusable business logic |
| **Models** | PostgreSQL queries | Database operations |
| **Database** | PostgreSQL 18 | Data persistence, immutable audit logs |

### 4.3 Data Flow

```
User Request → Nginx → Express → Middleware (Auth/RBAC/Audit)
    → Controller → Service → Model → PostgreSQL
    → Response (JSON/HTML)
```

### 4.4 Container Architecture

```
┌──────────────────────────────────────────────────────────────┐
│  Docker Compose Network: procrutmen-network                  │
│                                                              │
│  ┌──────────────┐         ┌──────────────┐                 │
│  │  postgres    │◄────────│     app      │                 │
│  │  :5433       │         │     :3000    │                 │
│  │              │         │              │                 │
│  │  Volume:     │         │  Build:      │                 │
│  │  postgres_   │         │  Dockerfile  │                 │
│  │  data        │         │              │                 │
│  └──────────────┘         └──────────────┘                 │
│                                                              │
│  Init Scripts:                                              │
│  - 01-schema.sql → Create tables + indexes                  │
│  - 02-seed.sql → Seed data                                  │
│  - 03-seed-users.sql → Seed admin user                      │
└──────────────────────────────────────────────────────────────┘
```

### 4.5 Security Architecture

| Component | Implementation |
|-----------|----------------|
| **Authentication** | Session-based with bcrypt password hashing |
| **Authorization** | Role-based access control (8 roles) |
| **Session Store** | PostgreSQL via connect-pg-simple |
| **Audit Logging** | Middleware auto-captures all CUD + auth events |
| **Immutable Logs** | PostgreSQL trigger prevents UPDATE/DELETE |
| **Security Headers** | HSTS, CSP, X-Frame-Options, X-Content-Type-Options |
| **Data Protection** | JSONB payload tracking for before/after changes |
| **Force Password Change** | `must_change_password` flag on user creation |

### 4.6 RBAC Architecture

| Role | Level | Description |
|------|-------|-------------|
| SUPER_ADMIN | 1 | Full system access, user management |
| ADMIN | 2 | Full operational access, compliance, retention job |
| MANAGER | 3 | Approve PR, manage vendors, create PO |
| STAFF | 5 | Create PR, view status, view analytics |
| DIRECTOR | 4 | Approve high-value PR, executive reports |
| COMPLIANCE | 3 | Audit logs, privacy notices, retention policies |
| FINANCE | 3 | Invoice verification, three-way matching |
| VENDOR | 4 | Own PO, confirm delivery, submit invoice |

---

## 5. Instalasi & Deployment

### 5.1 Prerequisites

- Docker & Docker Compose
- Node.js 18+ (untuk development)
- PostgreSQL 18+ (untuk development lokal)

### 5.2 Install Docker & Docker Compose

#### Windows

1. **Download Docker Desktop**
   - Kunjungi https://www.docker.com/products/docker-desktop/
   - Download installer untuk Windows
   - Jalankan installer dan ikuti petunjuk

2. **Verifikasi Instalasi**
   ```bash
   docker --version
   docker compose version
   ```

3. **Start Docker Desktop**
   - Buka Docker Desktop dari Start Menu
   - Tunggu sampai Docker berjalan (icon Docker di system tray berwarna hijau)

#### macOS

1. **Download Docker Desktop**
   ```bash
   # Homebrew
   brew install --cask docker

   # Atau download manual dari https://www.docker.com/products/docker-desktop/
   ```

2. **Verifikasi**
   ```bash
   docker --version
   docker compose version
   ```

#### Linux (Ubuntu/Debian)

1. **Install Docker Engine**
   ```bash
   # Update package index
   sudo apt update

   # Install dependencies
   sudo apt install -y ca-certificates curl gnupg lsb-release

   # Add Docker GPG key
   sudo mkdir -p /etc/apt/keyrings
   curl -fsSL https://download.docker.com/linux/ubuntu/gpg | sudo gpg --dearmor -o /etc/apt/keyrings/docker.gpg

   # Add Docker repository
   echo "deb [arch=$(dpkg --print-architecture) signed-by=/etc/apt/keyrings/docker.gpg] https://download.docker.com/linux/ubuntu $(lsb_release -cs) stable" | sudo tee /etc/apt/sources.list.d/docker.list > /dev/null

   # Install Docker Engine
   sudo apt update
   sudo apt install -y docker-ce docker-ce-cli containerd.io docker-compose-plugin

   # Add user to docker group
   sudo usermod -aG docker $USER
   ```

2. **Verifikasi**
   ```bash
   docker --version
   docker compose version
   ```

3. **Start Docker Service**
   ```bash
   sudo systemctl start docker
   sudo systemctl enable docker
   ```

### 5.3 Install PostgreSQL

#### Option A: Via Docker (Recommended)

```bash
# Pull PostgreSQL 18 image
docker pull postgres:18-alpine

# Run PostgreSQL container
docker run --name procrutmen-postgres \
  -e POSTGRES_DB=procrutmen \
  -e POSTGRES_USER=procrutmen \
  -e POSTGRES_PASSWORD=procrutmen \
  -p 5433:5432 \
  -v postgres_data:/var/lib/postgresql \
  -d postgres:18-alpine

# Verifikasi PostgreSQL berjalan
docker ps | grep postgres

# Test connection
docker exec -it procrutmen-postgres psql -U procrutmen -d procrutmen
```

#### Option B: Install Lokal (Windows)

1. **Download PostgreSQL**
   - Kunjungi https://www.postgresql.org/download/windows/
   - Download PostgreSQL 18 installer
   - Jalankan installer

2. **Konfigurasi**
   - Set password untuk user `postgres`: `procrutmen`
   - Port: `5432`
   - During installation, pilih pgAdmin 4 (optional)

3. **Verifikasi**
   ```bash
   psql -U postgres -d postgres
   # Password: procrutmen
   ```

#### Option C: Install Lokal (macOS)

```bash
# Homebrew
brew install postgresql@18

# Start service
brew services start postgresql@18

# Create database and user
psql -U postgres -c "CREATE DATABASE procrutmen;"
psql -U postgres -c "CREATE USER procrutmen WITH PASSWORD 'procrutmen';"
psql -U postgres -c "GRANT ALL PRIVILEGES ON DATABASE procrutmen TO procrutmen;"
```

#### Option D: Install Lokal (Linux)

```bash
# Ubuntu/Debian
sudo apt update
sudo apt install -y postgresql-18 postgresql-client-18

# Start service
sudo systemctl start postgresql
sudo systemctl enable postgresql

# Create database and user
sudo -u postgres psql -c "CREATE DATABASE procrutmen;"
sudo -u postgres psql -c "CREATE USER procrutmen WITH PASSWORD 'procrutmen';"
sudo -u postgres psql -c "GRANT ALL PRIVILEGES ON DATABASE procrutmen TO procrutmen;"
```

### 5.4 Quick Start dengan Docker Compose

```bash
# Clone repository
git clone <repository-url>
cd procrutmen

# Start aplikasi (build + up)
docker compose up --build -d

# Verifikasi containers running
docker compose ps

# Check logs
docker compose logs -f app

# Verifikasi aplikasi
curl http://localhost:3000/health
```

**Expected Output:**
```json
{"status":"healthy","timestamp":"2026-08-04T13:08:09.457Z"}
```

### 5.5 Development Setup (Non-Docker)

```bash
# Install dependencies
npm install

# Setup environment
cp .env.example .env
# Edit .env sesuai konfigurasi lokal:
# - DB_HOST=localhost
# - DB_PORT=5433 (atau 5432 jika PostgreSQL lokal)
# - DB_NAME=procrutmen
# - DB_USER=procrutmen
# - DB_PASSWORD=procrutmen

# Jalankan migrasi database
npm run migrate

# Seed data awal (admin user, privacy notice, retention policies)
npm run seed

# Start development server
npm run dev
```

### 5.6 Environment Variables

```env
NODE_ENV=development
PORT=3000
DB_HOST=localhost
DB_PORT=5433
DB_NAME=procrutmen
DB_USER=procrutmen
DB_PASSWORD=procrutmen
DB_POOL_MIN=2
DB_POOL_MAX=10
SESSION_SECRET=your-secret-key-here
SESSION_COOKIE_SECURE=false
ALLOWED_ORIGINS=http://localhost:3000,http://localhost:3001
LOG_LEVEL=info
```

#### Production Environment Variables

Untuk deployment production, pastikan variabel berikut di-set:

| Variable | Required | Description |
|----------|----------|-------------|
| `SESSION_SECRET` | **Yes** | Random string yang kuat untuk session encryption. Jangan gunakan default. |
| `SESSION_COOKIE_SECURE` | **Yes** | Set ke `true` untuk HTTPS only. |
| `ALLOWED_ORIGINS` | **Yes** | Comma-separated list of allowed CORS origins, e.g. `https://app.procrutmen.co.id,https://admin.procrutmen.co.id` |
| `NODE_ENV` | Recommended | Set ke `production` |
| `DB_PASSWORD` | **Yes** | Gunakan password yang kuat, bukan default `procrutmen` |

**Catatan:** Aplikasi akan menolak start jika `SESSION_SECRET` tidak di-set di environment production.

### 5.7 Docker Commands Reference

```bash
# Start containers
docker compose up -d

# Stop containers
docker compose down

# Restart app container
docker compose restart app

# View logs
docker compose logs -f app
docker compose logs -f postgres

# Execute command in container
docker exec -it procrutmen-app-1 sh
docker exec -it procrutmen-postgres-1 psql -U procrutmen -d procrutmen

# Rebuild after code changes
docker compose build app
docker compose up -d app

# Clean up
docker compose down -v  # Hapus volumes juga
```

### 5.8 PostgreSQL Commands Reference

```bash
# Connect to database
docker exec -it procrutmen-postgres-1 psql -U procrutmen -d procrutmen

# Inside psql
\dt                    # List all tables
\d audit_logs          # Describe table
SELECT * FROM users;   # Query users
\q                    # Quit
```

---

## 6. Konfigurasi

### 6.1 Database Configuration

Database connection dikonfigurasi di `src/config/db.js`:
- Connection pooling (min: 2, max: 10)
- SSL opsional untuk production
- Auto-reconnect

### 6.2 Security Headers

Security headers dikonfigurasi di `src/app.js`:
- HSTS (Strict-Transport-Security)
- CSP (Content-Security-Policy)
- X-Frame-Options
- X-Content-Type-Options
- X-XSS-Protection

### 6.3 Session Configuration

- Store: PostgreSQL (connect-pg-simple)
- Cookie: HttpOnly, SameSite=Lax
- Max Age: 24 jam
- Secure: false (development), true (production)

### 6.4 Force Password Change Configuration

- Admin can set `must_change_password=true` when creating users
- Users with `must_change_password=true` must change password on first login
- After password change, flag is automatically set to `false`
- `last_password_change` timestamp is recorded

---

## 7. API Endpoints

### 7.1 Authentication

| Method | Endpoint | Description | Auth |
|--------|----------|-------------|------|
| POST | `/api/auth/login` | Login user | No |
| POST | `/api/auth/logout` | Logout user | Yes |
| GET | `/api/auth/me` | Get current user | Yes |
| POST | `/api/auth/change-password` | Change password | Yes |
| GET | `/api/auth/users` | List all users | Admin, Super Admin |
| POST | `/api/auth/users` | Create new user | Admin, Super Admin |
| PUT | `/api/auth/users/:id` | Update user | Admin, Super Admin |
| DELETE | `/api/auth/users/:id` | Delete user | Admin, Super Admin |

### 7.2 Vendors

| Method | Endpoint | Description | Auth | Roles |
|--------|----------|-------------|------|-------|
| GET | `/api/vendors` | List vendors | Yes | ALL |
| GET | `/api/vendors/:id` | Get vendor detail | Yes | ALL |
| POST | `/api/vendors` | Create vendor (multipart) | Yes | ADMIN, MANAGER, STAFF |
| PUT | `/api/vendors/:id` | Update vendor | Yes | ADMIN, MANAGER |
| DELETE | `/api/vendors/:id` | Delete vendor | Yes | ADMIN, SUPER_ADMIN |
| POST | `/api/vendors/:id/evaluate` | Evaluate vendor | Yes | ADMIN, MANAGER, STAFF |
| POST | `/api/vendors/:id/terminate` | Terminate vendor (PDF) | Yes | ADMIN, MANAGER |
| POST | `/api/vendors/:id/documents` | Add document | Yes | ADMIN, MANAGER |
| POST | `/api/vendors/:id/rate` | Rate vendor | Yes | ALL |

### 7.3 Purchase Requisition

| Method | Endpoint | Description | Auth | Roles |
|--------|----------|-------------|------|-------|
| GET | `/api/pr` | List PRs | Yes | ALL |
| GET | `/api/pr/:id` | Get PR detail | Yes | ALL |
| POST | `/api/pr` | Create PR | Yes | ALL |
| POST | `/api/pr/:id/approve` | Approve PR | Yes | MANAGER, DIRECTOR, ADMIN, SUPER_ADMIN |
| POST | `/api/pr/:id/reject` | Reject PR | Yes | MANAGER, DIRECTOR, ADMIN, SUPER_ADMIN |
| GET | `/api/pr/:id/budget-check` | Check budget cap | Yes | ALL |

### 7.4 Purchase Order

| Method | Endpoint | Description | Auth | Roles |
|--------|----------|-------------|------|-------|
| GET | `/api/po` | List POs | Yes | ALL |
| GET | `/api/po/:id` | Get PO detail | Yes | ALL |
| POST | `/api/po` | Create PO | Yes | ADMIN, SUPER_ADMIN, MANAGER |
| POST | `/api/po/:id/send` | Send PO to vendor | Yes | ADMIN, SUPER_ADMIN, MANAGER |
| POST | `/api/po/:id/confirm` | Confirm PO | Yes | ADMIN, SUPER_ADMIN, MANAGER, VENDOR |
| POST | `/api/po/:id/deliver` | Mark as delivered | Yes | ADMIN, SUPER_ADMIN, MANAGER, VENDOR |
| GET | `/api/po/:id/print` | Print PO (PDF) | Yes | ALL |

### 7.5 Invoice

| Method | Endpoint | Description | Auth | Roles |
|--------|----------|-------------|------|-------|
| POST | `/api/invoices/three-way-match` | Three-way matching | Yes | ADMIN, SUPER_ADMIN, FINANCE, MANAGER |
| POST | `/api/invoices` | Create invoice | Yes | ADMIN, SUPER_ADMIN, FINANCE, MANAGER, VENDOR |
| POST | `/api/invoices/grn` | Create GRN | Yes | ADMIN, SUPER_ADMIN, FINANCE, MANAGER, VENDOR |
| GET | `/api/invoices/history` | List invoices | Yes | ADMIN, SUPER_ADMIN, FINANCE, MANAGER |
| GET | `/api/invoices/metrics` | Invoice metrics | Yes | ADMIN, SUPER_ADMIN, FINANCE, MANAGER |
| GET | `/api/invoices/:id/payment-voucher` | Print payment voucher (PDF) | Yes | ADMIN, SUPER_ADMIN, FINANCE, MANAGER |

### 7.6 Analytics

| Method | Endpoint | Description | Auth | Roles |
|--------|----------|-------------|------|-------|
| GET | `/api/analytics/kpi` | KPI metrics | Yes | ADMIN, MANAGER, DIRECTOR, STAFF, COMPLIANCE, FINANCE |
| GET | `/api/analytics/spend-by-category` | Top 5 categories | Yes | ADMIN, MANAGER, DIRECTOR, STAFF, COMPLIANCE, FINANCE |
| GET | `/api/analytics/top-vendors` | Top 5 vendors | Yes | ADMIN, MANAGER, DIRECTOR, STAFF, COMPLIANCE, FINANCE |
| GET | `/api/analytics/recent-audit` | Recent audit logs | Yes | ADMIN, MANAGER, COMPLIANCE |
| GET | `/api/analytics/consent-status` | Consent status | Yes | ADMIN, MANAGER, COMPLIANCE |

### 7.7 Compliance

| Method | Endpoint | Description | Auth |
|--------|----------|-------------|------|
| GET | `/api/compliance/privacy-notice` | Get privacy notice | Yes |
| POST | `/api/compliance/consent` | Record consent | Yes |
| GET | `/api/compliance/consent` | Get user consents | Yes |
| POST | `/api/compliance/consent/withdraw` | Withdraw consent | Yes |
| GET | `/api/compliance/my-data` | Export personal data | Yes |
| PUT | `/api/compliance/update-profile` | Update profile | Yes |
| POST | `/api/compliance/delete-request` | Request deletion | Yes |
| GET | `/api/compliance/data-retention` | Get retention policies | Yes |
| POST | `/api/compliance/retention/run` | Run retention job | Admin |

---

## 8. Database Schema

### 8.1 Core Tables

#### users
```sql
CREATE TABLE users (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    username VARCHAR(100) NOT NULL UNIQUE,
    password_hash VARCHAR(255) NOT NULL,
    role VARCHAR(50) DEFAULT 'STAFF' CHECK (role IN ('SUPER_ADMIN', 'ADMIN', 'MANAGER', 'STAFF', 'DIRECTOR', 'COMPLIANCE', 'FINANCE', 'VENDOR')),
    email VARCHAR(255),
    must_change_password BOOLEAN DEFAULT FALSE,
    last_password_change TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

#### vendors
```sql
CREATE TABLE vendors (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name VARCHAR(255) NOT NULL,
    email VARCHAR(255) NOT NULL UNIQUE,
    phone VARCHAR(50) NOT NULL,
    address TEXT NOT NULL,
    status VARCHAR(50) DEFAULT 'PENDING' CHECK (status IN ('PENDING', 'ACTIVE', 'SUSPENDED', 'BLACKLISTED')),
    rating DECIMAL(3,2) DEFAULT 0,
    category VARCHAR(100),
    pic VARCHAR(255),
    npwp VARCHAR(100),
    nib VARCHAR(100),
    tax_status VARCHAR(50),
    bank_name VARCHAR(255),
    bank_account VARCHAR(100),
    bank_owner VARCHAR(255),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

#### purchase_requisitions
```sql
CREATE TABLE purchase_requisitions (
    id VARCHAR(50) PRIMARY KEY,
    business_unit VARCHAR(100) NOT NULL,
    items JSONB NOT NULL,
    total_amount DECIMAL(15,2) NOT NULL CHECK (total_amount >= 0),
    budget_code VARCHAR(100) NOT NULL,
    requested_by VARCHAR(255) NOT NULL,
    status VARCHAR(50) DEFAULT 'PENDING' CHECK (status IN ('PENDING', 'APPROVED', 'REJECTED', 'CANCELLED')),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

#### purchase_orders
```sql
CREATE TABLE purchase_orders (
    id VARCHAR(50) PRIMARY KEY,
    pr_id VARCHAR(50) REFERENCES purchase_requisitions(id),
    vendor_id UUID REFERENCES vendors(id),
    vendor_name VARCHAR(255),
    total_amount DECIMAL(15,2) NOT NULL,
    budget_type VARCHAR(50),
    status VARCHAR(50) DEFAULT 'DRAFT',
    delivery_deadline DATE,
    sent_at TIMESTAMP,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

#### invoices
```sql
CREATE TABLE invoices (
    id VARCHAR(50) PRIMARY KEY,
    invoice_number VARCHAR(100) UNIQUE NOT NULL,
    po_id VARCHAR(50) REFERENCES purchase_orders(id),
    vendor_id UUID REFERENCES vendors(id),
    vendor_name VARCHAR(255),
    amount DECIMAL(15,2) NOT NULL,
    due_date DATE,
    status VARCHAR(50) DEFAULT 'PENDING',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

#### grns
```sql
CREATE TABLE grns (
    id VARCHAR(50) PRIMARY KEY,
    po_id VARCHAR(50) REFERENCES purchase_orders(id),
    received_by VARCHAR(255),
    notes TEXT,
    received_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

#### three_way_matches
```sql
CREATE TABLE three_way_matches (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    po_id VARCHAR(50) REFERENCES purchase_orders(id),
    grn_id VARCHAR(50) REFERENCES grns(id),
    invoice_id VARCHAR(50) REFERENCES invoices(id),
    amount_match BOOLEAN,
    quantity_match BOOLEAN,
    grn_match BOOLEAN,
    status VARCHAR(50) DEFAULT 'PENDING',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

### 8.2 Compliance Tables

#### audit_logs
```sql
CREATE TABLE audit_logs (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    actor_id UUID,
    actor_username VARCHAR(255),
    actor_role VARCHAR(50),
    action VARCHAR(100) NOT NULL,
    resource_type VARCHAR(100),
    resource_id VARCHAR(255),
    description TEXT,
    ip_address VARCHAR(45),
    user_agent TEXT,
    payload_before JSONB,
    payload_after JSONB,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Immutable trigger
CREATE TRIGGER audit_logs_protect
    BEFORE UPDATE OR DELETE ON audit_logs
    FOR EACH ROW
    EXECUTE FUNCTION prevent_audit_modification();
```

#### user_consents
```sql
CREATE TABLE user_consents (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID,
    consent_type VARCHAR(100) NOT NULL,
    consent_given BOOLEAN NOT NULL DEFAULT FALSE,
    consent_text TEXT,
    ip_address VARCHAR(45),
    user_agent TEXT,
    consent_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    withdrawn_at TIMESTAMP
);
```

#### privacy_notices
```sql
CREATE TABLE privacy_notices (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    version VARCHAR(50) NOT NULL,
    title VARCHAR(255) NOT NULL,
    content TEXT NOT NULL,
    effective_date TIMESTAMP NOT NULL,
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

#### data_retention_policies
```sql
CREATE TABLE data_retention_policies (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    data_type VARCHAR(100) NOT NULL,
    retention_period_days INTEGER NOT NULL,
    description TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

#### data_deletion_logs
```sql
CREATE TABLE data_deletion_logs (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    data_type VARCHAR(100) NOT NULL,
    resource_id VARCHAR(255) NOT NULL,
    deletion_reason VARCHAR(255) NOT NULL,
    deleted_by UUID,
    deleted_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

---

## 9. Role-Based Access Control (RBAC)

### 9.1 Role Definitions

| Role | Code | Description |
|------|------|-------------|
| Super Admin | `SUPER_ADMIN` | Full system access, user management, system config |
| Admin | `ADMIN` | Full operational access, compliance, retention job |
| Manager | `MANAGER` | Approve PR, manage vendors, create PO, view analytics |
| Staff | `STAFF` | Create PR, draft PR, view status, view analytics |
| Director | `DIRECTOR` | Approve high-value PR, view executive reports |
| Compliance | `COMPLIANCE` | Audit logs, privacy notices, data retention policies |
| Finance | `FINANCE` | Invoice verification, three-way matching, payment voucher |
| Vendor | `VENDOR` | Own PO, confirm delivery, submit invoice |

### 9.2 Permission Matrix

| Module | Action | SUPER_ADMIN | ADMIN | MANAGER | STAFF | DIRECTOR | COMPLIANCE | FINANCE | VENDOR |
|--------|--------|:-----------:|:-----:|:-------:|:-----:|:--------:|:----------:|:-------:|:------:|
| **Dashboard** | View | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | ❌ |
| **Vendor** | List | ✅ | ✅ | ✅ | ✅ | ✅ | ❌ | ❌ | ❌ |
| **Vendor** | Create | ✅ | ✅ | ✅ | ✅ | ❌ | ❌ | ❌ | ❌ |
| **Vendor** | Update | ✅ | ✅ | ✅ | ❌ | ❌ | ❌ | ❌ | ❌ |
| **Vendor** | Delete | ✅ | ✅ | ❌ | ❌ | ❌ | ❌ | ❌ | ❌ |
| **Vendor** | Evaluate | ✅ | ✅ | ✅ | ✅ | ❌ | ❌ | ❌ | ❌ |
| **Vendor** | Terminate | ✅ | ✅ | ❌ | ❌ | ❌ | ❌ | ❌ | ❌ |
| **PR** | Create | ✅ | ✅ | ✅ | ✅ | ❌ | ❌ | ❌ | ❌ |
| **PR** | Approve | ✅ | ✅ | ✅ | ❌ | ✅ | ❌ | ❌ | ❌ |
| **PR** | Reject | ✅ | ✅ | ✅ | ❌ | ✅ | ❌ | ❌ | ❌ |
| **PO** | Create | ✅ | ✅ | ✅ | ❌ | ❌ | ❌ | ❌ | ❌ |
| **PO** | Send | ✅ | ✅ | ✅ | ❌ | ❌ | ❌ | ❌ | ❌ |
| **PO** | Confirm | ✅ | ✅ | ✅ | ❌ | ❌ | ❌ | ❌ | ✅ |
| **PO** | Deliver | ✅ | ✅ | ✅ | ❌ | ❌ | ❌ | ❌ | ✅ |
| **PO** | Print | ✅ | ✅ | ✅ | ✅ | ✅ | ❌ | ❌ | ✅ |
| **Invoice** | Create | ✅ | ✅ | ✅ | ❌ | ❌ | ❌ | ✅ | ✅ |
| **Invoice** | Three-Way Match | ✅ | ✅ | ✅ | ❌ | ❌ | ❌ | ✅ | ❌ |
| **Invoice** | History | ✅ | ✅ | ✅ | ❌ | ❌ | ❌ | ✅ | ❌ |
| **Invoice** | Payment Voucher | ✅ | ✅ | ✅ | ❌ | ❌ | ❌ | ✅ | ❌ |
| **Analytics** | KPI | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | ❌ |
| **Analytics** | Spend Category | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | ❌ |
| **Analytics** | Top Vendors | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | ❌ |
| **Analytics** | Audit Logs | ✅ | ✅ | ✅ | ❌ | ❌ | ✅ | ❌ | ❌ |
| **Analytics** | Consent Status | ✅ | ✅ | ✅ | ❌ | ❌ | ✅ | ❌ | ❌ |
| **Compliance** | Privacy Notice | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ |
| **Compliance** | Consent | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ |
| **Compliance** | My Data | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ |
| **Compliance** | Update Profile | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ |
| **Compliance** | Delete Request | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ |
| **Compliance** | Data Retention | ✅ | ✅ | ❌ | ❌ | ❌ | ✅ | ❌ | ❌ |
| **Compliance** | Run Retention | ✅ | ❌ | ❌ | ❌ | ❌ | ❌ | ❌ | ❌ |
| **User Management** | Create User | ✅ | ✅ | ❌ | ❌ | ❌ | ❌ | ❌ | ❌ |
| **User Management** | Update User | ✅ | ✅ | ❌ | ❌ | ❌ | ❌ | ❌ | ❌ |
| **User Management** | Delete User | ✅ | ✅ | ❌ | ❌ | ❌ | ❌ | ❌ | ❌ |

### 9.3 Force Password Change

| Feature | Description |
|---------|-------------|
| **On User Creation** | Admin creates user with `must_change_password=true` |
| **First Login** | User must change password before accessing dashboard |
| **After Change** | `must_change_password` automatically set to `false` |
| **Subsequent Logins** | Normal login without forced password change |
| **Frontend** | Login page shows change password form when required |
| **Backend** | `/api/auth/change-password` endpoint handles password update |

---

## 10. Testing

### 10.1 Run All Tests

```bash
npm test
```

### 10.2 Run Specific Test

```bash
npm test -- tests/vendor.integration.test.js
npm test -- tests/reports.analytics.poc.test.js
```

### 10.3 Test Coverage

- Vendor integration tests (create, evaluate, terminate, delete)
- Reports & Analytics PoC tests (14 test cases)
- Compliance endpoints tests
- Authentication flow tests
- Force password change flow tests

### 10.4 Test Environment

- `NODE_ENV=test`
- Auto-auth as admin untuk simplify testing
- Database: PostgreSQL dengan test data

### 10.5 RBAC Test Scripts

```powershell
# Test user creation and force password change
powershell -ExecutionPolicy Bypass -File test-rbac.ps1

# Test forced password change flow
powershell -ExecutionPolicy Bypass -File test-force-password.ps1

# Test normal login after password change
powershell -ExecutionPolicy Bypass -File test-normal-login.ps1
```

---

## 11. Compliance

### 11.1 ISO 27001

| Control | Implementation | Status |
|---------|----------------|--------|
| A.12.4.1 | Audit trail untuk semua aksi penting | ✅ |
| A.12.4.2 | Audit logs immutable via trigger | ✅ |
| A.12.6.1 | Security headers (HSTS, CSP, X-Frame-Options) | ✅ |
| A.14.1.2 | Security hardening di semua response | ✅ |

### 11.2 UU PDP No. 27 Tahun 2022

| Pasal | Requirement | Implementation | Status |
|-------|-------------|----------------|--------|
| 12 | Explicit consent | `user_consents` table + API | ✅ |
| 15 | Data access right | `GET /api/v1/privacy/my-data` | ✅ |
| 16 | Data correction right | `PUT /api/v1/privacy/update-profile` | ✅ |
| 17 | Data deletion right | `POST /api/v1/privacy/delete-request` | ✅ |
| 21 | Privacy notice | `privacy_notices` table + API | ✅ |
| 30 | Data retention policy | `data_retention_policies` + job | ✅ |

### 11.3 Compliance Documentation

- **ISO 27001 & UU PDP PoC:** `POC_COMPLIANCE.md`
- **Reports & Analytics PoC:** `POC_REPORTS_ANALYTICS.md`
- **RBAC Documentation:** `RBAC.md`

---

## 12. Security

### 12.1 Authentication & Authorization
- Session-based authentication
- Password hashing dengan bcrypt
- Role-based access control (8 roles)
- Session stored di PostgreSQL (connect-pg-simple)
- Force password change on first login
- `must_change_password` flag enforcement

### 12.2 Security Headers
- HSTS: Enforce HTTPS
- CSP: Prevent XSS attacks
- X-Frame-Options: Prevent clickjacking
- X-Content-Type-Options: Prevent MIME sniffing
- X-XSS-Protection: Enable browser XSS filter

### 12.3 Audit Logging
- Semua aksi penting tercatat di `audit_logs`
- Immutable via database trigger
- Includes: actor, action, resource, IP, user agent, payload before/after

### 12.4 Data Protection
- Sensitive data di-hash (password)
- Audit logs tidak bisa diubah/dihapus
- Consent management untuk data processing
- Data retention policies

### 12.5 Best Practices
- Jangan commit secrets ke repository
- Ganti `SESSION_SECRET` di production
- Gunakan HTTPS di production
- Backup audit logs secara terpisah
- Monitor failed login attempts
- Force password change for new users

---

## 13. Troubleshooting

### 13.1 Container tidak start
```bash
# Check logs
docker compose logs app

# Restart
docker compose restart app
```

### 13.2 Database connection error
```bash
# Check PostgreSQL running
docker compose ps postgres

# Check logs
docker compose logs postgres
```

### 13.3 Audit log error: column "payload_before" does not exist
```bash
# Run migration
node src/db/migrate-audit-payload.js
```

### 13.4 User schema error: must_change_password column missing
```bash
# Run migration
node src/db/migrate-users.js
```

### 13.5 Chart.js tidak muncul
- Hard refresh browser (`Ctrl + Shift + R`)
- Check CSP header mengizinkan `https://cdn.jsdelivr.net`
- Check browser console untuk error

### 13.6 Force password change tidak muncul
- Pastikan user memiliki `must_change_password=true` di database
- Clear browser cookies dan login ulang
- Check browser console untuk error JavaScript

### 13.7 Session expired
- Login kembali di `/login`
- Session berlaku 24 jam

---

## 14. Contributing

### 14.1 Development Workflow

1. Fork repository
2. Create feature branch (`git checkout -b feature/amazing-feature`)
3. Commit changes (`git commit -m 'Add amazing feature'`)
4. Push to branch (`git push origin feature/amazing-feature`)
5. Open Pull Request

### 14.2 Code Standards
- Gunakan ES6+ syntax
- Follow existing code style
- Write tests untuk fitur baru
- Update dokumentasi jika diperlukan

---

## 15. License

ISC License

---

## Kontak

**Developer:** Muhammad Arif Pratama  
**Email:** [arifpratama5@gmail.com](mailto:arifpratama5@gmail.com)  
**Tanggal:** 4 Agustus 2026

---

## Changelog

### v1.1 (4 Agustus 2026)
- Implemented RBAC with 8 roles
- Added force password change on first login
- Added user management endpoints (create/update/delete)
- Updated analytics endpoints with role-based access
- Updated vendor, PO, invoice, and PR routes with RBAC
- Added must_change_password and last_password_change columns
- Updated frontend with role-based UI visibility
- Updated README with RBAC documentation

### v1.0 (4 Agustus 2026)
- Initial release
- Vendor management
- Purchase Requisition & PO
- Invoice & Three-Way Matching
- Analytics Dashboard
- Compliance (ISO 27001 & UU PDP)
- Docker deployment
- PoC test cases
