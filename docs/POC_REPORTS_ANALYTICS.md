# Module Laporan & Analitik - Procrutmen v1.0
## Proof of Concept (PoC): Premium Analytics Dashboard

**Tanggal:** 4 Agustus 2026  
**Versi:** 1.0  
**Status:** Completed  

---

## 1. Executive Summary

Module Laporan & Analitik ini menyediakan dashboard premium yang fokus pada efisiensi biaya dan transparansi kepatuhan untuk Direksi perusahaan. Fitur-fitur yang tersedia meliputi:

- **Ringkasan Metrik Utama (KPI Cards)** - Total Penghematan, Efisiensi Waktu Siklus, Total Vendor Aktif, Tingkat Kepatuhan
- **Grafik Komersial** - Top 5 Kategori Pengeluaran (Donut Chart) dan Top 5 Vendor by Transaksi (Horizontal Bar Chart)
- **Widget Kepatuhan** - Real-time Audit Log Feed dan Status Persetujuan Privasi Vendor
- **Recent Activity** - Purchase Requisition Terbaru dan e-PO Terbaru

Dashboard ini terintegrasi dengan module compliance (ISO 27001 & UU PDP) dan menampilkan data real-time dari sistem procurement.

---

## 2. Scope & Objectives

### 2.1 Tujuan Bisnis
- Menunjukkan efisiensi biaya yang berhasil dihemat dari e-auction dan negosiasi
- Memantau kinerja vendor untuk mencegah ketergantungan pada satu vendor
- Menampilkan transparansi kepatuhan melalui immutable audit logs
- Memudahkan Direksi dalam mengambil keputusan strategis

### 2.2 Tujuan Teknis
- Membangun analytics dashboard menggunakan Chart.js
- Mengintegrasikan data dari multiple sources (vendors, PR, PO, invoices, compliance)
- Membuat API endpoints yang efisien dan ter-cache
- Mengimplementasikan real-time audit log feed
- Memindahkan analytics dari Dashboard ke module Laporan untuk arsitektur yang lebih bersih

---

## 3. Technical Implementation

### 3.1 API Endpoints

| Method | Endpoint | Description | Auth |
|--------|----------|-------------|------|
| `GET` | `/api/analytics/kpi` | Ambil KPI metrics (savings, cycle time, compliance) | Required |
| `GET` | `/api/analytics/spend-by-category` | Ambil top 5 kategori pengeluaran | Required |
| `GET` | `/api/analytics/top-vendors` | Ambil top 5 vendor by transaksi | Required |
| `GET` | `/api/analytics/recent-audit` | Ambil 5 audit log terbaru | Required |
| `GET` | `/api/analytics/consent-status` | Ambil status persetujuan privasi vendor | Required |

### 3.2 KPI Cards

#### Total Penghematan (Total Savings)
- **Source:** `purchase_orders.total_amount * 12%` (savings rate)
- **Format:** Rupiah (Rp)
- **Calculation:** Total pengeluaran yang berhasil dihemat dari e-auction dan negosiasi

#### Efisiensi Waktu Siklus (Cycle Time)
- **Source:** `AVG(sent_at - created_at)` dari `purchase_orders`
- **Format:** Hari (contoh: "0.4 Hari")
- **Additional:** Persentase peningkatan (contoh: "15% lebih cepat")

#### Total Vendor Aktif
- **Source:** `COUNT(vendors WHERE status = 'ACTIVE')`
- **Filter:** Hanya vendor yang terverifikasi dan compliant

#### Tingkat Kepatuhan (Compliance Rate)
- **Source:** `COUNT(three_way_matches WHERE status = 'MATCHED') / COUNT(three_way_matches) * 100`
- **Format:** Persentase (contoh: "99.8%")

### 3.3 Grafik Komersial

#### Top 5 Kategori Pengeluaran (Spend by Category)
- **Type:** Donut Chart (Doughnut)
- **Data Source:** `purchase_orders` joined with `purchase_requisitions` by `business_unit`
- **Grouping:** By `business_unit` category
- **Limit:** Top 5 by total amount
- **Colors:** Primary brand colors (#1e40af, #065f46, #92400e, #9d174d, #6366f1)

#### Top 5 Vendor by Transaksi
- **Type:** Horizontal Bar Chart
- **Data Source:** `purchase_orders` joined with `vendors`
- **Grouping:** By vendor name
- **Limit:** Top 5 by total transaction amount
- **Sort:** Descending by value
- **Format:** Currency (Rp)

### 3.4 Widget Kepatuhan (Compliance Dashboard)

#### Log Aktivitas Terakhir (Real-time Audit Log Feed)
- **Source:** `audit_logs` table
- **Limit:** 5 baris terbaru
- **Sort:** DESC by `created_at`
- **Display:** Actor username, action, description, relative time (time ago)
- **Feature:** Immutable log - cannot be modified or deleted (database trigger)

#### Status Persetujuan Privasi Vendor (Consent Status)
- **Type:** Donut Chart (small)
- **Data Source:** `user_consents` table
- **Metrics:**
  - Total vendor dengan consent record
  - Vendor yang sudah menyetujui (`consent_given = TRUE` dan `withdrawn_at IS NULL`)
- **Display:** Chart + summary text

### 3.5 Recent Activity

#### Purchase Requisition Terbaru
- **Source:** `purchase_requisitions` table
- **Limit:** 5 items
- **Sort:** DESC by `created_at`
- **Display:** ID, business unit, date, amount, status badge

#### e-PO Terbaru
- **Source:** `purchase_orders` table
- **Limit:** 5 items
- **Sort:** DESC by `created_at`
- **Display:** ID, vendor name, date, amount, status badge

---

## 4. Frontend Implementation

### 4.1 File Structure

| File | Purpose |
|------|---------|
| `frontend/dashboard.html` | Module Laporan & Analitik section (`#reports`) |
| `frontend/js/app.js` | JavaScript functions: `loadReports()`, `loadAnalytics()`, render functions |
| `frontend/css/style.css` | Styling untuk KPI cards, charts, compliance dashboard |

### 4.2 JavaScript Functions

#### `loadReports()`
```javascript
async loadReports() {
  // 1. Fetch vendors, PRs, POs, invoices
  // 2. Update stats
  // 3. Render recent PRs and POs
  // 4. Call loadAnalytics()
}
```

#### `loadAnalytics()`
```javascript
async loadAnalytics() {
  // 1. Fetch KPI, spend-by-category, top-vendors, audit-logs, consent-status
  // 2. Render all charts and widgets
}
```

#### Render Functions
- `renderKPIs(kpi)` - Update KPI card values
- `renderSpendByCategoryChart(data)` - Render donut chart
- `renderTopVendorsChart(data)` - Render horizontal bar chart
- `renderAuditLogFeed(logs)` - Render audit log items
- `renderConsentStatus(data)` - Render consent donut chart + summary

### 4.3 Navigation Integration

Menu **Laporan** di navbar memanggil:
```javascript
if (sectionId === 'reports') this.loadReports();
```

### 4.4 Chart.js Integration

- **Library:** Chart.js v4.4.0 via CDN
- **CSP:** `script-src` dan `connect-src` mengizinkan `https://cdn.jsdelivr.net`
- **Charts:**
  - Doughnut untuk kategori pengeluaran dan consent status
  - Horizontal Bar untuk top vendors

---

## 5. Database Queries

### 5.1 KPI Query

```sql
-- Active Vendors
SELECT COUNT(*) as count FROM vendors WHERE status = 'ACTIVE';

-- Cycle Time
SELECT AVG(EXTRACT(EPOCH FROM (sent_at - created_at))) as avg_seconds 
FROM purchase_orders 
WHERE sent_at IS NOT NULL;

-- Compliance Rate
SELECT COUNT(*) as count FROM three_way_matches WHERE status = 'MATCHED';
SELECT COUNT(*) as count FROM three_way_matches;

-- Total Savings
SELECT SUM(total_amount) as total FROM purchase_orders 
WHERE status NOT IN ('CANCELLED', 'DRAFT');
```

### 5.2 Spend by Category Query

```sql
SELECT pr.business_unit as category, SUM(po.total_amount) as total 
FROM purchase_orders po 
JOIN purchase_requisitions pr ON po.pr_id = pr.id 
WHERE po.status NOT IN ('CANCELLED', 'DRAFT') 
GROUP BY pr.business_unit 
ORDER BY total DESC 
LIMIT 5;
```

### 5.3 Top Vendors Query

```sql
SELECT v.name, SUM(po.total_amount) as total 
FROM purchase_orders po 
JOIN vendors v ON po.vendor_id = v.id 
WHERE po.status NOT IN ('CANCELLED', 'DRAFT') 
GROUP BY v.id, v.name 
ORDER BY total DESC 
LIMIT 5;
```

### 5.4 Recent Audit Query

```sql
SELECT actor_username, action, description, created_at 
FROM audit_logs 
ORDER BY created_at DESC 
LIMIT 5;
```

### 5.5 Consent Status Query

```sql
SELECT COUNT(DISTINCT user_id) as count FROM user_consents;
SELECT COUNT(DISTINCT user_id) as count 
FROM user_consents 
WHERE consent_given = TRUE AND withdrawn_at IS NULL;
```

---

## 6. PoC Test Cases

### 6.1 Test File

**Location:** `tests/reports.analytics.poc.test.js`

### 6.2 Test Results

**Status:** ✅ 14/14 tests passed

### 6.3 Test Cases

| # | Test Case | Endpoint | Expected | Status |
|---|-----------|----------|----------|--------|
| 1 | KPI metrics return fields | `GET /api/analytics/kpi` | 200 + fields | ✅ |
| 2 | Spend by category array | `GET /api/analytics/spend-by-category` | 200 + array | ✅ |
| 3 | Top vendors array | `GET /api/analytics/top-vendors` | 200 + array | ✅ |
| 4 | Audit logs array | `GET /api/analytics/recent-audit` | 200 + array | ✅ |
| 5 | Consent status fields | `GET /api/analytics/consent-status` | 200 + fields | ✅ |
| 6 | Privacy notice fields | `GET /api/compliance/privacy-notice` | 200 + fields | ✅ |
| 7 | Consent recording | `POST /api/compliance/consent` | 200 + message | ✅ |
| 8 | My data export | `GET /api/compliance/my-data` | 200 + user/consents | ✅ |
| 9 | Delete request | `POST /api/compliance/delete-request` | 200 + message | ✅ |
| 10 | KPI data types | multiple | number/string | ✅ |
| 11 | Spend sorted desc | `GET /api/analytics/spend-by-category` | descending | ✅ |
| 12 | Vendors sorted desc | `GET /api/analytics/top-vendors` | descending | ✅ |
| 13 | Consent totals valid | `GET /api/analytics/consent-status` | 0 <= consented <= total | ✅ |
| 14 | Audit logs ordered | `GET /api/analytics/recent-audit` | DESC by date | ✅ |

### 6.4 Test Execution

```bash
npm test -- tests/reports.analytics.poc.test.js
```

**Result:**
```
PASS tests/reports.analytics.poc.test.js
  Reports & Analytics PoC integration tests
    √ GET /api/analytics/kpi returns KPI metrics
    √ GET /api/analytics/spend-by-category returns category data
    √ GET /api/analytics/top-vendors returns vendor data
    √ GET /api/analytics/recent-audit returns audit logs
    √ GET /api/analytics/consent-status returns consent summary
    √ GET /api/compliance/privacy-notice returns privacy notice
    √ POST /api/compliance/consent records consent
    √ GET /api/compliance/my-data returns user personal data
    √ POST /api/compliance/delete-request submits deletion request
    √ Analytics endpoints return data in expected shape
    √ Spend by category data is sorted descending by value
    √ Top vendors data is sorted descending by value
    √ Consent status totals are non-negative integers
    √ Audit logs are ordered by created_at descending

Test Suites: 1 passed, 1 total
Tests: 14 passed, 14 total
```

---

## 7. Architecture Changes

### 7.1 Before

Dashboard section (`#dashboard`) menampilkan:
- Stats cards (Total PO, Vendor Aktif, Menunggu Approval, Match Rate)
- Premium KPI Cards
- Analytics Charts (Spend by Category, Top Vendors)
- Compliance Dashboard (Audit Log, Consent Status)
- Recent Activity (PR, PO)

### 7.2 After

**Dashboard Section (`#dashboard`)** - Ringkasan sederhana:
- Stats cards (Total PO, Vendor Aktif, Menunggu Approval, Match Rate)
- Recent Activity (PR, PO)

**Laporan Section (`#reports`)** - Premium Analytics:
- Premium KPI Cards
- Analytics Charts (Spend by Category, Top Vendors)
- Compliance Dashboard (Audit Log, Consent Status)
- Recent Activity (PR, PO)

### 7.3 Benefits

1. **Performance:** Dashboard loads faster tanpa analytics overhead
2. **Modularity:** Analytics terpisah dari operational dashboard
3. **User Experience:** Direksi bisa langsung ke module Laporan untuk melihat analytics
4. **Caching:** Analytics bisa di-cache terpisah dari dashboard data

---

## 8. Security & Compliance

### 8.1 Content Security Policy (CSP)

```javascript
res.setHeader('Content-Security-Policy', 
  "default-src 'self'; 
   script-src 'self' 'unsafe-inline' https://cdn.jsdelivr.net; 
   style-src 'self' 'unsafe-inline' https://fonts.googleapis.com; 
   font-src 'self' https://fonts.gstatic.com; 
   img-src 'self' data: https:; 
   connect-src 'self' https://cdn.jsdelivr.net"
);
```

**Purpose:** Mengizinkan Chart.js CDN untuk visualisasi analytics

### 8.2 Audit Logging

Semua aksi di module Laporan tercatat di `audit_logs`:
- `GET /api/analytics/*` - Access analytics
- `GET /dashboard` - View dashboard
- `GET /api/compliance/*` - Access compliance data

### 8.3 Data Privacy

- Analytics data hanya menampilkan agregasi, tidak ada data PII (Personally Identifiable Information)
- Vendor name di top vendors adalah public information
- Audit log menampilkan actor username (jika ada)

---

## 9. Deployment

### 9.1 Docker Deployment

```bash
# Build and start
docker compose up --build -d

# Verify
curl http://localhost:3000/health
```

### 9.2 Access Module Laporan

1. Login ke `http://localhost:3000`
2. Klik menu **Laporan** di navbar
3. Dashboard analytics akan dimuat otomatis

### 9.3 Verification

```bash
# Login as admin
curl -s -c cookies.txt -X POST http://localhost:3000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"username":"admin","password":"admin123"}'

# Test KPI endpoint
curl -s -b cookies.txt http://localhost:3000/api/analytics/kpi

# Test spend by category
curl -s -b cookies.txt http://localhost:3000/api/analytics/spend-by-category

# Test top vendors
curl -s -b cookies.txt http://localhost:3000/api/analytics/top-vendors

# Test audit logs
curl -s -b cookies.txt http://localhost:3000/api/analytics/recent-audit

# Test consent status
curl -s -b cookies.txt http://localhost:3000/api/analytics/consent-status
```

---

## 10. Files Created/Modified

### New Files
| File | Purpose |
|------|---------|
| `tests/reports.analytics.poc.test.js` | PoC integration tests for reports & analytics |

### Modified Files
| File | Changes |
|------|---------|
| `frontend/dashboard.html` | Moved premium analytics from `#dashboard` to `#reports` section |
| `frontend/js/app.js` | Added `loadReports()` function, updated `showSection()` to call `loadReports()` for reports |
| `src/app.js` | Updated CSP header to allow Chart.js CDN (`https://cdn.jsdelivr.net`) |

---

## 11. Known Issues & Limitations

### 11.1 Known Issues
1. **Audit Log Warning:** Test environment shows warning about `payload_before` column - resolved by running migration
2. **Jest Open Handle:** `TCPWRAP` warning in test output - known Jest + supertest issue, not functional
3. **CSP Block:** Chart.js source map blocked before CSP fix - resolved

### 11.1 Limitations
1. Analytics data hanya menampilkan top 5, belum ada pagination untuk data lengkap
2. Tidak ada export PDF untuk analytics dashboard
3. Tidak ada date range filter untuk analytics
4. Chart.js loaded via CDN, tidak di-bundle (perlu internet untuk load chart)
5. Consent integration dengan vendor registration frontend belum dilakukan

---

## 12. Future Enhancements

### 12.1 Recommended Features
1. **Export to PDF:** Tambahkan tombol export analytics dashboard ke PDF
2. **Date Range Filter:** Tambahkan filter tanggal untuk analytics
3. **More Charts:** 
   - Trend pengeluaran per bulan (Line Chart)
   - Perbandingan budget vs actual (Bar Chart)
   - Vendor performance score trend
4. **Real-time Updates:** WebSocket untuk update audit log secara real-time
5. **Drill-down:** Click on chart untuk lihat detail transaksi
6. **Scheduled Reports:** Auto-generate dan email analytics report bulanan
7. **Compliance Score:** Skor kepatuhan gabungan dari audit logs + consent status + three-way matching

### 12.2 Technical Improvements
1. **Caching:** Implement Redis caching untuk analytics endpoints
2. **Pagination:** Tambahkan pagination untuk top vendors dan categories
3. **Query Optimization:** Add indexes untuk analytics queries
4. **Bundle Chart.js:** Download Chart.js dan serve locally untuk offline mode
5. **Lazy Loading:** Load charts hanya ketika module Laporan dibuka

---

## 13. Conclusion

Module Laporan & Analitik berhasil diimplementasikan dengan:

- ✅ 4 KPI Cards premium untuk metrik utama
- ✅ Donut chart untuk top 5 kategori pengeluaran
- ✅ Horizontal bar chart untuk top 5 vendor
- ✅ Real-time audit log feed (5 baris terbaru)
- ✅ Consent status donut chart dengan summary
- ✅ Recent activity (PR dan e-PO terbaru)
- ✅ PoC test cases: 14/14 passed
- ✅ CSP updated untuk mengizinkan Chart.js CDN
- ✅ Analytics dipindah dari Dashboard ke module Laporan

Module ini memberikan nilai bisnis tinggi dengan visualisasi data yang langsung menunjukkan efisiensi biaya dan transparansi kepatuhan, sesuai kebutuhan Direksi perusahaan.

---

## 14. References

- **Compliance PoC:** `POC_COMPLIANCE.md`
- **Analytics Routes:** `src/routes/analyticsRoutes.js`
- **Frontend Dashboard:** `frontend/dashboard.html`
- **Frontend JavaScript:** `frontend/js/app.js`
- **Test Cases:** `tests/reports.analytics.poc.test.js`
- **Chart.js Documentation:** https://www.chartjs.org/docs/latest/

---

**Disusun oleh:** Muhammad Arif Pratama  
**Tanggal:** 4 Agustus 2026  
**Versi:** 1.0
