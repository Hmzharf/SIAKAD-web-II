/**
 * SIAKAD ADMIN PANEL - DATA KELAS SCRIPT
 * CRUD Interaktif Rombongan Belajar (Search, Filter, Modal Tambah, Edit, Hapus dengan LocalStorage)
 */

let currentDeleteClassId = null;

document.addEventListener("DOMContentLoaded", () => {
  renderClassTable();
  setupClassFilters();
  setupClassModals();
});

// Render Data Tabel Kelas
function renderClassTable(dataToRender = null) {
  const classes = dataToRender || getClassesData();
  const tableBody = document.getElementById("classTableBody");
  const totalCountEl = document.getElementById("totalClassCount");

  if (!tableBody) return;

  if (totalCountEl) {
    totalCountEl.textContent = `${classes.length} Rombongan Belajar`;
  }

  if (classes.length === 0) {
    tableBody.innerHTML = `
      <tr>
        <td colspan="7" style="text-align: center; padding: 40px; color: var(--text-muted);">
          <i class="fa-solid fa-school" style="font-size: 36px; margin-bottom: 12px; display: block; opacity: 0.5;"></i>
          Tidak ada data kelas yang cocok dengan pencarian atau filter.
        </td>
      </tr>
    `;
    return;
  }

  tableBody.innerHTML = classes.map((cls, index) => {
    const tingkatBadge = cls.tingkat === "XII"
      ? '<span class="badge badge-cyan"><i class="fa-solid fa-graduation-cap"></i> Tingkat XII</span>'
      : cls.tingkat === "XI"
      ? '<span class="badge" style="background: rgba(67, 97, 238, 0.15); color: #4361ee; border: 1px solid rgba(67, 97, 238, 0.35);"><i class="fa-solid fa-layer-group"></i> Tingkat XI</span>'
      : '<span class="badge badge-success"><i class="fa-solid fa-seedling"></i> Tingkat X</span>';

    const isFull = cls.jumlahSiswa >= cls.kapasitas;
    const capacityBadge = isFull
      ? `<span class="badge badge-danger">${cls.jumlahSiswa} / ${cls.kapasitas} (Penuh)</span>`
      : `<span class="badge badge-success">${cls.jumlahSiswa} / ${cls.kapasitas} Siswa</span>`;

    return `
      <tr>
        <td style="font-weight: 600; color: var(--text-muted); width: 40px;">${index + 1}</td>
        <td>
          <div style="font-weight: 700; color: #fff; font-size: 15px;">${escapeHtml(cls.nama)}</div>
          <div style="font-size: 11.5px; color: var(--text-muted);">Kode: ${escapeHtml(cls.kode || cls.id)}</div>
        </td>
        <td>${tingkatBadge}</td>
        <td>
          <div style="font-weight: 600; color: var(--text-secondary);">${escapeHtml(cls.jurusan)}</div>
          <div style="font-size: 11.5px; color: var(--text-muted);"><i class="fa-solid fa-door-open"></i> ${escapeHtml(cls.ruangan || "-")}</div>
        </td>
        <td>
          <div style="font-weight: 600; color: #fff;"><i class="fa-solid fa-user-tie" style="color: var(--accent-cyan); margin-right: 6px;"></i>${escapeHtml(cls.waliKelas)}</div>
        </td>
        <td>${capacityBadge}</td>
        <td>
          <div class="action-buttons">
            <button class="btn-action edit" title="Edit Data Kelas" onclick="openEditClassModal('${cls.id}')">
              <i class="fa-solid fa-pen-to-square"></i>
            </button>
            <button class="btn-action delete" title="Hapus Data Kelas" onclick="confirmDeleteClass('${cls.id}')">
              <i class="fa-solid fa-trash-can"></i>
            </button>
          </div>
        </td>
      </tr>
    `;
  }).join("");
}

// Setup Fitur Filter dan Pencarian
function setupClassFilters() {
  const searchInput = document.getElementById("searchClassInput");
  const filterTingkat = document.getElementById("filterClassTingkat");
  const filterJurusan = document.getElementById("filterClassJurusan");

  function applyFilters() {
    const query = searchInput ? searchInput.value.toLowerCase().trim() : "";
    const selectedTingkat = filterTingkat ? filterTingkat.value : "";
    const selectedJurusan = filterJurusan ? filterJurusan.value : "";

    const allClasses = getClassesData();

    const filtered = allClasses.filter(cls => {
      const matchQuery = cls.nama.toLowerCase().includes(query) || 
                         cls.waliKelas.toLowerCase().includes(query) ||
                         (cls.ruangan && cls.ruangan.toLowerCase().includes(query));
      const matchTingkat = !selectedTingkat || cls.tingkat === selectedTingkat;
      const matchJurusan = !selectedJurusan || cls.jurusan === selectedJurusan;
      return matchQuery && matchTingkat && matchJurusan;
    });

    renderClassTable(filtered);
  }

  if (searchInput) searchInput.addEventListener("input", applyFilters);
  if (filterTingkat) filterTingkat.addEventListener("change", applyFilters);
  if (filterJurusan) filterJurusan.addEventListener("change", applyFilters);
}

// Setup Modal Tambah, Edit & Hapus Kelas
function setupClassModals() {
  // 1. Modal Tambah Kelas
  const addModal = document.getElementById("addClassModal");
  const btnOpenAdd = document.getElementById("btnOpenAddClassModal");
  const btnCancelAdd = document.getElementById("btnCancelAddClass");
  const addForm = document.getElementById("addClassForm");

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
      const nama = document.getElementById("addNamaKelas").value.trim();
      const tingkat = document.getElementById("addTingkatKelas").value;
      const jurusan = document.getElementById("addJurusanKelas").value;
      const waliKelas = document.getElementById("addWaliKelas").value.trim();
      const kapasitas = parseInt(document.getElementById("addKapasitasKelas").value) || 36;
      const jumlahSiswa = parseInt(document.getElementById("addJumlahSiswaKelas").value) || 0;
      const ruangan = document.getElementById("addRuanganKelas").value.trim();

      if (!nama || !tingkat || !jurusan || !waliKelas) {
        showToast("Nama Kelas, Tingkat, Jurusan, dan Wali Kelas wajib diisi!", "warning");
        return;
      }

      const newClass = {
        id: "KLS-" + Date.now().toString().slice(-4),
        kode: nama.replace(/\s+/g, "-").toUpperCase(),
        nama,
        tingkat,
        jurusan,
        waliKelas,
        kapasitas,
        jumlahSiswa,
        ruangan: ruangan || "Ruang Kelas Standar"
      };

      const classes = getClassesData();
      classes.unshift(newClass);
      saveClassesData(classes);

      addModal.classList.remove("active");
      renderClassTable();
      showToast("Data Rombongan Belajar baru berhasil ditambahkan!", "success");
    });
  }

  // 2. Modal Hapus Kelas
  const deleteModal = document.getElementById("deleteClassModal");
  const btnCancelDelete = document.getElementById("btnCancelDeleteClass");
  const btnConfirmDelete = document.getElementById("btnConfirmDeleteClass");

  if (btnCancelDelete && deleteModal) {
    btnCancelDelete.addEventListener("click", () => {
      deleteModal.classList.remove("active");
      currentDeleteClassId = null;
    });
  }

  if (btnConfirmDelete && deleteModal) {
    btnConfirmDelete.addEventListener("click", () => {
      if (currentDeleteClassId) {
        let classes = getClassesData();
        classes = classes.filter(c => c.id !== currentDeleteClassId);
        saveClassesData(classes);
        deleteModal.classList.remove("active");
        currentDeleteClassId = null;
        renderClassTable();
        showToast("Data kelas berhasil dihapus dari sistem.", "danger");
      }
    });
  }

  // 3. Modal Edit Kelas
  const editModal = document.getElementById("editClassModal");
  const btnCancelEdit = document.getElementById("btnCancelEditClass");
  const editForm = document.getElementById("editClassForm");

  if (btnCancelEdit && editModal) {
    btnCancelEdit.addEventListener("click", () => {
      editModal.classList.remove("active");
    });
  }

  if (editForm) {
    editForm.addEventListener("submit", (e) => {
      e.preventDefault();
      const id = document.getElementById("editClassId").value;
      const nama = document.getElementById("editNamaKelas").value.trim();
      const tingkat = document.getElementById("editTingkatKelas").value;
      const jurusan = document.getElementById("editJurusanKelas").value;
      const waliKelas = document.getElementById("editWaliKelas").value.trim();
      const kapasitas = parseInt(document.getElementById("editKapasitasKelas").value) || 36;
      const jumlahSiswa = parseInt(document.getElementById("editJumlahSiswaKelas").value) || 0;
      const ruangan = document.getElementById("editRuanganKelas").value.trim();

      let classes = getClassesData();
      const index = classes.findIndex(c => c.id === id);
      if (index !== -1) {
        classes[index] = {
          ...classes[index],
          nama,
          tingkat,
          jurusan,
          waliKelas,
          kapasitas,
          jumlahSiswa,
          ruangan
        };
        saveClassesData(classes);
        editModal.classList.remove("active");
        renderClassTable();
        showToast("Data kelas berhasil diperbarui!", "success");
      }
    });
  }
}

// Buka Modal Hapus Kelas
function confirmDeleteClass(id) {
  const classes = getClassesData();
  const cls = classes.find(c => c.id === id);
  if (!cls) return;

  currentDeleteClassId = id;
  const deleteTargetName = document.getElementById("deleteClassTargetName");
  if (deleteTargetName) {
    deleteTargetName.textContent = `${cls.nama} - Wali: ${cls.waliKelas}`;
  }

  const deleteModal = document.getElementById("deleteClassModal");
  if (deleteModal) {
    deleteModal.classList.add("active");
  }
}

// Buka Modal Edit Kelas
function openEditClassModal(id) {
  const classes = getClassesData();
  const cls = classes.find(c => c.id === id);
  if (!cls) return;

  document.getElementById("editClassId").value = cls.id;
  document.getElementById("editNamaKelas").value = cls.nama;
  document.getElementById("editTingkatKelas").value = cls.tingkat;
  document.getElementById("editJurusanKelas").value = cls.jurusan;
  document.getElementById("editWaliKelas").value = cls.waliKelas;
  document.getElementById("editKapasitasKelas").value = cls.kapasitas;
  document.getElementById("editJumlahSiswaKelas").value = cls.jumlahSiswa;
  document.getElementById("editRuanganKelas").value = cls.ruangan || "";

  const editModal = document.getElementById("editClassModal");
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
