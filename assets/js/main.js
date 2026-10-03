/**
 * SIAKAD ADMIN PANEL - MAIN APPLICATION SCRIPT
 * Mata Kuliah: Pemrograman Web 2 (Client-Side Programming)
 * Fitur: Manajemen Data LocalStorage, Sidebar Toggle, Toast Notification, Global Utilities
 */

// Mock Data Awal Siswa (Otomatis masuk ke LocalStorage jika belum ada)
const DEFAULT_STUDENTS = [
  {
    id: "STD-001",
    nisn: "0051234501",
    nama: "Muhammad Fadhil Pratama",
    gender: "L",
    kelas: "XII RPL 1",
    jurusan: "Rekayasa Perangkat Lunak",
    no_hp: "081234567890",
    alamat: "Jl. Merdeka No. 45, Bandung",
    status: "Aktif",
    nilaiRataRata: 88.5
  },
  {
    id: "STD-002",
    nisn: "0051234502",
    nama: "Adinda Putri Maharani",
    gender: "P",
    kelas: "XII RPL 1",
    jurusan: "Rekayasa Perangkat Lunak",
    no_hp: "081398765432",
    alamat: "Jl. Dago Atas No. 12, Bandung",
    status: "Aktif",
    nilaiRataRata: 92.4
  },
  {
    id: "STD-003",
    nisn: "0061234503",
    nama: "Rian Hidayat Santoso",
    gender: "L",
    kelas: "XI TKJ 2",
    jurusan: "Teknik Komputer & Jaringan",
    no_hp: "085678912345",
    alamat: "Jl. Cihampelas No. 88, Bandung",
    status: "Aktif",
    nilaiRataRata: 84.0
  },
  {
    id: "STD-004",
    nisn: "0061234504",
    nama: "Siti Nurhaliza Zahra",
    gender: "P",
    kelas: "XI TKJ 2",
    jurusan: "Teknik Komputer & Jaringan",
    no_hp: "082145678901",
    alamat: "Jl. Buah Batu No. 104, Bandung",
    status: "Aktif",
    nilaiRataRata: 89.2
  },
  {
    id: "STD-005",
    nisn: "0071234505",
    nama: "Bagas Arya Permana",
    gender: "L",
    kelas: "X MM 1",
    jurusan: "Multimedia / DKV",
    no_hp: "087812345678",
    alamat: "Jl. Setiabudhi No. 20, Bandung",
    status: "Aktif",
    nilaiRataRata: 79.5
  },
  {
    id: "STD-006",
    nisn: "0071234506",
    nama: "Clarissa Aurelia",
    gender: "P",
    kelas: "X MM 1",
    jurusan: "Multimedia / DKV",
    no_hp: "081987654321",
    alamat: "Jl. Riau No. 15, Bandung",
    status: "Nonaktif",
    nilaiRataRata: 75.0
  }
];

// Helper: Ambil Data Siswa dari LocalStorage
function getStudentsData() {
  const data = localStorage.getItem("siakad_students");
  if (!data) {
    localStorage.setItem("siakad_students", JSON.stringify(DEFAULT_STUDENTS));
    return DEFAULT_STUDENTS;
  }
  try {
    return JSON.parse(data);
  } catch (e) {
    return DEFAULT_STUDENTS;
  }
}

// Helper: Simpan Data Siswa ke LocalStorage
function saveStudentsData(students) {
  localStorage.setItem("siakad_students", JSON.stringify(students));
}

// Helper: Menampilkan Notifikasi Toast Glassmorphic
function showToast(message, type = "success") {
  let toastContainer = document.querySelector(".toast-container");
  if (!toastContainer) {
    toastContainer = document.createElement("div");
    toastContainer.className = "toast-container";
    document.body.appendChild(toastContainer);
  }

  const toast = document.createElement("div");
  toast.className = `toast ${type}`;

  const iconClass = type === "success" 
    ? "fa-circle-check text-success" 
    : type === "danger" 
    ? "fa-circle-xmark text-danger" 
    : "fa-triangle-exclamation text-warning";

  toast.innerHTML = `
    <i class="fa-solid ${iconClass}"></i>
    <div>
      <div style="font-weight: 600; font-size: 13px;">${message}</div>
    </div>
  `;

  toastContainer.appendChild(toast);

  setTimeout(() => {
    toast.style.opacity = "0";
    toast.style.transform = "translateX(100%)";
    toast.style.transition = "all 0.3s ease";
    setTimeout(() => toast.remove(), 300);
  }, 3500);
}

// Inisialisasi Event Saat Dokumen Siap
document.addEventListener("DOMContentLoaded", () => {
  // 1. Pastikan Mock Data Awal Terinisialisasi
  getStudentsData();

  // 2. Handler Toggle Sidebar Mobile
  const sidebarToggleBtn = document.getElementById("sidebarToggleBtn");
  const sidebar = document.querySelector(".sidebar");

  if (sidebarToggleBtn && sidebar) {
    sidebarToggleBtn.addEventListener("click", () => {
      sidebar.classList.toggle("mobile-active");
    });

    // Tutup sidebar jika klik di luar pada perangkat mobile
    document.addEventListener("click", (e) => {
      if (window.innerWidth <= 992) {
        if (!sidebar.contains(e.target) && !sidebarToggleBtn.contains(e.target)) {
          sidebar.classList.remove("mobile-active");
        }
      }
    });
  }

  // 3. Highlight Menu Aktif Sesuai Halaman URL
  const currentPath = window.location.pathname.split("/").pop();
  const navLinks = document.querySelectorAll(".nav-link");
  navLinks.forEach((link) => {
    const href = link.getAttribute("href");
    if (href && (href.endsWith(currentPath) || (currentPath === "" && href.includes("dashboard.html")))) {
      link.classList.add("active");
    }
  });

  // 4. Quick Logout Button Handler
  const logoutBtn = document.getElementById("btnLogout");
  if (logoutBtn) {
    logoutBtn.addEventListener("click", (e) => {
      e.preventDefault();
      if (confirm("Apakah Anda yakin ingin keluar dari sistem SIAKAD?")) {
        window.location.href = "../index.html";
      }
    });
  }
});
