/**
 * SIAKAD ADMIN PANEL - DATA GURU SCRIPT
 * CRUD Interaktif Data Pendidik Client-Side (Search, Filter, Modal Tambah, Edit, Hapus dengan LocalStorage)
 */

let currentDeleteTeacherId = null;

document.addEventListener("DOMContentLoaded", () => {
  renderTeacherTable();
  setupTeacherFilters();
  setupTeacherModals();
});

// Render Data Tabel Guru
function renderTeacherTable(dataToRender = null) {
  const teachers = dataToRender || getTeachersData();
  const tableBody = document.getElementById("teacherTableBody");
  const totalCountEl = document.getElementById("totalTeacherCount");

  if (!tableBody) return;

  if (totalCountEl) {
    totalCountEl.textContent = `${teachers.length} Tenaga Pendidik`;
  }

  if (teachers.length === 0) {
    tableBody.innerHTML = `
      <tr>
        <td colspan="7" style="text-align: center; padding: 40px; color: var(--text-muted);">
          <i class="fa-solid fa-chalkboard-user" style="font-size: 36px; margin-bottom: 12px; display: block; opacity: 0.5;"></i>
          Tidak ada data guru yang cocok dengan pencarian atau filter.
        </td>
      </tr>
    `;
    return;
  }

  tableBody.innerHTML = teachers.map((teacher, index) => {
    const initials = teacher.nama
      .replace(/^(Drs\.|Dr\.|Ir\.)\s*/i, "")
      .split(" ")
      .map(n => n[0])
      .slice(0, 2)
      .join("")
      .toUpperCase();

    const statusBadge = teacher.status === "PNS"
      ? '<span class="badge badge-success"><i class="fa-solid fa-shield-check"></i> PNS</span>'
      : teacher.status === "PPPK"
      ? '<span class="badge badge-cyan"><i class="fa-solid fa-certificate"></i> PPPK</span>'
      : '<span class="badge badge-warning"><i class="fa-solid fa-clock"></i> Honorer</span>';

    const genderBadge = teacher.gender === "L"
      ? '<span class="badge badge-cyan"><i class="fa-solid fa-mars"></i> L</span>'
      : '<span class="badge" style="background: rgba(247, 37, 133, 0.15); color: #f72585; border: 1px solid rgba(247, 37, 133, 0.35);"><i class="fa-solid fa-venus"></i> P</span>';

    return `
      <tr>
        <td style="font-weight: 600; color: var(--text-muted); width: 40px;">${index + 1}</td>
        <td>
          <div class="student-meta">
            <div class="student-meta-avatar" style="background: linear-gradient(135deg, #06d6a0, #4361ee);">${initials}</div>
            <div>
              <div class="student-name">${escapeHtml(teacher.nama)}</div>
              <div class="student-nisn">NIP: ${escapeHtml(teacher.nip)}</div>
            </div>
          </div>
        </td>
        <td>${genderBadge}</td>
        <td>
          <div style="font-weight: 600; color: #fff;">${escapeHtml(teacher.mapel)}</div>
          <div style="font-size: 11.5px; color: var(--text-muted);"><i class="fa-regular fa-envelope"></i> ${escapeHtml(teacher.email || "-")}</div>
        </td>
        <td>
          <i class="fa-solid fa-phone" style="font-size: 11px; margin-right: 6px; color: var(--accent-cyan);"></i>
          ${escapeHtml(teacher.no_hp || "-")}
        </td>
        <td>${statusBadge}</td>
        <td>
          <div class="action-buttons">
            <button class="btn-action edit" title="Edit Data Guru" onclick="openEditTeacherModal('${teacher.id}')">
              <i class="fa-solid fa-pen-to-square"></i>
            </button>
            <button class="btn-action delete" title="Hapus Data Guru" onclick="confirmDeleteTeacher('${teacher.id}')">
              <i class="fa-solid fa-trash-can"></i>
            </button>
          </div>
        </td>
      </tr>
    `;
  }).join("");
}

// Setup Fitur Filter dan Pencarian
function setupTeacherFilters() {
  const searchInput = document.getElementById("searchTeacherInput");
  const filterStatus = document.getElementById("filterTeacherStatus");

  function applyFilters() {
    const query = searchInput ? searchInput.value.toLowerCase().trim() : "";
    const selectedStatus = filterStatus ? filterStatus.value : "";

    const allTeachers = getTeachersData();

    const filtered = allTeachers.filter(teacher => {
      const matchQuery = teacher.nama.toLowerCase().includes(query) || 
                         teacher.nip.includes(query) || 
                         teacher.mapel.toLowerCase().includes(query);
      const matchStatus = !selectedStatus || teacher.status === selectedStatus;
      return matchQuery && matchStatus;
    });

    renderTeacherTable(filtered);
  }

  if (searchInput) searchInput.addEventListener("input", applyFilters);
  if (filterStatus) filterStatus.addEventListener("change", applyFilters);
}

// Setup Modal Tambah, Edit & Hapus Guru
function setupTeacherModals() {
  // 1. Modal Tambah Guru
  const addModal = document.getElementById("addTeacherModal");
  const btnOpenAdd = document.getElementById("btnOpenAddTeacherModal");
  const btnCancelAdd = document.getElementById("btnCancelAddTeacher");
  const addForm = document.getElementById("addTeacherForm");

  if (btnOpenAdd && addModal) {
    btnOpenAdd.addEventListener("click", () => {
      addForm.reset();
      addModal.classList.add("active");
    });
  }

  if (btnCancelAdd && addModal) {
    btnCancelAdd.addEventListener("click", () => {
      addModal.classList.remove("active");
    });
  }

  if (addForm) {
    addForm.addEventListener("submit", (e) => {
      e.preventDefault();
      const nip = document.getElementById("addNip").value.trim();
      const nama = document.getElementById("addNama").value.trim();
      const gender = document.getElementById("addGender").value;
      const mapel = document.getElementById("addMapel").value.trim();
      const no_hp = document.getElementById("addNoHp").value.trim();
      const email = document.getElementById("addEmail").value.trim();
      const status = document.getElementById("addStatus").value;

      if (!nip || !nama || !mapel) {
        showToast("NIP, Nama Lengkap, dan Mata Pelajaran wajib diisi!", "warning");
        return;
      }

      const newTeacher = {
        id: "TCH-" + Date.now().toString().slice(-4),
        nip,
        nama,
        gender,
        mapel,
        no_hp,
        email: email || `${nama.toLowerCase().replace(/[^a-z]/g, "")}@smkunggul.sch.id`,
        status,
        kepegawaian: "Aktif"
      };

      const teachers = getTeachersData();
      teachers.unshift(newTeacher);
      saveTeachersData(teachers);

      addModal.classList.remove("active");
      renderTeacherTable();
      showToast("Data Guru baru berhasil ditambahkan!", "success");
    });
  }

  // 2. Modal Hapus Guru
  const deleteModal = document.getElementById("deleteTeacherModal");
  const btnCancelDelete = document.getElementById("btnCancelDeleteTeacher");
  const btnConfirmDelete = document.getElementById("btnConfirmDeleteTeacher");

  if (btnCancelDelete && deleteModal) {
    btnCancelDelete.addEventListener("click", () => {
      deleteModal.classList.remove("active");
      currentDeleteTeacherId = null;
    });
  }

  if (btnConfirmDelete && deleteModal) {
    btnConfirmDelete.addEventListener("click", () => {
      if (currentDeleteTeacherId) {
        let teachers = getTeachersData();
        teachers = teachers.filter(t => t.id !== currentDeleteTeacherId);
        saveTeachersData(teachers);
        deleteModal.classList.remove("active");
        currentDeleteTeacherId = null;
        renderTeacherTable();
        showToast("Data guru berhasil dihapus dari sistem.", "danger");
      }
    });
  }

  // 3. Modal Edit Guru
  const editModal = document.getElementById("editTeacherModal");
  const btnCancelEdit = document.getElementById("btnCancelEditTeacher");
  const editForm = document.getElementById("editTeacherForm");

  if (btnCancelEdit && editModal) {
    btnCancelEdit.addEventListener("click", () => {
      editModal.classList.remove("active");
    });
  }

  if (editForm) {
    editForm.addEventListener("submit", (e) => {
      e.preventDefault();
      const id = document.getElementById("editTeacherId").value;
      const nip = document.getElementById("editTeacherNip").value.trim();
      const nama = document.getElementById("editTeacherNama").value.trim();
      const gender = document.getElementById("editTeacherGender").value;
      const mapel = document.getElementById("editTeacherMapel").value.trim();
      const no_hp = document.getElementById("editTeacherNoHp").value.trim();
      const email = document.getElementById("editTeacherEmail").value.trim();
      const status = document.getElementById("editTeacherStatus").value;

      let teachers = getTeachersData();
      const index = teachers.findIndex(t => t.id === id);
      if (index !== -1) {
        teachers[index] = {
          ...teachers[index],
          nip,
          nama,
          gender,
          mapel,
          no_hp,
          email,
          status
        };
        saveTeachersData(teachers);
        editModal.classList.remove("active");
        renderTeacherTable();
        showToast("Data guru berhasil diperbarui!", "success");
      }
    });
  }
}

// Buka Modal Hapus Guru
function confirmDeleteTeacher(id) {
  const teachers = getTeachersData();
  const teacher = teachers.find(t => t.id === id);
  if (!teacher) return;

  currentDeleteTeacherId = id;
  const deleteTargetName = document.getElementById("deleteTeacherTargetName");
  if (deleteTargetName) {
    deleteTargetName.textContent = `${teacher.nama} (${teacher.nip})`;
  }

  const deleteModal = document.getElementById("deleteTeacherModal");
  if (deleteModal) {
    deleteModal.classList.add("active");
  }
}

// Buka Modal Edit Guru
function openEditTeacherModal(id) {
  const teachers = getTeachersData();
  const teacher = teachers.find(t => t.id === id);
  if (!teacher) return;

  document.getElementById("editTeacherId").value = teacher.id;
  document.getElementById("editTeacherNip").value = teacher.nip;
  document.getElementById("editTeacherNama").value = teacher.nama;
  document.getElementById("editTeacherGender").value = teacher.gender || "L";
  document.getElementById("editTeacherMapel").value = teacher.mapel;
  document.getElementById("editTeacherNoHp").value = teacher.no_hp || "";
  document.getElementById("editTeacherEmail").value = teacher.email || "";
  document.getElementById("editTeacherStatus").value = teacher.status || "PNS";

  const editModal = document.getElementById("editTeacherModal");
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
