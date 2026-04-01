// =====================================================================
// CONFIG.JS — Konfigurasi utama aplikasi supervisi
// Ganti APPS_SCRIPT_URL dengan URL Web App Google Apps Script Anda
// =====================================================================

const CONFIG = {
  APPS_SCRIPT_URL: 'https://script.google.com/macros/s/AKfycbza5xAVpqy0F-gYjqZc1gtDFeM8qCt2--mtfVuXTYv1S3wqI3OTmjcNPDmUwC9SkHIpfw/exec',
  APP_NAME: 'Supervisi Keperawatan Rawat Inap',
  RS_NAME: 'RS [UNAIR RUANG IRNA 5A]',
  VERSION: '1.0.0'
};

// =====================================================================
// DATA MASTER — Daftar ruangan dan staf
// Setelah integrasi Sheets aktif, data ini bisa diganti dengan
// fetch dari Apps Script (doGet?action=getMasterStaf)
// =====================================================================

const MASTER = {
  ruangan: [
    'Ruang Mawar',
    'Ruang Melati',
    'Ruang Anggrek',
    'Ruang Flamboyan',
    'Ruang ICU',
    'Ruang Perinatologi',
    'Ruang Bedah',
    'Ruang Interna',
  ],

  staf: [
    { nama: 'Ns. Siti Rahayu, S.Kep', jabatan: 'Kepala Ruangan', ruangan: 'Ruang Mawar' },
    { nama: 'Ns. Budi Santoso, S.Kep', jabatan: 'Perawat Pelaksana', ruangan: 'Ruang Mawar' },
    { nama: 'Ns. Dewi Lestari, S.Kep', jabatan: 'Perawat Pelaksana', ruangan: 'Ruang Mawar' },
    { nama: 'Ns. Ahmad Fauzi, S.Kep', jabatan: 'Kepala Ruangan', ruangan: 'Ruang Melati' },
    { nama: 'Ns. Rina Wulandari, S.Kep', jabatan: 'Perawat Pelaksana', ruangan: 'Ruang Melati' },
    { nama: 'Ns. Hendra Kusuma, S.Kep', jabatan: 'Perawat Pelaksana', ruangan: 'Ruang Melati' },
    { nama: 'Ns. Fitri Handayani, S.Kep', jabatan: 'Kepala Ruangan', ruangan: 'Ruang Anggrek' },
    { nama: 'Ns. Yusuf Pranoto, S.Kep', jabatan: 'Perawat Pelaksana', ruangan: 'Ruang Anggrek' },
    { nama: 'Ns. Nadia Putri, S.Kep', jabatan: 'Perawat Pelaksana', ruangan: 'Ruang Anggrek' },
    { nama: 'Ns. Eko Prasetyo, S.Kep', jabatan: 'Kepala Ruangan', ruangan: 'Ruang Flamboyan' },
    { nama: 'Ns. Lina Susanti, S.Kep', jabatan: 'Perawat Pelaksana', ruangan: 'Ruang Flamboyan' },
    { nama: 'Ns. Agus Wahyudi, S.Kep', jabatan: 'Kepala Ruangan', ruangan: 'Ruang ICU' },
    { nama: 'Ns. Sri Mulyani, S.Kep', jabatan: 'Perawat Pelaksana', ruangan: 'Ruang ICU' },
    { nama: 'Ns. Dian Permata, S.Kep', jabatan: 'Kepala Ruangan', ruangan: 'Ruang Perinatologi' },
    { nama: 'Ns. Rudi Hartono, S.Kep', jabatan: 'Kepala Ruangan', ruangan: 'Ruang Bedah' },
    { nama: 'Ns. Maya Sari, S.Kep', jabatan: 'Perawat Pelaksana', ruangan: 'Ruang Bedah' },
    { nama: 'Ns. Tono Wijaya, S.Kep', jabatan: 'Kepala Ruangan', ruangan: 'Ruang Interna' },
    { nama: 'Ns. Wati Rahmawati, S.Kep', jabatan: 'Perawat Pelaksana', ruangan: 'Ruang Interna' },
  ]
};

// =====================================================================
// INSTRUMEN SUPERVISI
// =====================================================================

const INSTRUMEN = {
  karu: [
    {
      id: 'ka_askep',
      judul: 'A. Asuhan Keperawatan',
      bobot: 25,
      items: [
        'Memastikan pengkajian keperawatan pasien dilakukan secara komprehensif',
        'Memvalidasi diagnosis keperawatan yang disusun oleh perawat pelaksana',
        'Memastikan rencana asuhan keperawatan (NCP) disusun sesuai diagnosis',
        'Mengevaluasi pelaksanaan intervensi keperawatan secara berkala',
        'Memberikan umpan balik konstruktif kepada perawat terkait mutu asuhan',
        'Mendokumentasikan hasil supervisi asuhan keperawatan'
      ]
    },
    {
      id: 'ka_sop',
      judul: 'B. Tindakan Keperawatan / SOP',
      bobot: 25,
      items: [
        'Memastikan SOP tindakan keperawatan tersedia, mudah diakses, dan mutakhir',
        'Melakukan supervisi kepatuhan perawat pelaksana terhadap SOP tindakan',
        'Menindaklanjuti temuan penyimpangan dari SOP secara sistematis',
        'Memberikan coaching kepada perawat yang kurang patuh terhadap SOP',
        'Mengevaluasi efektivitas implementasi SOP di ruangan secara berkala'
      ]
    },
    {
      id: 'ka_manajemen',
      judul: 'C. Manajemen Ruangan',
      bobot: 30,
      items: [
        'Mengatur pembagian tugas dan jadwal dinas secara adil dan proporsional',
        'Memimpin pre-conference dan post-conference secara rutin dan terstruktur',
        'Mengelola ketersediaan alat, obat, dan bahan keperawatan',
        'Menangani komplain pasien dan keluarga secara profesional dan empatik',
        'Menjaga kondisi lingkungan ruangan yang aman, nyaman, dan bersih',
        'Berkoordinasi dengan tim multidisiplin secara efektif dan proaktif'
      ]
    },
    {
      id: 'ka_dokumentasi',
      judul: 'D. Dokumentasi & Rekam Medis',
      bobot: 20,
      items: [
        'Memastikan kelengkapan dokumentasi asuhan keperawatan di seluruh berkas',
        'Melakukan audit dokumentasi keperawatan secara berkala',
        'Mengawasi ketepatan waktu pengisian rekam medis oleh perawat',
        'Memastikan kerahasiaan dan keamanan rekam medis pasien terjaga'
      ]
    }
  ],

  pp: [
    {
      id: 'pp_askep',
      judul: 'A. Asuhan Keperawatan',
      bobot: 30,
      items: [
        'Melakukan pengkajian pasien baru secara lengkap (anamnesis dan pemeriksaan fisik)',
        'Merumuskan diagnosis keperawatan berdasarkan data hasil pengkajian',
        'Menyusun rencana asuhan keperawatan yang terukur, realistis, dan berfokus pada pasien',
        'Melaksanakan intervensi keperawatan sesuai rencana yang telah ditetapkan',
        'Melakukan evaluasi asuhan keperawatan secara berkala menggunakan format SOAP',
        'Melaksanakan edukasi kesehatan kepada pasien dan keluarga secara efektif'
      ]
    },
    {
      id: 'pp_sop',
      judul: 'B. Tindakan Keperawatan / SOP',
      bobot: 25,
      items: [
        'Melaksanakan setiap tindakan keperawatan sesuai SOP yang berlaku',
        'Menerapkan prinsip keselamatan pasien (6 SKP) dalam setiap tindakan',
        'Menggunakan APD yang tepat sesuai standar Pencegahan dan Pengendalian Infeksi (PPI)',
        'Melakukan identifikasi pasien dengan benar sebelum setiap tindakan',
        'Melaporkan insiden/KTD sesuai prosedur pelaporan yang berlaku di rumah sakit'
      ]
    },
    {
      id: 'pp_manajemen',
      judul: 'C. Manajemen Ruangan',
      bobot: 20,
      items: [
        'Melaksanakan operan jaga (handover) secara lengkap dan terstruktur menggunakan metode SBAR',
        'Menjaga kebersihan, kerapian, dan ketertiban area kerja serta lingkungan pasien',
        'Melaporkan kondisi kritis pasien kepada DPJP/dokter jaga secara tepat waktu',
        'Berkolaborasi efektif dengan sesama anggota tim keperawatan dan tenaga kesehatan lain'
      ]
    },
    {
      id: 'pp_dokumentasi',
      judul: 'D. Dokumentasi & Rekam Medis',
      bobot: 25,
      items: [
        'Mengisi catatan keperawatan dengan lengkap, jelas, objektif, dan tepat waktu',
        'Mendokumentasikan setiap tindakan keperawatan yang telah dilakukan',
        'Menggunakan format SOAP/SBAR secara konsisten dalam catatan perkembangan pasien',
        'Menjaga kerahasiaan dan keamanan rekam medis pasien sesuai regulasi'
      ]
    }
  ]
};

// =====================================================================
// HELPERS
// =====================================================================

function getKategori(skor) {
  if (skor >= 86) return { label: 'Sangat Baik', cls: 'badge-success' };
  if (skor >= 71) return { label: 'Baik', cls: 'badge-info' };
  if (skor >= 56) return { label: 'Cukup', cls: 'badge-warning' };
  return { label: 'Kurang', cls: 'badge-danger' };
}

function formatTanggal(str) {
  if (!str) return '-';
  const d = new Date(str);
  return d.toLocaleDateString('id-ID', { day: '2-digit', month: 'short', year: 'numeric' });
}

function hitungSkorAspek(scores) {
  const valid = scores.filter(s => s > 0);
  if (!valid.length) return 0;
  return Math.round((valid.reduce((a, b) => a + b, 0) / (valid.length * 4)) * 100);
}

function hitungSkorTotal(skor_per_aspek, bobot_list) {
  let total = 0, totalBobot = 0;
  skor_per_aspek.forEach((s, i) => {
    total += s * bobot_list[i];
    totalBobot += bobot_list[i];
  });
  return Math.round(total / totalBobot);
}

// Simpan & ambil riwayat lokal (fallback jika offline)
function simpanLokal(data) {
  const existing = JSON.parse(localStorage.getItem('supervisi_data') || '[]');
  existing.unshift(data);
  localStorage.setItem('supervisi_data', JSON.stringify(existing.slice(0, 200)));
}

function ambilLokal() {
  return JSON.parse(localStorage.getItem('supervisi_data') || '[]');
}
