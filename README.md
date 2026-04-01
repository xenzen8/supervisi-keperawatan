# Aplikasi Supervisi Keperawatan Rawat Inap
**Stack: HTML murni + Google Sheets via Apps Script**

---

## Struktur File

```
supervisi-rs/
├── index.html        → Beranda & statistik ringkas
├── form.html         → Formulir penilaian (4 langkah)
├── rekap.html        → Tabel riwayat, filter, ekspor CSV/PDF
├── dashboard.html    → Grafik tren, radar, bar chart, ranking
├── style.css         → Styling bersama semua halaman
├── config.js         → Konfigurasi URL & data master
└── Code.gs           → Kode Google Apps Script (backend)
```

---

## Langkah Setup (wajib dilakukan pertama kali)

### 1. Siapkan Google Sheets

1. Buka [sheets.google.com](https://sheets.google.com) → buat spreadsheet baru
2. Klik menu **Ekstensi → Apps Script**
3. Hapus semua kode default
4. Salin & tempel seluruh isi file `Code.gs` ke editor
5. Klik **Simpan** (ikon floppy disk atau Ctrl+S)
6. Di menu atas, klik **Run → setupSheets** untuk membuat sheet otomatis
   - Izinkan akses saat diminta (klik "Allow")
7. Kembali ke spreadsheet — akan ada 2 sheet baru: `Data_Supervisi` dan `Master_Staf`

### 2. Deploy sebagai Web App

1. Di Apps Script, klik **Deploy → New Deployment**
2. Klik ikon ⚙️ di samping "Select type" → pilih **Web app**
3. Isi deskripsi: `Supervisi RS v1.0`
4. **Execute as**: Me (akun Google Anda)
5. **Who has access**: Anyone *(atau "Anyone with Google Account" untuk lebih aman)*
6. Klik **Deploy**
7. **Salin URL** yang muncul (format: `https://script.google.com/macros/s/xxxxx/exec`)

### 3. Konfigurasi Aplikasi HTML

1. Buka file `config.js`
2. Ganti baris ini:
   ```javascript
   APPS_SCRIPT_URL: 'https://script.google.com/macros/s/GANTI_DENGAN_URL_ANDA/exec',
   ```
   dengan URL yang Anda salin di langkah 2.
3. Ubah juga `RS_NAME` dengan nama rumah sakit Anda.
4. Edit daftar `staf` di bagian `MASTER` sesuai data staf nyata RS.

### 4. Hosting Aplikasi (pilih salah satu)

**Opsi A — GitHub Pages (gratis, disarankan):**
1. Upload semua file ke repository GitHub
2. Aktifkan GitHub Pages dari Settings
3. Akses via: `https://username.github.io/supervisi-rs/`

**Opsi B — Langsung dari komputer (lokal):**
- Klik dua kali `index.html` untuk membuka di browser
- Untuk submit form berfungsi, buka melalui live server (VS Code Extension: Live Server)

**Opsi C — Google Drive:**
- Upload ke Google Drive → klik kanan file HTML → "Open with Google Docs" tidak disarankan
- Gunakan GitHub Pages atau server lokal

---

## Cara Menggunakan

### Isi Formulir Supervisi
1. Buka `form.html`
2. **Langkah 1 — Identitas**: Isi nama supervisor, pilih ruangan, perawat, shift, tanggal
3. **Langkah 2 — Instrumen**: Klik tombol 1–4 untuk setiap item (skor real-time)
4. **Langkah 3 — Catatan**: Isi temuan, rekomendasi, target perbaikan
5. **Langkah 4 — Pratinjau**: Cek semua data → klik "Simpan & Kirim"
6. Data langsung masuk ke Google Sheets

### Melihat Rekap
- Buka `rekap.html`
- Filter berdasarkan ruangan, jabatan, kategori, periode, atau nama
- Klik "▶ Lihat" di tiap baris untuk detail skor per aspek
- "Cetak / PDF" untuk mencetak laporan
- "Unduh CSV" untuk ekspor data

### Dashboard Analitik
- Buka `dashboard.html`
- Filter periode (3/6/12 bulan atau semua)
- Filter per ruangan
- Grafik yang tersedia:
  - **Tren bulanan** — skor rata-rata per bulan
  - **Radar aspek** — profil 4 aspek penilaian
  - **Bar chart ruangan** — perbandingan antar ruangan
  - **Distribusi kategori** — donut chart
  - **Ranking** — top 5 & perawat yang perlu perhatian

---

## Skala Penilaian

| Skor | Keterangan |
|------|-----------|
| 1 | Tidak dilakukan |
| 2 | Dilakukan sebagian |
| 3 | Dilakukan, kurang sempurna |
| 4 | Dilakukan dengan sempurna |

| Persentase Total | Kategori |
|-----------------|---------|
| ≥ 86% | Sangat Baik |
| 71–85% | Baik |
| 56–70% | Cukup |
| < 56% | Kurang |

---

## Mode Offline

Aplikasi menyimpan data ke `localStorage` browser secara otomatis sebagai backup. Jika koneksi terputus saat submit, data tetap tersimpan lokal dan ditampilkan di rekap/dashboard. Data lokal ini tidak tersinkronisasi ke Sheets secara otomatis — perlu koneksi saat submit.

---

## Menambah Staf Baru

**Via config.js** (untuk tampilan dropdown):
Tambahkan entri baru di array `MASTER.staf` di `config.js`.

**Via Google Sheets** (untuk sinkronisasi otomatis — segera tersedia):
Tambahkan baris di sheet `Master_Staf` dan aktifkan fitur `getMasterStaf` di Apps Script.
