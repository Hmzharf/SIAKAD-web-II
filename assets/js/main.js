/**
 * SIAKAD ADMIN PANEL - MAIN APPLICATION SCRIPT
 * Mata Kuliah: Pemrograman Web 2 (Client-Side Programming)
 * Fitur: Manajemen Data LocalStorage (Siswa, Guru, Kelas), Sidebar Mobile Drawer & Backdrop, Toast Notification, Global Utilities
 */

// ==========================================================================
// 1. MOCK DATA AWAL (SISWA, GURU, KELAS)
// ==========================================================================

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

const DEFAULT_TEACHERS = [
  {
    id: "TCH-001",
    nip: "198503152010011002",
    nama: "Drs. Bambang Sudarsono, M.Kom",
    gender: "L",
    mapel: "Pemrograman Web & Perangkat Bergerak",
    no_hp: "081223344556",
    email: "bambang.sudarsono@smkunggul.sch.id",
    status: "PNS",
    kepegawaian: "Aktif"
  },
  {
    id: "TCH-002",
    nip: "199008222015022004",
    nama: "Siti Rahmawati, S.Pd., M.T.",
    gender: "P",
    mapel: "Basis Data & Cloud Computing",
    no_hp: "081334455667",
    email: "siti.rahmawati@smkunggul.sch.id",
    status: "PNS",
    kepegawaian: "Aktif"
  },
  {
    id: "TCH-003",
    nip: "198811042014031001",
    nama: "Ahmad Fauzi, S.T.",
    gender: "L",
    mapel: "Administrasi Infrastruktur Jaringan (AIJ)",
    no_hp: "085645566778",
    email: "ahmad.fauzi@smkunggul.sch.id",
    status: "PPPK",
    kepegawaian: "Aktif"
  },
  {
    id: "TCH-004",
    nip: "199304192019012003",
    nama: "Nurul Hidayati, M.Pd.",
    gender: "P",
    mapel: "Bahasa Inggris Komunikasi Bisnis",
    no_hp: "082156677889",
    email: "nurul.hidayati@smkunggul.sch.id",
    status: "PPPK",
    kepegawaian: "Aktif"
  },
  {
    id: "TCH-005",
    nip: "198201202008011005",
    nama: "Ir. Hendra Gunawan, M.T.",
    gender: "L",
    mapel: "Pemrograman Berorientasi Objek (PBO)",
    no_hp: "087867788990",
    email: "hendra.gunawan@smkunggul.sch.id",
    status: "PNS",
    kepegawaian: "Aktif"
  },
  {
    id: "TCH-006",
    nip: "199507122021022005",
    nama: "Dewi Anggraini, S.Sn.",
    gender: "P",
    mapel: "Desain Grafis Percetakan & Animasi 2D",
    no_hp: "081978899001",
    email: "dewi.anggraini@smkunggul.sch.id",
    status: "Honorer",
    kepegawaian: "Aktif"
  }
];

const DEFAULT_CLASSES = [
  {
    id: "KLS-001",
    kode: "XII-RPL-1",
    nama: "XII RPL 1",
    tingkat: "XII",
    jurusan: "Rekayasa Perangkat Lunak",
    waliKelas: "Drs. Bambang Sudarsono, M.Kom",
    jumlahSiswa: 36,
    kapasitas: 36,
    ruangan: "Lab RPL 1 (Gd. B Lt. 2)"
  },
  {
    id: "KLS-002",
    kode: "XII-RPL-2",
    nama: "XII RPL 2",
    tingkat: "XII",
    jurusan: "Rekayasa Perangkat Lunak",
    waliKelas: "Ir. Hendra Gunawan, M.T.",
    jumlahSiswa: 35,
    kapasitas: 36,
    ruangan: "Lab RPL 2 (Gd. B Lt. 2)"
  },
  {
    id: "KLS-003",
    kode: "XI-TKJ-1",
    nama: "XI TKJ 1",
    tingkat: "XI",
    jurusan: "Teknik Komputer & Jaringan",
    waliKelas: "Ahmad Fauzi, S.T.",
    jumlahSiswa: 34,
    kapasitas: 36,
    ruangan: "Lab Jaringan (Gd. C Lt. 1)"
  },
  {
    id: "KLS-004",
    kode: "XI-TKJ-2",
    nama: "XI TKJ 2",
    tingkat: "XI",
    jurusan: "Teknik Komputer & Jaringan",
    waliKelas: "Siti Rahmawati, S.Pd., M.T.",
    jumlahSiswa: 36,
    kapasitas: 36,
    ruangan: "Lab Server (Gd. C Lt. 2)"
  },
  {
    id: "KLS-005",
    kode: "X-MM-1",
    nama: "X MM 1",
    tingkat: "X",
    jurusan: "Multimedia / DKV",
    waliKelas: "Dewi Anggraini, S.Sn.",
    jumlahSiswa: 35,
    kapasitas: 36,
    ruangan: "Studio Multimedia (Gd. D Lt. 1)"
  },
  {
    id: "KLS-006",
    kode: "X-RPL-1",
    nama: "X RPL 1",
    tingkat: "X",
    jurusan: "Rekayasa Perangkat Lunak",
    waliKelas: "Nurul Hidayati, M.Pd.",
    jumlahSiswa: 36,
    kapasitas: 36,
    ruangan: "Ruang Teori 102 (Gd. A Lt. 1)"
  }
];

// ==========================================================================
// 2. HELPER LOCALSTORAGE ACCESSORS
// ==========================================================================

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

function saveStudentsData(students) {
  localStorage.setItem("siakad_students", JSON.stringify(students));
}

function getTeachersData() {
  const data = localStorage.getItem("siakad_teachers");
  if (!data) {
    localStorage.setItem("siakad_teachers", JSON.stringify(DEFAULT_TEACHERS));
    return DEFAULT_TEACHERS;
  }
  try {
    return JSON.parse(data);
  } catch (e) {
    return DEFAULT_TEACHERS;
  }
}

function saveTeachersData(teachers) {
  localStorage.setItem("siakad_teachers", JSON.stringify(teachers));
}

function getClassesData() {
  const data = localStorage.getItem("siakad_classes");
  if (!data) {
    localStorage.setItem("siakad_classes", JSON.stringify(DEFAULT_CLASSES));
    return DEFAULT_CLASSES;
  }
  try {
    return JSON.parse(data);
  } catch (e) {
    return DEFAULT_CLASSES;
  }
}

function saveClassesData(classes) {
  localStorage.setItem("siakad_classes", JSON.stringify(classes));
}

// ==========================================================================
// 3. TOAST NOTIFICATION
// ==========================================================================

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

// ==========================================================================
// 4. INISIALISASI & SIDEBAR MOBILE DRAWER
// ==========================================================================

document.addEventListener("DOMContentLoaded", () => {
  // Inisialisasi Mock Data jika belum ada
  getStudentsData();
  getTeachersData();
  getClassesData();

  // Setup Mobile Drawer & Backdrop
  setupMobileDrawer();

  // Highlight menu aktif sesuai URL
  highlightActiveMenu();

  // Setup tombol logout
  setupLogoutButton();
});

function setupMobileDrawer() {
  const sidebar = document.querySelector(".sidebar");
  const sidebarToggleBtn = document.getElementById("sidebarToggleBtn");

  if (!sidebar) return;

  // Buat backdrop dinamis jika belum ada
  let backdrop = document.querySelector(".sidebar-backdrop");
  if (!backdrop) {
    backdrop = document.createElement("div");
    backdrop.className = "sidebar-backdrop";
    document.body.appendChild(backdrop);
  }

  // Tambahkan tombol close (X) di dalam sidebar khusus mobile jika belum ada
  let sidebarBrand = sidebar.querySelector(".sidebar-brand");
  if (sidebarBrand && !sidebar.querySelector(".sidebar-mobile-close")) {
    const closeBtn = document.createElement("button");
    closeBtn.className = "sidebar-mobile-close";
    closeBtn.innerHTML = '<i class="fa-solid fa-xmark"></i>';
    closeBtn.setAttribute("title", "Tutup Menu");
    closeBtn.addEventListener("click", closeSidebar);
    sidebarBrand.appendChild(closeBtn);
  }

  function openSidebar() {
    sidebar.classList.add("mobile-active");
    backdrop.classList.add("active");
    document.body.classList.add("sidebar-open-locked");
  }

  function closeSidebar() {
    sidebar.classList.remove("mobile-active");
    backdrop.classList.remove("active");
    document.body.classList.remove("sidebar-open-locked");
  }

  if (sidebarToggleBtn) {
    sidebarToggleBtn.addEventListener("click", (e) => {
      e.stopPropagation();
      if (sidebar.classList.contains("mobile-active")) {
        closeSidebar();
      } else {
        openSidebar();
      }
    });
  }

  backdrop.addEventListener("click", closeSidebar);

  // Tutup sidebar jika salah satu link navigasi diklik di mobile
  const navLinks = sidebar.querySelectorAll(".nav-link");
  navLinks.forEach((link) => {
    link.addEventListener("click", () => {
      if (window.innerWidth <= 992) {
        closeSidebar();
      }
    });
  });

  // Tutup sidebar jika tekan tombol Escape
  document.addEventListener("keydown", (e) => {
    if (e.key === "Escape" && sidebar.classList.contains("mobile-active")) {
      closeSidebar();
    }
  });

  // Reset class jika ukuran layar di-resize ke desktop
  window.addEventListener("resize", () => {
    if (window.innerWidth > 992 && sidebar.classList.contains("mobile-active")) {
      closeSidebar();
    }
  });
}

function highlightActiveMenu() {
  const currentPath = window.location.pathname.split("/").pop();
  const navLinks = document.querySelectorAll(".nav-link");

  navLinks.forEach((link) => {
    const href = link.getAttribute("href");
    if (!href) return;

    link.classList.remove("active");

    const linkFile = href.split("/").pop();
    if (linkFile === currentPath || (currentPath === "" && linkFile === "dashboard.html")) {
      link.classList.add("active");
    }
  });
}

function setupLogoutButton() {
  const logoutBtn = document.getElementById("btnLogout");
  if (logoutBtn) {
    logoutBtn.addEventListener("click", (e) => {
      e.preventDefault();
      if (confirm("Apakah Anda yakin ingin keluar dari sistem SIAKAD?")) {
        // Redirect ke login index.html
        if (window.location.pathname.includes("/pages/")) {
          window.location.href = "../index.html";
        } else {
          window.location.href = "index.html";
        }
      }
    });
  }
}
