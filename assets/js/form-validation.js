/**
 * SIAKAD ADMIN PANEL - FORM VALIDATION SCRIPT
 * Validasi form Client-Side interaktif (NISN, Nama, Telepon, Alamat) dengan real-time feedback
 */

document.addEventListener("DOMContentLoaded", () => {
  const form = document.getElementById("addStudentForm");
  if (!form) return;

  const nisnInput = document.getElementById("inputNisn");
  const namaInput = document.getElementById("inputNama");
  const genderInput = document.getElementById("inputGender");
  const kelasInput = document.getElementById("inputKelas");
  const jurusanInput = document.getElementById("inputJurusan");
  const noHpInput = document.getElementById("inputNoHp");
  const alamatInput = document.getElementById("inputAlamat");

  // Validasi Realtime saat User Mengetik / Berinteraksi
  if (nisnInput) nisnInput.addEventListener("input", () => validateNisn(nisnInput));
  if (namaInput) namaInput.addEventListener("input", () => validateNama(namaInput));
  if (kelasInput) kelasInput.addEventListener("change", () => validateRequired(kelasInput, "Pilih kelas rombel!"));
  if (jurusanInput) jurusanInput.addEventListener("change", () => validateRequired(jurusanInput, "Pilih program keahlian / jurusan!"));
  if (noHpInput) noHpInput.addEventListener("input", () => validatePhone(noHpInput));
  if (alamatInput) alamatInput.addEventListener("input", () => validateAlamat(alamatInput));

  // Handle Form Submit
  form.addEventListener("submit", (e) => {
    e.preventDefault();

    const isNisnValid = validateNisn(nisnInput);
    const isNamaValid = validateNama(namaInput);
    const isKelasValid = validateRequired(kelasInput, "Pilih kelas rombel siswa!");
    const isJurusanValid = validateRequired(jurusanInput, "Pilih jurusan siswa!");
    const isPhoneValid = validatePhone(noHpInput);
    const isAlamatValid = validateAlamat(alamatInput);

    if (isNisnValid && isNamaValid && isKelasValid && isJurusanValid && isPhoneValid && isAlamatValid) {
      // Buat Objek Siswa Baru
      const newStudent = {
        id: "STD-" + Date.now().toString().slice(-4),
        nisn: nisnInput.value.trim(),
        nama: namaInput.value.trim(),
        gender: genderInput.value,
        kelas: kelasInput.value,
        jurusan: jurusanInput.value,
        no_hp: noHpInput.value.trim(),
        alamat: alamatInput.value.trim(),
        status: document.getElementById("inputStatus") ? document.getElementById("inputStatus").value : "Aktif",
        nilaiRataRata: 80.0
      };

      // Simpan ke LocalStorage
      const students = getStudentsData();
      students.unshift(newStudent);
      saveStudentsData(students);

      showToast("Data siswa baru berhasil ditambahkan!", "success");

      // Redirect kembali ke halaman Data Master setelah 1 detik
      setTimeout(() => {
        window.location.href = "data-master.html";
      }, 1000);
    } else {
      showToast("Terdapat kolom yang belum valid. Mohon periksa kembali!", "danger");
    }
  });
});

// Validator Functions
function validateNisn(input) {
  if (!input) return true;
  const val = input.value.trim();
  const feedback = input.parentElement.querySelector(".invalid-feedback");
  const regex = /^[0-9]{10}$/;

  if (!val) {
    setInvalid(input, feedback, "NISN wajib diisi!");
    return false;
  } else if (!regex.test(val)) {
    setInvalid(input, feedback, "NISN harus berupa 10 digit angka resmi!");
    return false;
  } else {
    setValid(input, feedback);
    return true;
  }
}

function validateNama(input) {
  if (!input) return true;
  const val = input.value.trim();
  const feedback = input.parentElement.querySelector(".invalid-feedback");

  if (!val) {
    setInvalid(input, feedback, "Nama lengkap wajib diisi!");
    return false;
  } else if (val.length < 3) {
    setInvalid(input, feedback, "Nama lengkap minimal harus 3 karakter!");
    return false;
  } else {
    setValid(input, feedback);
    return true;
  }
}

function validateRequired(input, message) {
  if (!input) return true;
  const val = input.value;
  const feedback = input.parentElement.querySelector(".invalid-feedback");

  if (!val || val === "") {
    setInvalid(input, feedback, message);
    return false;
  } else {
    setValid(input, feedback);
    return true;
  }
}

function validatePhone(input) {
  if (!input) return true;
  const val = input.value.trim();
  const feedback = input.parentElement.querySelector(".invalid-feedback");
  const regex = /^[0-9]{10,13}$/;

  if (!val) {
    setInvalid(input, feedback, "Nomor telepon / WhatsApp wajib diisi!");
    return false;
  } else if (!regex.test(val)) {
    setInvalid(input, feedback, "Nomor HP harus berupa 10 - 13 digit angka (contoh: 081234567890)!");
    return false;
  } else {
    setValid(input, feedback);
    return true;
  }
}

function validateAlamat(input) {
  if (!input) return true;
  const val = input.value.trim();
  const feedback = input.parentElement.querySelector(".invalid-feedback");

  if (!val) {
    setInvalid(input, feedback, "Alamat tempat tinggal wajib diisi!");
    return false;
  } else if (val.length < 5) {
    setInvalid(input, feedback, "Alamat tempat tinggal terlalu pendek (minimal 5 karakter)!");
    return false;
  } else {
    setValid(input, feedback);
    return true;
  }
}

function setInvalid(input, feedback, message) {
  input.classList.remove("is-valid");
  input.classList.add("is-invalid");
  if (feedback) feedback.textContent = message;
}

function setValid(input, feedback) {
  input.classList.remove("is-invalid");
  input.classList.add("is-valid");
  if (feedback) feedback.textContent = "";
}
