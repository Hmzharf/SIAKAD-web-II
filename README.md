# SIAKAD ADMIN PANEL - SISTEM INFORMASI AKADEMIK SEKOLAH
> **Tugas 1: Project-Based Learning**  
> **Mata Kuliah:** Pemrograman Web 2 (Client-Side Programming)  
> **Topik:** No. 3 - Sistem Informasi Akademik Sekolah (SIAKAD)  
> **Tema Visual:** Glassmorphism Modern  

---

## 🌟 Gambaran Proyek

Proyek ini merupakan implementasi antarmuka (**Front-End Admin Panel**) untuk **Sistem Informasi Akademik Sekolah (SIAKAD)** berbasis *Client-Side Programming murni* (HTML5, CSS3, dan Vanilla JavaScript) tanpa dependensi server back-end.

Aplikasi mengusung tema estetika **Glassmorphism**, yang dicirikan dengan kartu panel transparan bertekstur kaca (`backdrop-filter: blur()`), border tipis elegan, pencahayaan glow modern, serta layout responsif yang ramah perangkat seluler.

---

## 🗂️ Struktur Folder Proyek

```
D:\siakad-admin/
├── docs/
│   └── perancangan.md         <-- Milestone 1 (Menu, ER-D Mermaid, Design System, Wireframe)
├── assets/
│   ├── css/
│   │   └── style.css          <-- Styling Glassmorphism, Responsive Grid, Modals, Print Styles
│   ├── js/
│   │   ├── main.js            <-- Core App (LocalStorage sync, Sidebar toggle, Toasts)
│   │   ├── dashboard.js       <-- Chart.js Line & Bar Chart visualisasi data
│   │   ├── data-master.js     <-- CRUD Client-side (Live search, Filter, Modal Edit/Hapus)
│   │   └── form-validation.js <-- Validasi form interaktif realtime
│   └── img/                   <-- Folder aset gambar/ikon
├── pages/
│   ├── layout.html            <-- Milestone 2: Master/Template dasar layout responsif
│   ├── dashboard.html         <-- Milestone 3: Statistik ringkasan, 2 grafik Chart.js, agenda
│   ├── data-master.html       <-- Milestone 3: Tabel data siswa, filter, search, modal aksi
│   ├── form.html              <-- Milestone 3: Formulir tambah siswa + validasi realtime
│   └── laporan.html           <-- Milestone 3: Rapor rekapitulasi nilai + siap cetak (Print mode)
├── index.html                 <-- Halaman Login Portal SIAKAD
└── README.md                  <-- Dokumentasi & panduan penggunaan
```

---

## 🚀 Fitur Unggulan Tiap Halaman

### 1. Halaman Login (`index.html`)
- Kartu otentikasi Glassmorphic dengan orbs ambient beranimasi di latar belakang.
- Validasi input client-side.
- Fitur *Show/Hide Password* interaktif.
- **Kredensial Demo Penguji / Dosen:**
  - **Username:** `admin`
  - **Password:** `password123`

### 2. Dashboard (`pages/dashboard.html`)
- 4 Kartu Statistik Dinamis (Total Siswa, Tenaga Pendidik, Rombel Aktif, Rata-rata Kehadiran).
- **Grafik Tren Kehadiran Siswa** (Line Chart menggunakan Chart.js dengan area fill dan tooltip interaktif).
- **Grafik Distribusi Nilai per Jurusan** (Bar Chart perbandingan teori vs praktik).
- Jadwal & agenda akademik sekolah terdekat.

### 3. Master Data Siswa (`pages/data-master.html`)
- Tabel data dinamis yang otomatis mengambil data dari `LocalStorage` browser.
- **Live Search Input:** Pencarian instan berdasarkan Nama Siswa atau NISN tanpa reload.
- **Dropdown Filter:** Penyaringan data berdasarkan Jurusan dan Status Siswa.
- **Modal Konfirmasi Hapus:** Modal pop-up kaca untuk konfirmasi hapus data.
- **Modal Edit Cepat:** Modal pop-up untuk mengedit informasi siswa langsung.

### 4. Formulir Tambah Siswa (`pages/form.html`)
- Formulir 2-kolom responsif.
- **Validasi Real-time JavaScript:**
  - Format NISN harus 10 digit angka resmi.
  - Nama minimal 3 karakter.
  - No. HP 10-13 digit angka.
  - Alamat minimal 5 karakter.
  - Notifikasi visual feedback warna merah/hijau secara langsung saat mengetik.
- Data otomatis tersimpan secara persisten ke `LocalStorage` dan langsung muncul di tabel.

### 5. Laporan & Rapor Akademik (`pages/laporan.html`)
- Rangkuman nilai kumulatif rapor siswa per mata pelajaran (Web, Basis Data, PBO, Bahasa Inggris).
- Status ketuntasan belajar otomatis (Tuntas / Remedial).
- **Mode Cetak Siap Pakai (`window.print()`):** Dilengkapi kop surat resmi sekolah (`@media print`) yang otomatis menyembunyikan sidebar, header, dan tombol navigasi saat diprint atau diekspor ke PDF.
- **Ekspor CSV:** Fitur unduh rekap data nilai ke format file `.csv`.

---

## 💻 Cara Menjalankan Proyek di Komputer Lokal

1. Buka folder `D:\siakad-admin`.
2. Klik dua kali pada file `index.html` untuk langsung membukanya di browser (Google Chrome, Microsoft Edge, Firefox, dll).
3. Atau buka folder `D:\siakad-admin` menggunakan **VS Code**, lalu klik kanan pada `index.html` dan pilih **"Open with Live Server"**.

---

## 🌐 Panduan Upload ke GitHub & Vercel (Pengumpulan Tugas)

### 1. Upload ke GitHub
Jalankan perintah berikut di terminal (PowerShell) pada folder `D:\siakad-admin`:
```bash
git init
git add .
git commit -m "feat: complete milestone 1, 2, and 3 for SIAKAD admin panel"
git branch -M main
git remote add origin https://github.com/USERNAME-ANDA/siakad-admin-panel.git
git push -u origin main
```

### 2. Deploy ke Vercel / GitHub Pages
- **Vercel:**
  1. Kunjungi [vercel.com](https://vercel.com) dan login dengan akun GitHub Anda.
  2. Klik **"Add New Project"** dan pilih repositori `siakad-admin-panel`.
  3. Klik **Deploy**. Website Anda langsung live dengan link publik gratis (contoh: `siakad-admin.vercel.app`).
- **GitHub Pages:**
  1. Buka pengaturan repositori GitHub Anda -> tab **Settings** -> **Pages**.
  2. Pada bagian *Branch*, pilih `main` dan folder `/ (root)`, lalu klik **Save**.
