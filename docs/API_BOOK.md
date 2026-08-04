# API Book - Procrutmen
## Enterprise Procurement Management System

**Versi:** 1.1  
**Tanggal:** 4 Agustus 2026  
**Status:** Production Ready  

**Base URL:** `http://localhost:3000`  
**Format:** JSON  
**Authentication:** Session-based (Cookie)

---

## Daftar Isi

1. [Pendahuluan](#1-pendahuluan)
2. [Authentication](#2-authentication)
3. [Vendors](#3-vendors)
4. [Purchase Requisition](#4-purchase-requisition)
5. [Purchase Order](#5-purchase-order)
6. [Invoice](#6-invoice)
7. [Analytics](#7-analytics)
8. [Compliance](#8-compliance)
9. [User Management](#9-user-management)
10. [Error Codes](#10-error-codes)
11. [Rate Limiting](#11-rate-limiting)

---

## 1. Pendahuluan

### 1.1 Tentang API

API Procrutmen menggunakan arsitektur RESTful dengan session-based authentication. Semua request dan response menggunakan format JSON.

### 1.2 Base URL

```
http://localhost:3000
```

### 1.3 Headers

Semua request yang memerlukan autentikasi harus menyertakan cookie session yang diterima dari login.

```
Content-Type: application/json
```

### 1.4 Role-Based Access

| Role | Deskripsi |
|------|-----------|
| SUPER_ADMIN | Full system access |
| ADMIN | Full operational access |
| MANAGER | Approve PR, manage vendors, create PO |
| STAFF | Create PR, view status, view analytics |
| DIRECTOR | Approve high-value PR, executive reports |
| COMPLIANCE | Audit logs, privacy notices |
| FINANCE | Invoice verification, three-way matching |
| VENDOR | Own PO, confirm delivery, submit invoice |

---

## 2. Authentication

### 2.1 Login

**Endpoint:** `POST /api/auth/login`

**Request Body:**
```json
{
  "username": "admin",
  "password": "admin123"
}
```

**Response Success (200):**
```json
{
  "message": "Login berhasil"
}
```

**Response Error (401):**
```json
{
  "message": "Username atau password salah"
}
```

### 2.2 Logout

**Endpoint:** `POST /api/auth/logout`

**Auth Required:** Yes (All roles)

**Response Success (200):**
```json
{
  "message": "Logout berhasil"
}
```

### 2.3 Get Current User

**Endpoint:** `GET /api/auth/me`

**Auth Required:** Yes (All roles)

**Response Success (200):**
```json
{
  "id": "uuid",
  "username": "admin",
  "role": "SUPER_ADMIN",
  "email": "admin@procrutmen.co.id",
  "must_change_password": false
}
```

### 2.4 Change Password

**Endpoint:** `POST /api/auth/change-password`

**Auth Required:** Yes (All roles)

**Request Body:**
```json
{
  "current_password": "oldpass123",
  "new_password": "newpass123",
  "confirm_password": "newpass123"
}
```

**Response Success (200):**
```json
{
  "message": "Password berhasil diubah"
}
```

**Response Error (400):**
```json
{
  "message": "Password konfirmasi tidak cocok"
}
```

---

## 3. Vendors

### 3.1 List Vendors

**Endpoint:** `GET /api/vendors`

**Auth Required:** Yes (All roles)

**Query Parameters:**
| Parameter | Type | Description |
|-----------|------|-------------|
| `search` | string | Cari berdasarkan nama |
| `status` | string | Filter by status (PENDING, ACTIVE, SUSPENDED, BLACKLISTED) |
| `category` | string | Filter by category |

**Response Success (200):**
```json
[
  {
    "id": "uuid",
    "name": "PT. Vendor Indonesia",
    "email": "vendor@example.com",
    "phone": "081234567890",
    "address": "Jakarta, Indonesia",
    "status": "ACTIVE",
    "rating": 4.5,
    "category": "IT Equipment",
    "created_at": "2026-08-01T00:00:00.000Z"
  }
]
```

### 3.2 Get Vendor Detail

**Endpoint:** `GET /api/vendors/:id`

**Auth Required:** Yes (All roles)

**Response Success (200):**
```json
{
  "id": "uuid",
  "name": "PT. Vendor Indonesia",
  "email": "vendor@example.com",
  "phone": "081234567890",
  "address": "Jakarta, Indonesia",
  "status": "ACTIVE",
  "rating": 4.5,
  "category": "IT Equipment",
  "npwp": "123456789012345",
  "nib": "987654321",
  "tax_status": "Badan",
  "bank_name": "BCA",
  "bank_account": "1234567890",
  "bank_owner": "PT. Vendor Indonesia",
  "created_at": "2026-08-01T00:00:00.000Z",
  "updated_at": "2026-08-01T00:00:00.000Z",
  "evaluations": [...],
  "service_history": [...]
}
```

### 3.3 Create Vendor

**Endpoint:** `POST /api/vendors`

**Auth Required:** Yes (ADMIN, MANAGER, STAFF)

**Content-Type:** `multipart/form-data`

**Request Body (Form Data):**
| Field | Type | Required | Description |
|-------|------|----------|-------------|
| `name` | string | Yes | Nama vendor |
| `email` | string | Yes | Email vendor |
| `phone` | string | Yes | Nomor telepon |
| `address` | string | Yes | Alamat lengkap |
| `npwp` | string | Yes | NPWP vendor |
| `nib` | string | No | NIB vendor |
| `tax_status` | string | Yes | Status pajak (Badan/OP) |
| `category` | string | Yes | Kategori vendor |
| `bank_name` | string | Yes | Nama bank |
| `bank_account` | string | Yes | Nomor rekening |
| `bank_owner` | string | Yes | Atas nama rekening |
| `documents` | file[] | No | Dokumen pendukung |

**Response Success (201):**
```json
{
  "id": "uuid",
  "name": "PT. Vendor Indonesia",
  "email": "vendor@example.com",
  "phone": "081234567890",
  "address": "Jakarta, Indonesia",
  "status": "PENDING",
  "category": "IT Equipment",
  "created_at": "2026-08-01T00:00:00.000Z"
}
```

### 3.4 Update Vendor

**Endpoint:** `PUT /api/vendors/:id`

**Auth Required:** Yes (ADMIN, MANAGER)

**Request Body:**
```json
{
  "name": "PT. Vendor Indonesia Baru",
  "email": "newemail@example.com",
  "phone": "089876543210",
  "address": "Bandung, Indonesia",
  "status": "ACTIVE",
  "category": "IT Equipment",
  "bank_name": "Mandiri",
  "bank_account": "0987654321",
  "bank_owner": "PT. Vendor Indonesia Baru"
}
```

**Response Success (200):**
```json
{
  "id": "uuid",
  "name": "PT. Vendor Indonesia Baru",
  "email": "newemail@example.com",
  "phone": "089876543210",
  "address": "Bandung, Indonesia",
  "status": "ACTIVE",
  "category": "IT Equipment",
  "updated_at": "2026-08-04T00:00:00.000Z"
}
```

### 3.5 Delete Vendor

**Endpoint:** `DELETE /api/vendors/:id`

**Auth Required:** Yes (ADMIN, SUPER_ADMIN)

**Response Success (200):**
```json
{
  "message": "Vendor berhasil dihapus"
}
```

### 3.6 Evaluate Vendor

**Endpoint:** `POST /api/vendors/:id/evaluate`

**Auth Required:** Yes (ADMIN, MANAGER, STAFF)

**Request Body:**
```json
{
  "quality": 4,
  "timeliness": 5,
  "compliance": 4,
  "notes": "Vendor bagus, pengiriman tepat waktu"
}
```

**Response Success (200):**
```json
{
  "id": "uuid",
  "vendor_id": "uuid",
  "quality": 4,
  "timeliness": 5,
  "compliance": 4,
  "notes": "Vendor bagus, pengiriman tepat waktu",
  "evaluated_by": "admin",
  "evaluated_at": "2026-08-04T00:00:00.000Z"
}
```

### 3.7 Terminate Vendor

**Endpoint:** `POST /api/vendors/:id/terminate`

**Auth Required:** Yes (ADMIN, MANAGER)

**Request Body:**
```json
{
  "reason": "Vendor melanggar kontrak"
}
```

**Response Success (200):**
```json
{
  "id": "uuid",
  "name": "PT. Vendor Indonesia",
  "status": "BLACKLISTED",
  "terminated_by": "admin",
  "terminated_at": "2026-08-04T00:00:00.000Z",
  "pdf_url": "/api/vendors/uuid/termination-pdf"
}
```

### 3.8 Add Document

**Endpoint:** `POST /api/vendors/:id/documents`

**Auth Required:** Yes (ADMIN, MANAGER)

**Content-Type:** `multipart/form-data`

**Request Body (Form Data):**
| Field | Type | Required | Description |
|-------|------|----------|-------------|
| `document` | file | Yes | File dokumen |
| `type` | string | Yes | Tipe dokumen (NPWP, NIB, SIUP, dll) |

**Response Success (201):**
```json
{
  "id": "uuid",
  "vendor_id": "uuid",
  "type": "NPWP",
  "file_url": "/uploads/vendors/uuid/npwp.pdf",
  "uploaded_at": "2026-08-04T00:00:00.000Z"
}
```

### 3.9 Rate Vendor

**Endpoint:** `POST /api/vendors/:id/rate`

**Auth Required:** Yes (All roles)

**Request Body:**
```json
{
  "rating": 5,
  "comment": "Pelayanan sangat baik"
}
```

**Response Success (200):**
```json
{
  "id": "uuid",
  "vendor_id": "uuid",
  "rating": 5,
  "comment": "Pelayanan sangat baik",
  "rated_by": "staff1",
  "rated_at": "2026-08-04T00:00:00.000Z"
}
```

---

## 4. Purchase Requisition

### 4.1 List PRs

**Endpoint:** `GET /api/pr`

**Auth Required:** Yes (All roles)

**Query Parameters:**
| Parameter | Type | Description |
|-----------|------|-------------|
| `status` | string | Filter by status (PENDING, APPROVED, REJECTED, CANCELLED) |
| `requested_by` | string | Filter by requester |
| `start_date` | date | Filter from date |
| `end_date` | date | Filter to date |

**Response Success (200):**
```json
[
  {
    "id": "PR-001",
    "business_unit": "IT",
    "items": [
      {
        "name": "Laptop Dell XPS",
        "quantity": 5,
        "unit": "unit",
        "unit_price": 15000000,
        "total_price": 75000000
      }
    ],
    "total_amount": 75000000,
    "budget_code": "IT-2026-001",
    "requested_by": "john_doe",
    "status": "PENDING",
    "justification": "Pengadaan laptop untuk karyawan baru",
    "approvals": [
      {
        "id": "uuid",
        "role": "MANAGER",
        "status": "PENDING",
        "created_at": "2026-08-04T00:00:00.000Z"
      },
      {
        "id": "uuid",
        "role": "DIRECTOR",
        "status": "PENDING",
        "created_at": "2026-08-04T00:00:00.000Z"
      }
    ],
    "created_at": "2026-08-04T00:00:00.000Z",
    "updated_at": "2026-08-04T00:00:00.000Z"
  }
]
```

### 4.2 Get PR Detail

**Endpoint:** `GET /api/pr/:id`

**Auth Required:** Yes (All roles)

**Response Success (200):**
```json
{
  "id": "PR-001",
  "business_unit": "IT",
  "items": [
    {
      "name": "Laptop Dell XPS",
      "quantity": 5,
      "unit": "unit",
      "unit_price": 15000000,
      "total_price": 75000000
    }
  ],
  "total_amount": 75000000,
  "budget_code": "IT-2026-001",
  "requested_by": "john_doe",
  "status": "PENDING",
  "justification": "Pengadaan laptop untuk karyawan baru",
  "approvals": [
    {
      "id": "uuid",
      "role": "MANAGER",
      "status": "APPROVED",
      "approved_by": "manager1",
      "approved_at": "2026-08-04T00:00:00.000Z"
    },
    {
      "id": "uuid",
      "role": "DIRECTOR",
      "status": "PENDING",
      "created_at": "2026-08-04T00:00:00.000Z"
    }
  ],
  "quotes": [...],
  "created_at": "2026-08-04T00:00:00.000Z",
  "updated_at": "2026-08-04T00:00:00.000Z"
}
```

### 4.3 Create PR

**Endpoint:** `POST /api/pr`

**Auth Required:** Yes (All roles)

**Request Body:**
```json
{
  "business_unit": "IT",
  "items": [
    {
      "name": "Laptop Dell XPS",
      "quantity": 5,
      "unit": "unit",
      "unit_price": 15000000
    }
  ],
  "budget_code": "IT-2026-001",
  "justification": "Pengadaan laptop untuk karyawan baru",
  "quotes": [
    {
      "vendor_id": "uuid",
      "vendor_name": "PT. Vendor A",
      "price": 75000000,
      "file_url": "/uploads/quotes/quote-a.pdf"
    }
  ]
}
```

**Response Success (201):**
```json
{
  "id": "PR-001",
  "business_unit": "IT",
  "items": [...],
  "total_amount": 75000000,
  "budget_code": "IT-2026-001",
  "requested_by": "john_doe",
  "status": "PENDING",
  "justification": "Pengadaan laptop untuk karyawan baru",
  "approvals": [
    {
      "id": "uuid",
      "role": "MANAGER",
      "status": "PENDING"
    },
    {
      "id": "uuid",
      "role": "DIRECTOR",
      "status": "PENDING"
    }
  ],
  "created_at": "2026-08-04T00:00:00.000Z"
}
```

### 4.4 Approve PR

**Endpoint:** `POST /api/pr/:id/approve`

**Auth Required:** Yes (MANAGER, DIRECTOR, ADMIN, SUPER_ADMIN)

**Request Body:**
```json
{
  "approver": "manager1",
  "notes": "Disetujui, budget cukup"
}
```

**Response Success (200):**
```json
{
  "id": "PR-001",
  "status": "APPROVED",
  "approvals": [
    {
      "id": "uuid",
      "role": "MANAGER",
      "status": "APPROVED",
      "approved_by": "manager1",
      "approved_at": "2026-08-04T00:00:00.000Z"
    },
    {
      "id": "uuid",
      "role": "DIRECTOR",
      "status": "APPROVED",
      "approved_by": "director1",
      "approved_at": "2026-08-04T00:00:00.000Z"
    }
  ],
  "updated_at": "2026-08-04T00:00:00.000Z"
}
```

**Response Error (403):**
```json
{
  "message": "Anda tidak berwenang untuk approve PR ini"
}
```

### 4.5 Reject PR

**Endpoint:** `POST /api/pr/:id/reject`

**Auth Required:** Yes (MANAGER, DIRECTOR, ADMIN, SUPER_ADMIN)

**Request Body:**
```json
{
  "rejector": "manager1",
  "reason": "Budget tidak cukup di bulan ini"
}
```

**Response Success (200):**
```json
{
  "id": "PR-001",
  "status": "REJECTED",
  "approvals": [
    {
      "id": "uuid",
      "role": "MANAGER",
      "status": "REJECTED",
      "rejected_by": "manager1",
      "rejected_at": "2026-08-04T00:00:00.000Z",
      "reason": "Budget tidak cukup di bulan ini"
    }
  ],
  "updated_at": "2026-08-04T00:00:00.000Z"
}
```

### 4.6 Budget Check

**Endpoint:** `GET /api/pr/:id/budget-check`

**Auth Required:** Yes (All roles)

**Response Success (200):**
```json
{
  "budget_code": "IT-2026-001",
  "total_budget": 100000000,
  "used_budget": 75000000,
  "remaining_budget": 25000000,
  "pr_amount": 75000000,
  "status": "CUKUP"
}
```

---

## 5. Purchase Order

### 5.1 List POs

**Endpoint:** `GET /api/po`

**Auth Required:** Yes (All roles)

**Query Parameters:**
| Parameter | Type | Description |
|-----------|------|-------------|
| `status` | string | Filter by status (DRAFT, SENT, CONFIRMED, DELIVERED) |
| `vendor_id` | uuid | Filter by vendor |
| `pr_id` | string | Filter by PR |

**Response Success (200):**
```json
[
  {
    "id": "PO-001",
    "pr_id": "PR-001",
    "vendor_id": "uuid",
    "vendor_name": "PT. Vendor Indonesia",
    "total_amount": 75000000,
    "budget_type": "OPEX",
    "status": "CONFIRMED",
    "delivery_deadline": "2026-08-11",
    "sent_at": "2026-08-04T00:00:00.000Z",
    "created_at": "2026-08-04T00:00:00.000Z",
    "updated_at": "2026-08-04T00:00:00.000Z"
  }
]
```

### 5.2 Get PO Detail

**Endpoint:** `GET /api/po/:id`

**Auth Required:** Yes (All roles)

**Response Success (200):**
```json
{
  "id": "PO-001",
  "pr_id": "PR-001",
  "vendor_id": "uuid",
  "vendor_name": "PT. Vendor Indonesia",
  "vendor_address": "Jakarta, Indonesia",
  "total_amount": 75000000,
  "budget_type": "OPEX",
  "status": "CONFIRMED",
  "delivery_deadline": "2026-08-11",
  "items": [
    {
      "name": "Laptop Dell XPS",
      "quantity": 5,
      "unit_price": 15000000,
      "total_price": 75000000
    }
  ],
  "sent_at": "2026-08-04T00:00:00.000Z",
  "confirmed_at": "2026-08-04T00:00:00.000Z",
  "created_at": "2026-08-04T00:00:00.000Z",
  "updated_at": "2026-08-04T00:00:00.000Z"
}
```

### 5.3 Create PO

**Endpoint:** `POST /api/po`

**Auth Required:** Yes (ADMIN, SUPER_ADMIN, MANAGER)

**Request Body:**
```json
{
  "pr_id": "PR-001",
  "vendor_id": "uuid",
  "vendor_name": "PT. Vendor Indonesia",
  "total_amount": 75000000,
  "budget_type": "OPEX",
  "delivery_deadline": "2026-08-11",
  "items": [
    {
      "name": "Laptop Dell XPS",
      "quantity": 5,
      "unit_price": 15000000,
      "total_price": 75000000
    }
  ]
}
```

**Response Success (201):**
```json
{
  "id": "PO-001",
  "pr_id": "PR-001",
  "vendor_id": "uuid",
  "vendor_name": "PT. Vendor Indonesia",
  "total_amount": 75000000,
  "budget_type": "OPEX",
  "status": "DRAFT",
  "delivery_deadline": "2026-08-11",
  "created_at": "2026-08-04T00:00:00.000Z"
}
```

### 5.4 Send PO to Vendor

**Endpoint:** `POST /api/po/:id/send`

**Auth Required:** Yes (ADMIN, SUPER_ADMIN, MANAGER)

**Response Success (200):**
```json
{
  "id": "PO-001",
  "status": "SENT",
  "sent_at": "2026-08-04T00:00:00.000Z",
  "updated_at": "2026-08-04T00:00:00.000Z"
}
```

### 5.5 Confirm PO

**Endpoint:** `POST /api/po/:id/confirm`

**Auth Required:** Yes (ADMIN, SUPER_ADMIN, MANAGER, VENDOR)

**Response Success (200):**
```json
{
  "id": "PO-001",
  "status": "CONFIRMED",
  "confirmed_at": "2026-08-04T00:00:00.000Z",
  "updated_at": "2026-08-04T00:00:00.000Z"
}
```

### 5.6 Mark as Delivered

**Endpoint:** `POST /api/po/:id/deliver`

**Auth Required:** Yes (ADMIN, SUPER_ADMIN, MANAGER, VENDOR)

**Request Body:**
```json
{
  "notes": "Barang diterima dalam kondisi baik"
}
```

**Response Success (200):**
```json
{
  "id": "PO-001",
  "status": "DELIVERED",
  "delivered_at": "2026-08-04T00:00:00.000Z",
  "updated_at": "2026-08-04T00:00:00.000Z"
}
```

### 5.7 Print PO (PDF)

**Endpoint:** `GET /api/po/:id/print`

**Auth Required:** Yes (All roles)

**Response:** PDF file

---

## 6. Invoice

### 6.1 List Invoices

**Endpoint:** `GET /api/invoices/history`

**Auth Required:** Yes (ADMIN, SUPER_ADMIN, FINANCE, MANAGER)

**Query Parameters:**
| Parameter | Type | Description |
|-----------|------|-------------|
| `status` | string | Filter by status (PENDING, PAID, OVERDUE) |
| `vendor_id` | uuid | Filter by vendor |
| `start_date` | date | Filter from date |
| `end_date` | date | Filter to date |

**Response Success (200):**
```json
[
  {
    "id": "INV-001",
    "invoice_number": "INV/2026/08/001",
    "po_id": "PO-001",
    "vendor_id": "uuid",
    "vendor_name": "PT. Vendor Indonesia",
    "amount": 75000000,
    "due_date": "2026-08-18",
    "status": "PENDING",
    "created_at": "2026-08-04T00:00:00.000Z"
  }
]
```

### 6.2 Get Invoice Metrics

**Endpoint:** `GET /api/invoices/metrics`

**Auth Required:** Yes (ADMIN, SUPER_ADMIN, FINANCE, MANAGER)

**Response Success (200):**
```json
{
  "total_invoices": 150,
  "pending_invoices": 45,
  "paid_invoices": 100,
  "overdue_invoices": 5,
  "total_amount": 5000000000,
  "pending_amount": 1500000000,
  "paid_amount": 3400000000,
  "overdue_amount": 100000000
}
```

### 6.3 Create Invoice

**Endpoint:** `POST /api/invoices`

**Auth Required:** Yes (ADMIN, SUPER_ADMIN, FINANCE, MANAGER, VENDOR)

**Request Body:**
```json
{
  "invoice_number": "INV/2026/08/001",
  "po_id": "PO-001",
  "vendor_id": "uuid",
  "vendor_name": "PT. Vendor Indonesia",
  "amount": 75000000,
  "due_date": "2026-08-18"
}
```

**Response Success (201):**
```json
{
  "id": "INV-001",
  "invoice_number": "INV/2026/08/001",
  "po_id": "PO-001",
  "vendor_id": "uuid",
  "vendor_name": "PT. Vendor Indonesia",
  "amount": 75000000,
  "due_date": "2026-08-18",
  "status": "PENDING",
  "created_at": "2026-08-04T00:00:00.000Z"
}
```

### 6.4 Create GRN

**Endpoint:** `POST /api/invoices/grn`

**Auth Required:** Yes (ADMIN, SUPER_ADMIN, FINANCE, MANAGER, VENDOR)

**Request Body:**
```json
{
  "po_id": "PO-001",
  "received_by": "gudang_manager",
  "notes": "Barang diterima dalam kondisi baik"
}
```

**Response Success (201):**
```json
{
  "id": "GRN-001",
  "po_id": "PO-001",
  "received_by": "gudang_manager",
  "notes": "Barang diterima dalam kondisi baik",
  "received_at": "2026-08-04T00:00:00.000Z"
}
```

### 6.5 Three-Way Match

**Endpoint:** `POST /api/invoices/three-way-match`

**Auth Required:** Yes (ADMIN, SUPER_ADMIN, FINANCE, MANAGER)

**Request Body:**
```json
{
  "po_id": "PO-001",
  "grn_id": "GRN-001",
  "invoice_id": "INV-001"
}
```

**Response Success (200):**
```json
{
  "id": "uuid",
  "po_id": "PO-001",
  "grn_id": "GRN-001",
  "invoice_id": "INV-001",
  "amount_match": true,
  "quantity_match": true,
  "grn_match": true,
  "status": "MATCHED",
  "created_at": "2026-08-04T00:00:00.000Z"
}
```

**Response Error (400) - Amount Mismatch:**
```json
{
  "message": "Amount mismatch: PO = 75000000, Invoice = 70000000"
}
```

### 6.6 Payment Voucher

**Endpoint:** `GET /api/invoices/:id/payment-voucher`

**Auth Required:** Yes (ADMIN, SUPER_ADMIN, FINANCE, MANAGER)

**Response:** PDF file

---

## 7. Analytics

### 7.1 Get KPI Metrics

**Endpoint:** `GET /api/analytics/kpi`

**Auth Required:** Yes (ADMIN, MANAGER, DIRECTOR, STAFF, COMPLIANCE, FINANCE)

**Response Success (200):**
```json
{
  "total_pr": 150,
  "total_po": 120,
  "total_vendor": 45,
  "total_invoice": 100,
  "total_savings": 500000000,
  "avg_cycle_time": 7.5,
  "compliance_rate": 95.5
}
```

### 7.2 Get Spend by Category

**Endpoint:** `GET /api/analytics/spend-by-category`

**Auth Required:** Yes (ADMIN, MANAGER, DIRECTOR, STAFF, COMPLIANCE, FINANCE)

**Response Success (200):**
```json
[
  {
    "category": "IT Equipment",
    "total_amount": 500000000
  },
  {
    "category": "Office Supplies",
    "total_amount": 200000000
  },
  {
    "category": "Services",
    "total_amount": 300000000
  }
]
```

### 7.3 Get Top Vendors

**Endpoint:** `GET /api/analytics/top-vendors`

**Auth Required:** Yes (ADMIN, MANAGER, DIRECTOR, STAFF, COMPLIANCE, FINANCE)

**Response Success (200):**
```json
[
  {
    "vendor_id": "uuid",
    "vendor_name": "PT. Vendor Indonesia",
    "total_transactions": 50,
    "total_amount": 1000000000,
    "avg_rating": 4.5
  }
]
```

### 7.4 Get Recent Audit Logs

**Endpoint:** `GET /api/analytics/recent-audit`

**Auth Required:** Yes (ADMIN, MANAGER, COMPLIANCE)

**Query Parameters:**
| Parameter | Type | Description |
|-----------|------|-------------|
| `limit` | integer | Jumlah log (default: 50) |

**Response Success (200):**
```json
[
  {
    "id": "uuid",
    "actor_id": "uuid",
    "actor_username": "admin",
    "actor_role": "ADMIN",
    "action": "CREATE_VENDOR",
    "resource_type": "vendor",
    "resource_id": "uuid",
    "description": "Created vendor PT. Vendor Indonesia",
    "ip_address": "192.168.1.1",
    "created_at": "2026-08-04T00:00:00.000Z"
  }
]
```

### 7.5 Get Consent Status

**Endpoint:** `GET /api/analytics/consent-status`

**Auth Required:** Yes (ADMIN, MANAGER, COMPLIANCE)

**Response Success (200):**
```json
{
  "total_users": 100,
  "consent_given": 85,
  "consent_withdrawn": 5,
  "consent_pending": 10
}
```

---

## 8. Compliance

### 8.1 Get Privacy Notice

**Endpoint:** `GET /api/compliance/privacy-notice`

**Auth Required:** Yes (All roles)

**Response Success (200):**
```json
{
  "id": "uuid",
  "version": "1.0",
  "title": "Privacy Notice",
  "content": "Kami menghargai privasi Anda...",
  "effective_date": "2026-01-01T00:00:00.000Z",
  "is_active": true
}
```

### 8.2 Record Consent

**Endpoint:** `POST /api/compliance/consent`

**Auth Required:** Yes (All roles)

**Request Body:**
```json
{
  "consent_type": "PRIVACY_NOTICE",
  "consent_given": true,
  "consent_text": "Saya setuju dengan kebijakan privasi"
}
```

**Response Success (201):**
```json
{
  "id": "uuid",
  "user_id": "uuid",
  "consent_type": "PRIVACY_NOTICE",
  "consent_given": true,
  "consent_text": "Saya setuju dengan kebijakan privasi",
  "consent_date": "2026-08-04T00:00:00.000Z"
}
```

### 8.3 Get User Consents

**Endpoint:** `GET /api/compliance/consent`

**Auth Required:** Yes (All roles)

**Response Success (200):**
```json
[
  {
    "id": "uuid",
    "consent_type": "PRIVACY_NOTICE",
    "consent_given": true,
    "consent_date": "2026-08-04T00:00:00.000Z",
    "withdrawn_at": null
  }
]
```

### 8.4 Withdraw Consent

**Endpoint:** `POST /api/compliance/consent/withdraw`

**Auth Required:** Yes (All roles)

**Request Body:**
```json
{
  "consent_type": "PRIVACY_NOTICE"
}
```

**Response Success (200):**
```json
{
  "id": "uuid",
  "consent_type": "PRIVACY_NOTICE",
  "consent_given": false,
  "withdrawn_at": "2026-08-04T00:00:00.000Z"
}
```

### 8.5 Export Personal Data

**Endpoint:** `GET /api/compliance/my-data`

**Auth Required:** Yes (All roles)

**Response Success (200):**
```json
{
  "user": {
    "id": "uuid",
    "username": "john_doe",
    "email": "john@example.com",
    "role": "STAFF",
    "created_at": "2026-01-01T00:00:00.000Z"
  },
  "prs": [...],
  "pos": [...],
  "consents": [...],
  "audit_logs": [...]
}
```

### 8.6 Update Profile

**Endpoint:** `PUT /api/compliance/update-profile`

**Auth Required:** Yes (All roles)

**Request Body:**
```json
{
  "email": "newemail@example.com",
  "phone": "089876543210"
}
```

**Response Success (200):**
```json
{
  "id": "uuid",
  "username": "john_doe",
  "email": "newemail@example.com",
  "phone": "089876543210",
  "updated_at": "2026-08-04T00:00:00.000Z"
}
```

### 8.7 Delete Request

**Endpoint:** `POST /api/compliance/delete-request`

**Auth Required:** Yes (All roles)

**Request Body:**
```json
{
  "reason": "Tidak lagi menggunakan sistem"
}
```

**Response Success (201):**
```json
{
  "id": "uuid",
  "user_id": "uuid",
  "reason": "Tidak lagi menggunakan sistem",
  "status": "PENDING",
  "requested_at": "2026-08-04T00:00:00.000Z"
}
```

### 8.8 Get Data Retention Policies

**Endpoint:** `GET /api/compliance/data-retention`

**Auth Required:** Yes (ADMIN, SUPER_ADMIN, COMPLIANCE)

**Response Success (200):**
```json
[
  {
    "id": "uuid",
    "data_type": "audit_logs",
    "retention_period_days": 2555,
    "description": "Retain audit logs for 7 years",
    "created_at": "2026-01-01T00:00:00.000Z",
    "updated_at": "2026-01-01T00:00:00.000Z"
  }
]
```

### 8.9 Run Retention Job

**Endpoint:** `POST /api/compliance/retention/run`

**Auth Required:** Yes (ADMIN only)

**Response Success (200):**
```json
{
  "message": "Retention job completed",
  "deleted_records": 150,
  "executed_at": "2026-08-04T00:00:00.000Z"
}
```

---

## 9. User Management

### 9.1 List Users

**Endpoint:** `GET /api/auth/users`

**Auth Required:** Yes (ADMIN, SUPER_ADMIN)

**Query Parameters:**
| Parameter | Type | Description |
|-----------|------|-------------|
| `role` | string | Filter by role |
| `search` | string | Search by username or email |

**Response Success (200):**
```json
[
  {
    "id": "uuid",
    "username": "admin",
    "role": "SUPER_ADMIN",
    "email": "admin@procrutmen.co.id",
    "must_change_password": false,
    "created_at": "2026-01-01T00:00:00.000Z"
  }
]
```

### 9.2 Create User

**Endpoint:** `POST /api/auth/users`

**Auth Required:** Yes (ADMIN, SUPER_ADMIN)

**Request Body:**
```json
{
  "username": "manager1",
  "email": "manager@procrutmen.co.id",
  "password": "password123",
  "role": "MANAGER",
  "must_change_password": true
}
```

**Response Success (201):**
```json
{
  "id": "uuid",
  "username": "manager1",
  "email": "manager@procrutmen.co.id",
  "role": "MANAGER",
  "must_change_password": true,
  "created_at": "2026-08-04T00:00:00.000Z"
}
```

### 9.3 Update User

**Endpoint:** `PUT /api/auth/users/:id`

**Auth Required:** Yes (ADMIN, SUPER_ADMIN)

**Request Body:**
```json
{
  "email": "newemail@procrutmen.co.id",
  "role": "MANAGER",
  "must_change_password": false
}
```

**Response Success (200):**
```json
{
  "id": "uuid",
  "username": "manager1",
  "email": "newemail@procrutmen.co.id",
  "role": "MANAGER",
  "must_change_password": false,
  "updated_at": "2026-08-04T00:00:00.000Z"
}
```

### 9.4 Delete User

**Endpoint:** `DELETE /api/auth/users/:id`

**Auth Required:** Yes (ADMIN, SUPER_ADMIN)

**Response Success (200):**
```json
{
  "message": "User berhasil dihapus"
}
```

---

## 10. Error Codes

| Status Code | Description | Example Response |
|-------------|-------------|------------------|
| 200 | Success | `{"message": "Success"}` |
| 201 | Created | `{"id": "uuid", ...}` |
| 400 | Bad Request | `{"message": "Invalid request body"}` |
| 401 | Unauthorized | `{"message": "Tidak terautentikasi"}` |
| 403 | Forbidden | `{"message": "Akses ditolak"}` |
| 404 | Not Found | `{"message": "Resource not found"}` |
| 409 | Conflict | `{"message": "Username already exists"}` |
| 422 | Validation Error | `{"message": "Validation failed", "errors": [...]}` |
| 500 | Internal Server Error | `{"message": "Internal server error"}` |

---

## 11. Rate Limiting

### 11.1 Default Limits

| User Type | Rate Limit |
|-----------|------------|
| Authenticated | 100 requests per minute |
| Anonymous | 20 requests per minute |

### 11.2 Rate Limit Headers

```
X-RateLimit-Limit: 100
X-RateLimit-Remaining: 95
X-RateLimit-Reset: 2026-08-04T12:00:00.000Z
```

### 11.3 Rate Limit Exceeded

**Response (429):**
```json
{
  "message": "Too many requests, please try again later",
  "retry_after": 60
}
```

---

## 12. Postman Collection

Untuk memudahkan testing, Anda dapat menggunakan Postman Collection yang tersedia di:
`docs/postman-collection.json`

Collection ini mencakup:
- Semua endpoint API
- Environment variables
- Request examples
- Test scripts

---

## 13. Testing dengan cURL

### 13.1 Login

```bash
curl -X POST http://localhost:3000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"username":"admin","password":"admin123"}' \
  -c cookies.txt
```

### 13.2 Get Current User

```bash
curl -X GET http://localhost:3000/api/auth/me \
  -b cookies.txt
```

### 13.3 List Vendors

```bash
curl -X GET "http://localhost:3000/api/vendors?status=ACTIVE" \
  -b cookies.txt
```

### 13.4 Create Vendor

```bash
curl -X POST http://localhost:3000/api/vendors \
  -H "Content-Type: application/json" \
  -d '{
    "name": "PT. Vendor Baru",
    "email": "vendor@example.com",
    "phone": "081234567890",
    "address": "Jakarta, Indonesia",
    "status": "PENDING",
    "category": "IT Equipment",
    "bank_name": "BCA",
    "bank_account": "1234567890",
    "bank_owner": "PT. Vendor Baru"
  }' \
  -b cookies.txt
```

---

## Kontak

**Developer:** Muhammad Arif Pratama  
**Email:** arifpratama5@gmail.com  
**Tanggal:** 4 Agustus 2026

---

## Changelog

### v1.2 (4 Agustus 2026)
- Added GRN creation endpoint documentation
- Added three-way match endpoint documentation with proper logic
- Documented all role-based access requirements per endpoint
- Added production environment variables section
- Added cURL examples for testing

### v1.1 (4 Agustus 2026)
- Added RBAC documentation for all endpoints
- Added user management endpoints
- Updated invoice and analytics endpoints
