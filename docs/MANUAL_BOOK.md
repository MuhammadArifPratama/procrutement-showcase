# Manual Book - Procrutmen
## Enterprise Procurement Management System

**Versi:** 1.1  
**Tanggal:** 4 Agustus 2026  
**Status:** Production Ready  

---

## Daftar Isi

1. [Pendahuluan](#1-pendahuluan)
2. [Login & Dashboard](#2-login--dashboard)
3. [Manajemen Vendor](#3-manajemen-vendor)
4. [Purchase Requisition (PR)](#4-purchase-requisition-pr)
5. [Purchase Order (e-PO)](#5-purchase-order-e-po)
6. [Invoice & Pembayaran](#6-invoice--pembayaran)
7. [Analytics Dashboard](#7-analytics-dashboard)
8. [Compliance & Privacy](#8-compliance--privacy)
9. [Manajemen User (Admin)](#9-manajemen-user-admin)
10. [FAQ & Troubleshooting](#10-faq--troubleshooting)

---

## 1. Pendahuluan

### 1.1 Tentang Procrutmen

Procrutmen adalah sistem manajemen pengadaan enterprise yang dirancang untuk mengotomatisasi dan menyederhanakan seluruh siklus pengadaan (procurement) di dalam perusahaan.

### 1.2 Target Pengguna

| Role | Deskripsi |
|------|-----------|
| Super Admin | Full system access, user management, system config |
| Admin | Full operational access, compliance, retention job |
| Manager | Approve PR, manage vendors, create PO, view analytics |
| Staff | Create PR, draft PR, view status, view analytics |
| Director | Approve high-value PR, view executive reports |
| Compliance | Audit logs, privacy notices, data retention policies |
| Finance | Invoice verification, three-way matching, payment voucher |
| Vendor | Own PO, confirm delivery, submit invoice |

### 1.3 Akses Aplikasi

- **URL:** http://localhost:3000
- **Browser:** Chrome, Firefox, Edge (rekomendasi Chrome)
- **Default Admin:** admin/admin123
- **Catatan:**
  - `http://localhost:3000` → menampilkan halaman landing/index
  - `http://localhost:3000/login` → menampilkan halaman login

---

## 2. Login & Dashboard

### 2.1 Login

1. Buka browser dan akses http://localhost:3000
2. Anda akan melihat halaman landing/index Procrutmen
3. Klik tombol **Masuk** atau **Masuk ke Sistem** untuk pergi ke halaman login
4. Atau langsung akses http://localhost:3000/login
5. Masukkan username dan password
6. Klik tombol **Login**

**Catatan:** Jika ini adalah login pertama Anda dan password harus diubah, sistem akan memaksa Anda mengganti password sebelum mengakses dashboard.

### 2.2 First Login - Ganti Password

1. Setelah login pertama, Anda akan melihat form ganti password
2. Masukkan password baru (minimal 6 karakter)
3. Konfirmasi password baru
4. Klik **Ganti Password**
5. Anda akan diarahkan ke dashboard

### 2.3 Dashboard

Dashboard menampilkan informasi penting:

- **KPI Cards:** Total PR, Total PO, Total Vendor, Total Invoice
- **Recent Activity:** PR terbaru, PO terbaru
- **Quick Actions:** Akses cepat ke fitur-fitur utama

### 2.4 Logout

1. Klik tombol **Logout** di pojok kanan atas
2. Anda akan diarahkan kembali ke halaman login

---

## 3. Manajemen Vendor

### 3.1 Daftar Vendor

1. Dari menu utama, pilih **Vendor ▸ Data Vendor**
2. Anda akan melihat daftar semua vendor
3. Fitur yang tersedia:
   - **Cari:** Cari vendor berdasarkan nama
   - **Filter:** Filter berdasarkan status (Aktif, Pending, Suspended, Blacklisted)
   - **Tambah Vendor:** Klik tombol **Tambah Vendor** untuk menambah vendor baru
   - **Lihat Detail:** Klik pada baris vendor untuk melihat detail
   - **Edit:** Klik ikon edit untuk mengubah data vendor
   - **Hapus:** Klik ikon hapus untuk menghapus vendor (hanya Admin)
   - **Evaluasi:** Klik ikon evaluasi untuk mengevaluasi kinerja vendor
   - **Terminate:** Klik ikon terminate untuk menghentikan kontrak (hanya Admin)

### 3.2 Registrasi Vendor

1. Klik tombol **Tambah Vendor**
2. Isi form dengan data vendor:
   - **Nama Perusahaan:** Nama lengkap vendor
   - **Email:** Email vendor
   - **Telepon:** Nomor telepon vendor
   - **Alamat:** Alamat lengkap vendor
   - **NPWP:** Nomor NPWP vendor
   - **NIB:** Nomor NIB vendor
   - **Status Pajak:** Badan / OP
   - **Kategori:** Kategori vendor (barang/jasa)
   - **Bank:** Nama bank, nomor rekening, atas nama rekening
3. Klik **Simpan**

### 3.3 Evaluasi Vendor

1. Buka detail vendor
2. Klik tab **Evaluasi** atau ikon evaluasi
3. Isi form evaluasi:
   - **Kualitas:** 1-5 bintang
   - **Ketepatan Waktu:** 1-5 bintang
   - **Kepatuhan:** 1-5 bintang
   - **Catatan:** Catatan tambahan
4. Klik **Simpan Evaluasi**

### 3.4 Rating Vendor

1. Buka detail vendor
2. Klik tombol **Beri Rating**
3. Pilih rating (1-5 bintang)
4. Tambahkan komentar (opsional)
5. Klik **Kirim Rating**

---

## 4. Purchase Requisition (PR)

### 4.1 Buat PR Baru

1. Dari menu utama, pilih **Pengadaan ▸ Permintaan (PR)**
2. Klik tombol **Buat PR Baru**
3. Isi form PR:
   - **Unit Bisnis:** Pilih unit bisnis pengguna
   - **Justifikasi:** Alasan pengadaan
   - **Budget Code:** Kode budget
   - **Items:** Tambahkan barang/jasa yang dibutuhkan
     - Klik **Tambah Item**
     - Isi nama barang, jumlah, satuan, harga satuan
     - Klik **Simpan Item**
   - **Total Amount:** Jumlah total akan dihitung otomatis
4. Klik **Kirim PR**

### 4.2 Draft PR

1. Ikuti langkah Buat PR Baru
2. Setelah mengisi form, klik **Simpan sebagai Draft**
3. PR akan disimpan dengan status DRAFT
4. Anda dapat melanjutkan pengeditan nanti

### 4.3 Approval Workflow

Sistem approval otomatis berdasarkan nilai PR:

| Nilai PR | Level Approval |
|----------|----------------|
| ≤ Rp 5.000.000 | Manager |
| Rp 5.000.001 - Rp 10.000.000 | Manager → Director |
| > Rp 10.000.000 | Manager → Director → Board |

### 4.4 Cek Status PR

1. Buka menu **Pengadaan ▸ Permintaan (PR)**
2. Lihat daftar PR dengan status:
   - **PENDING:** Menunggu approval
   - **APPROVED:** Disetujui
   - **REJECTED:** Ditolak
   - **DRAFT:** Belum dikirim
3. Klik pada PR untuk melihat detail dan timeline approval

### 4.5 Budget Check

1. Buka detail PR
2. Klik tab **Budget Check**
3. Sistem akan menampilkan:
   - Budget tersedia
   - Budget yang terpakai
   - Sisa budget
   - Status budget (Cukup / Tidak Cukup)

---

## 5. Purchase Order (e-PO)

### 5.1 Buat PO dari PR

1. Buka detail PR yang sudah APPROVED
2. Klik tombol **Buat PO**
3. Pilih vendor dari daftar
4. Isi form PO:
   - **Vendor:** Pilih vendor
   - **Total Amount:** Jumlah total PO
   - **Budget Type:** Tipe budget (OPEX / CAPEX)
   - **Delivery Deadline:** Batas waktu pengiriman
5. Klik **Kirim PO**

### 5.2 Kirim PO ke Vendor

1. Buka detail PO dengan status DRAFT
2. Klik tombol **Kirim ke Vendor**
3. Sistem akan mengirimkan e-PO ke email vendor
4. Status PO berubah menjadi SENT

### 5.3 Konfirmasi Penerimaan PO

1. Vendor menerima email e-PO
2. Vendor login ke sistem
3. Buka menu **e-PO Saya**
4. Klik **Konfirmasi Penerimaan**
5. Status PO berubah menjadi CONFIRMED

### 5.4 Tandai Sebagai Delivered

1. Setelah barang diterima, klik **Tandai Delivered**
2. Isi catatan penerimaan (opsional)
3. Klik **Simpan**
4. Status PO berubah menjadi DELIVERED

### 5.5 Cetak PO

1. Buka detail PO
2. Klik tombol **Cetak PDF**
3. File PDF akan diunduh

---

## 6. Invoice & Pembayaran

### 6.1 Buat Invoice

1. Dari menu utama, pilih **Invoice**
2. Klik tombol **Buat Invoice**
3. Isi form invoice:
   - **Nomor Invoice:** Nomor invoice dari vendor
   - **PO:** Pilih PO terkait
   - **Vendor:** Pilih vendor
   - **Jumlah:** Jumlah invoice
   - **Tanggal Jatuh Tempo:** Tanggal pembayaran
4. Klik **Simpan**

### 6.2 Three-Way Matching

Three-Way Matching adalah proses verifikasi otomatis yang memastikan ketiga dokumen berikut cocok sebelum pembayaran:
1. **PO (Purchase Order)** — Pesanan pembelian yang telah dikirim ke vendor
2. **GRN (Goods Receipt Note)** — Bukti penerimaan barang
3. **Invoice** — Tagihan dari vendor

#### Langkah-langkah Three-Way Matching

1. Pastikan PO sudah dalam status **DELIVERED**
2. Buka menu **Invoice ▸ Three-Way Match**
3. Pilih **PO**, **GRN**, dan **Invoice** yang akan dicocokkan
4. Klik **Mulai Matching**
5. Sistem akan memeriksa 3 kondisi:

| Check | Deskripsi | Logika |
|-------|-----------|--------|
| **Amount Match** | Jumlah di PO sama dengan jumlah di Invoice | `po.total_amount === invoice.amount` |
| **Quantity Match** | Item dan jumlah barang di GRN sama dengan PO | `JSON.stringify(grn.items) === JSON.stringify(po.items)` |
| **GRN Match** | Semua item di PO telah diterima | `grn.items.length === po.items.length` |

6. Hasil matching akan ditampilkan:

| Status | Arti |
|--------|------|
| **MATCHED** | Semua pengecekan berhasil, invoice siap dibayar |
| **MISMATCHED** | Ada perbedaan antara PO, GRN, dan/atau Invoice |

#### Contoh Skenario

**Skenario 1: MATCHED**
- PO: Rp 10.000.000, 10 unit barang
- GRN: 10 unit barang diterima
- Invoice: Rp 10.000.000
- Hasil: **MATCHED** ✅

**Skenario 2: MISMATCHED (Amount)**
- PO: Rp 10.000.000
- Invoice: Rp 9.500.000
- Hasil: **MISMATCHED** ❌ (Amount tidak cocok)

**Skenario 3: MISMATCHED (Quantity)**
- PO: 10 unit barang
- GRN: 8 unit barang diterima
- Hasil: **MISMATCHED** ❌ (Quantity tidak cocok)

#### Role yang Bisa Melakukan Three-Way Matching
- ADMIN
- SUPER_ADMIN
- FINANCE
- MANAGER

#### Setelah Three-Way Match Berhasil
- Status invoice berubah menjadi **MATCHED**
- Anda dapat mencetak **Payment Voucher** sebagai bukti pembayaran
- Pembayaran dapat diproses oleh Finance

### 6.3 GRN (Goods Receipt Note)

1. Buka detail PO yang sudah DELIVERED
2. Klik tab **GRN**
3. Klik **Buat GRN**
4. Isi form GRN:
   - **Diterima Oleh:** Nama penerima
   - **Catatan:** Catatan penerimaan
5. Klik **Simpan GRN**

### 6.4 Payment Voucher

1. Setelah three-way match berhasil
2. Buka detail invoice
3. Klik **Cetak Payment Voucher**
4. File PDF akan diunduh

---

## 7. Analytics Dashboard

### 7.1 KPI Cards

Dashboard menampilkan KPI utama:
- **Total Penghematan:** Jumlah penghematan dari e-auction
- **Efisiensi Waktu Siklus:** Rata-rata waktu siklus pengadaan
- **Total Vendor Aktif:** Jumlah vendor dengan status aktif
- **Tingkat Kepatuhan:** Persentase kepatuhan vendor

### 7.2 Grafik

- **Top 5 Kategori Pengeluaran:** Grafik batang kategori pengeluaran terbesar
- **Top 5 Vendor by Transaksi:** Grafik batang vendor dengan transaksi terbanyak

### 7.3 Compliance Widgets

- **Audit Log Feed:** Log audit terbaru
- **Consent Status:** Status persetujuan data pengguna

### 7.4 Recent Activity

- **PR Terbaru:** 5 PR terbaru yang dibuat
- **e-PO Terbaru:** 5 e-PO terbaru yang dibuat

---

## 8. Compliance & Privacy

### 8.1 Privacy Notice

1. Buka menu **Compliance ▸ Privacy Notice**
2. Baca kebijakan privasi terbaru
3. Anda akan diminta untuk memberikan persetujuan

### 8.2 Beri Consent

1. Setelah membaca privacy notice
2. Klik **Setuju** untuk memberikan persetujuan
3. Consent Anda akan tercatat di sistem

### 8.3 Withdraw Consent

1. Buka menu **Compliance ▸ Consent Saya**
2. Klik **Tarik Persetujuan**
3. Konfirmasi penarikan consent

### 8.4 Export Data Pribadi

1. Buka menu **Compliance ▸ Data Saya**
2. Klik **Export Data Pribadi**
3. Sistem akan mengirimkan data Anda dalam format JSON

### 8.5 Update Profil

1. Buka menu **Compliance ▸ Update Profil**
2. Ubah data yang ingin diperbarui
3. Klik **Simpan Perubahan**

### 8.6 Delete Request

1. Buka menu **Compliance ▸ Hapus Akun**
2. Isi alasan penghapusan
3. Klik **Ajukan Penghapusan**
4. Permintaan Anda akan diproses oleh Admin

---

## 9. Manajemen User (Admin)

### 9.1 Daftar User

1. Login sebagai **Admin** atau **Super Admin**
2. Buka menu **Admin ▸ Manajemen User**
3. Anda akan melihat daftar semua user

### 9.2 Tambah User

1. Klik tombol **Tambah User**
2. Isi form user:
   - **Username:** Username unik untuk login
   - **Email:** Email user
   - **Role:** Pilih role (STAFF, MANAGER, ADMIN, DIRECTOR, COMPLIANCE, FINANCE, VENDOR)
   - **Password:** Password awal
   - **Force Change Password:** Centang jika user harus mengganti password pada login pertama
3. Klik **Simpan**

### 9.3 Edit User

1. Buka daftar user
2. Klik ikon edit pada user yang ingin diubah
3. Ubah data yang diperlukan
4. Klik **Simpan Perubahan**

### 9.4 Hapus User

1. Buka daftar user
2. Klik ikon hapus pada user yang ingin dihapus
3. Konfirmasi penghapusan

### 9.5 Force Password Change

Admin dapat memaksa user mengganti password:
1. Edit user
2. Centang **Force Change Password**
3. Simpan perubahan
4. User harus mengganti password pada login berikutnya

---

## 10. FAQ & Troubleshooting

### 10.1 Login Issues

**Q: Tidak bisa login, password salah?**  
A: Hubungi Admin untuk reset password.

**Q: Akun terkunci?**  
A: Hubungi Admin untuk membuka kunci akun.

### 10.2 PR Issues

**Q: PR tidak bisa di-approve?**  
A: Pastikan Anda memiliki role yang sesuai (MANAGER, DIRECTOR, ADMIN, SUPER_ADMIN).

**Q: Budget tidak cukup?**  
A: Hubungi Finance untuk menambah budget atau pilih budget code yang berbeda.

### 10.3 PO Issues

**Q: Tidak bisa buat PO?**  
A: Hanya ADMIN, SUPER_ADMIN, dan MANAGER yang bisa membuat PO.

**Q: Vendor tidak menerima email PO?**  
A: Periksa spam folder vendor atau hubungi vendor untuk memastikan email benar.

### 10.4 Invoice Issues

**Q: Three-way match gagal?**  
A: Pastikan PO, GRN, dan Invoice tersedia dan sesuai.

### 10.5 Browser Issues

**Q: Halaman tidak loading?**  
A: Hard refresh browser (Ctrl + Shift + R) atau clear cache.

**Q: Chart tidak muncul?**  
A: Pastikan JavaScript diaktifkan dan tidak ada error di console browser.

---

## Kontak

**Developer:** Muhammad Arif Pratama  
**Email:** arifpratama5@gmail.com  
**Tanggal:** 4 Agustus 2026
