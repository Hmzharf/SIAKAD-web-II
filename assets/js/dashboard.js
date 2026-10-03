/**
 * SIAKAD ADMIN PANEL - DASHBOARD SCRIPT
 * Integrasi Chart.js untuk visualisasi grafik client-side & sinkronisasi data statistik
 */

document.addEventListener("DOMContentLoaded", () => {
  // 1. Update Counter Statistik dari LocalStorage
  updateDashboardStats();

  // 2. Inisialisasi Chart.js
  initAttendanceChart();
  initGradeDistributionChart();
});

function updateDashboardStats() {
  const students = getStudentsData();
  const totalStudentsEl = document.getElementById("statTotalStudents");
  const activeStudentsEl = document.getElementById("statActiveStudents");

  if (totalStudentsEl) {
    totalStudentsEl.textContent = students.length;
  }

  if (activeStudentsEl) {
    const activeCount = students.filter(s => s.status === "Aktif").length;
    activeStudentsEl.textContent = `${activeCount} Siswa`;
  }
}

// Grafik 1: Tren Rata-rata Kehadiran Siswa (Line Chart)
function initAttendanceChart() {
  const ctx = document.getElementById("attendanceChart");
  if (!ctx) return;

  new Chart(ctx, {
    type: "line",
    data: {
      labels: ["Juli", "Agustus", "September", "Oktober", "November", "Desember"],
      datasets: [
        {
          label: "Tingkat Kehadiran (%)",
          data: [94.5, 96.2, 95.0, 97.8, 96.4, 98.1],
          borderColor: "#4cc9f0",
          backgroundColor: "rgba(76, 201, 240, 0.15)",
          borderWidth: 3,
          fill: true,
          tension: 0.4,
          pointBackgroundColor: "#4cc9f0",
          pointBorderColor: "#fff",
          pointBorderWidth: 2,
          pointRadius: 5,
          pointHoverRadius: 7
        },
        {
          label: "Target Minimum (%)",
          data: [90, 90, 90, 90, 90, 90],
          borderColor: "rgba(255, 255, 255, 0.25)",
          borderDash: [5, 5],
          borderWidth: 2,
          fill: false,
          pointRadius: 0
        }
      ]
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      plugins: {
        legend: {
          labels: {
            color: "#cbd5e1",
            font: { family: "'Plus Jakarta Sans', sans-serif", size: 12 }
          }
        },
        tooltip: {
          backgroundColor: "rgba(18, 28, 51, 0.9)",
          titleColor: "#fff",
          bodyColor: "#4cc9f0",
          borderColor: "rgba(255, 255, 255, 0.15)",
          borderWidth: 1,
          padding: 12
        }
      },
      scales: {
        x: {
          grid: { color: "rgba(255, 255, 255, 0.05)" },
          ticks: { color: "#94a3b8" }
        },
        y: {
          min: 80,
          max: 100,
          grid: { color: "rgba(255, 255, 255, 0.05)" },
          ticks: {
            color: "#94a3b8",
            callback: (val) => val + "%"
          }
        }
      }
    }
  });
}

// Grafik 2: Rata-Rata Nilai per Jurusan (Bar Chart)
function initGradeDistributionChart() {
  const ctx = document.getElementById("gradeChart");
  if (!ctx) return;

  new Chart(ctx, {
    type: "bar",
    data: {
      labels: ["RPL", "TKJ", "Multimedia", "Akuntansi", "OTKP"],
      datasets: [
        {
          label: "Rata-rata Nilai Teori",
          data: [86.5, 83.2, 81.8, 85.0, 82.4],
          backgroundColor: "rgba(67, 97, 238, 0.7)",
          borderColor: "#4361ee",
          borderWidth: 1,
          borderRadius: 6
        },
        {
          label: "Rata-rata Nilai Praktik",
          data: [91.2, 88.0, 89.5, 84.5, 86.0],
          backgroundColor: "rgba(6, 214, 160, 0.7)",
          borderColor: "#06d6a0",
          borderWidth: 1,
          borderRadius: 6
        }
      ]
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      plugins: {
        legend: {
          labels: {
            color: "#cbd5e1",
            font: { family: "'Plus Jakarta Sans', sans-serif", size: 11 }
          }
        },
        tooltip: {
          backgroundColor: "rgba(18, 28, 51, 0.9)",
          titleColor: "#fff",
          borderColor: "rgba(255, 255, 255, 0.15)",
          borderWidth: 1,
          padding: 10
        }
      },
      scales: {
        x: {
          grid: { display: false },
          ticks: { color: "#94a3b8" }
        },
        y: {
          min: 60,
          max: 100,
          grid: { color: "rgba(255, 255, 255, 0.05)" },
          ticks: { color: "#94a3b8" }
        }
      }
    }
  });
}
