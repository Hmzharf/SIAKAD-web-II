/**
 * SIAKAD ADMIN PANEL - DATA MASTER SISWA SCRIPT
 * CRUD Interaktif Client-Side (Search, Filter, Modal Edit & Hapus dengan LocalStorage)
 */

let currentDeleteId = null;

document.addEventListener("DOMContentLoaded", () => {
  renderStudentTable();
  setupFilters();
  setupModals();
});

// Render Data Tabel Siswa
function renderStudentTable(dataToRender = null) {
  const students = dataToRender || getStudentsData();
  const tableBody = document.getElementById("studentTableBody");
  const totalCountEl = document.getElementById("totalRecordCount");

  if (!tableBody) return;

  if (totalCountEl) {
    totalCountEl.textContent = `${students.length} Data Siswa`;
  }

  if (students.length === 0) {
    tableBody.innerHTML = `
      <tr>
        <td colspan="7" style="text-align: center; padding: 40px; color: var(--text-muted);">
          <i class="fa-solid fa-folder-open" style="font-size: 36px; margin-bottom: 12px; display: block; opacity: 0.5;"></i>
          Tidak ada data siswa yang cocok dengan filter atau pencarian.
        </td>
      </tr>
    `;
    return;
  }

  tableBody.innerHTML = students.map((student, index) => {
    const initials = student.nama
      .split(" ")
      .map(n => n[0])
      .slice(0, 2)
      .join("")
      .toUpperCase();

    const badgeClass = student.status === "Aktif" ? "badge-success" : "badge-danger";
    const genderBadge = student.gender === "L" 
      ? '<span class="badge badge-cyan"><i class="fa-solid fa-mars"></i> L</span>' 
      : '<span class="badge" style="background: rgba(247, 37, 133, 0.15); color: #f72585; border: 1px solid rgba(247, 37, 133, 0.35);"><i class="fa-solid fa-venus"></i> P</span>';

    return `
      <tr>
        <td style="font-weight: 600; color: var(--text-muted); width: 40px;">${index + 1}</td>
        <td>
          <div class="student-meta">
            <div class="student-meta-avatar">${initials}</div>
            <div>
              <div class="student-name">${escapeHtml(student.nama)}</div>
              <div class="student-nisn">NISN: ${escapeHtml(student.nisn)}</div>
            </div>
          </div>
        </td>
        <td>${genderBadge}</td>
        <td>
          <div style="font-weight: 600; color: #fff;">${escapeHtml(student.kelas)}</div>
          <div style="font-size: 11.5px; color: var(--text-muted);">${escapeHtml(student.jurusan)}</div>
        </td>
        <td>
          <i class="fa-solid fa-phone" style="font-size: 11px; margin-right: 6px; color: var(--accent-cyan);"></i>
          ${escapeHtml(student.no_hp || "-")}
        </td>
        <td>
          <span class="badge ${badgeClass}">
            <i class="fa-solid ${student.status === "Aktif" ? "fa-circle-check" : "fa-circle-xmark"}"></i>
            ${escapeHtml(student.status)}
          </span>
        </td>
        <td>
          <div class="action-buttons">
            <button class="btn-action edit" title="Edit Data" onclick="openEditModal('${student.id}')">
              <i class="fa-solid fa-pen-to-square"></i>
            </button>
            <button class="btn-action delete" title="Hapus Data" onclick="confirmDeleteStudent('${student.id}')">
              <i class="fa-solid fa-trash-can"></i>
            </button>
          </div>
        </td>
      </tr>
    `;
  }).join("");
}

// Setup Fitur Filter dan Pencarian Real-Time
function setupFilters() {
  const searchInput = document.getElementById("searchStudentInput");
  const filterJurusan = document.getElementById("filterJurusan");
  const filterStatus = document.getElementById("filterStatus");

  function applyFilters() {
    const query = searchInput ? searchInput.value.toLowerCase().trim() : "";
    const selectedJurusan = filterJurusan ? filterJurusan.value : "";
    const selectedStatus = filterStatus ? filterStatus.value : "";

    const allStudents = getStudentsData();

    const filtered = allStudents.filter(student => {
      const matchQuery = student.nama.toLowerCase().includes(query) || student.nisn.includes(query);
      const matchJurusan = !selectedJurusan || student.jurusan === selectedJurusan;
      const matchStatus = !selectedStatus || student.status === selectedStatus;
      return matchQuery && matchJurusan && matchStatus;
    });

    renderStudentTable(filtered);
  }

  if (searchInput) searchInput.addEventListener("input", applyFilters);
  if (filterJurusan) filterJurusan.addEventListener("change", applyFilters);
  if (filterStatus) filterStatus.addEventListener("change", applyFilters);
}

// Setup Modal Konfirmasi Hapus & Edit
function setupModals() {
  // Modal Hapus
  const deleteModal = document.getElementById("deleteModal");
  const btnCancelDelete = document.getElementById("btnCancelDelete");
  const btnConfirmDelete = document.getElementById("btnConfirmDelete");

  if (btnCancelDelete && deleteModal) {
    btnCancelDelete.addEventListener("click", () => {
      deleteModal.classList.remove("active");
      currentDeleteId = null;
    });
  }

  if (btnConfirmDelete && deleteModal) {
    btnConfirmDelete.addEventListener("click", () => {
      if (currentDeleteId) {
        let students = getStudentsData();
        students = students.filter(s => s.id !== currentDeleteId);
        saveStudentsData(students);
        deleteModal.classList.remove("active");
        currentDeleteId = null;
        renderStudentTable();
        showToast("Data siswa berhasil dihapus dari sistem.", "danger");
      }
    });
  }

  // Modal Edit
  const editModal = document.getElementById("editModal");
  const btnCancelEdit = document.getElementById("btnCancelEdit");
  const editForm = document.getElementById("editStudentForm");

  if (btnCancelEdit && editModal) {
    btnCancelEdit.addEventListener("click", () => {
      editModal.classList.remove("active");
    });
  }

  if (editForm) {
    editForm.addEventListener("submit", (e) => {
      e.preventDefault();
      const id = document.getElementById("editId").value;
      const nama = document.getElementById("editNama").value.trim();
      const nisn = document.getElementById("editNisn").value.trim();
      const gender = document.getElementById("editGender").value;
      const kelas = document.getElementById("editKelas").value;
      const jurusan = document.getElementById("editJurusan").value;
      const no_hp = document.getElementById("editNoHp").value.trim();
      const status = document.getElementById("editStatus").value;

      if (!nama || !nisn || !kelas || !jurusan) {
        showToast("Mohon lengkapi semua bidang wajib!", "warning");
        return;
      }

      let students = getStudentsData();
      const index = students.findIndex(s => s.id === id);
      if (index !== -1) {
        students[index] = {
          ...students[index],
          nama,
          nisn,
          gender,
          kelas,
          jurusan,
          no_hp,
          status
        };
        saveStudentsData(students);
        editModal.classList.remove("active");
        renderStudentTable();
        showToast("Perubahan data siswa berhasil disimpan!", "success");
      }
    });
  }
}

// Buka Modal Konfirmasi Hapus
function confirmDeleteStudent(id) {
  const students = getStudentsData();
  const student = students.find(s => s.id === id);
  if (!student) return;

  currentDeleteId = id;
  const deleteTargetName = document.getElementById("deleteTargetName");
  if (deleteTargetName) {
    deleteTargetName.textContent = student.nama;
  }

  const deleteModal = document.getElementById("deleteModal");
  if (deleteModal) {
    deleteModal.classList.add("active");
  }
}

// Buka Modal Edit Siswa
function openEditModal(id) {
  const students = getStudentsData();
  const student = students.find(s => s.id === id);
  if (!student) return;

  document.getElementById("editId").value = student.id;
  document.getElementById("editNama").value = student.nama;
  document.getElementById("editNisn").value = student.nisn;
  document.getElementById("editGender").value = student.gender || "L";
  document.getElementById("editKelas").value = student.kelas;
  document.getElementById("editJurusan").value = student.jurusan;
  document.getElementById("editNoHp").value = student.no_hp || "";
  document.getElementById("editStatus").value = student.status || "Aktif";

  const editModal = document.getElementById("editModal");
  if (editModal) {
    editModal.classList.add("active");
  }
}

// Helper Sanitasi HTML
function escapeHtml(str) {
  if (!str) return "";
  return String(str)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#039;");
}
