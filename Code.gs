// =====================================================================
// Code.gs — Google Apps Script untuk Aplikasi Supervisi Keperawatan
// =====================================================================
// CARA SETUP:
// 1. Buka Google Sheets baru
// 2. Klik menu: Ekstensi → Apps Script
// 3. Hapus kode default, paste seluruh kode ini
// 4. Klik Deploy → New Deployment → Tipe: Web App
// 5. Execute as: Me | Who has access: Anyone
// 6. Klik Deploy → Salin URL → Tempel ke config.js di APPS_SCRIPT_URL
// =====================================================================

const SHEET_DATA      = 'Data_Supervisi';
const SHEET_REKAP     = 'Rekap_Bulanan';
const SHEET_STAF      = 'Master_Staf';

// Header kolom sheet utama
const HEADERS = [
  'Timestamp', 'Tanggal_Supervisi', 'Nama_Supervisor', 'Ruangan',
  'Nama_Perawat', 'Jabatan', 'Shift',
  'Skor_Askep', 'Skor_SOP', 'Skor_Manajemen', 'Skor_Dokumentasi',
  'Skor_Total', 'Kategori',
  'Catatan', 'Rekomendasi', 'Target_Perbaikan',
  'Detail_Scores'
];

// =====================================================================
// doPost — menerima data dari form.html via hidden form + iframe
// Data dikirim sebagai form fields (e.parameter), bukan JSON body
// =====================================================================
function doPost(e) {
  try {
    Logger.log('doPost dipanggil');
    Logger.log('e.parameter: ' + JSON.stringify(e.parameter || {}));
    
    let data = {};
    
    // Metode 1 (utama): Baca dari form fields (e.parameter)
    // Ini yang dikirim oleh hidden form di form.html
    if (e.parameter && (e.parameter.supervisor || e.parameter.nama_perawat || e.parameter.tanggal)) {
      Logger.log('Membaca data dari e.parameter (form fields)');
      data = {
        tanggal: e.parameter.tanggal || '',
        supervisor: e.parameter.supervisor || '',
        ruangan: e.parameter.ruangan || '',
        nama_perawat: e.parameter.nama_perawat || '',
        jabatan: e.parameter.jabatan || '',
        shift: e.parameter.shift || '',
        skor_askep: Number(e.parameter.skor_askep) || 0,
        skor_sop: Number(e.parameter.skor_sop) || 0,
        skor_manajemen: Number(e.parameter.skor_manajemen) || 0,
        skor_dokumentasi: Number(e.parameter.skor_dokumentasi) || 0,
        skor_total: Number(e.parameter.skor_total) || 0,
        kategori: e.parameter.kategori || '',
        catatan: e.parameter.catatan || '',
        rekomendasi: e.parameter.rekomendasi || '',
        target_perbaikan: e.parameter.target_perbaikan || '',
        detail_scores: e.parameter.detail_scores || ''
      };
    }
    // Metode 2 (fallback): Baca dari JSON body (jika dikirim via fetch)
    else if (e.postData && e.postData.contents) {
      Logger.log('Membaca data dari postData.contents (JSON)');
      try {
        data = JSON.parse(e.postData.contents);
      } catch (parseErr) {
        Logger.log('Gagal parse JSON: ' + parseErr.toString());
        // Metode 3: coba baca payload field (JSON dalam 1 field)
        if (e.parameter && e.parameter.payload) {
          data = JSON.parse(e.parameter.payload);
        }
      }
    }

    Logger.log('Data yang akan disimpan: ' + JSON.stringify(data));
    
    // Simpan ke sheet
    simpanDataSupervisi(data);
    
    Logger.log('Data berhasil disimpan!');
    
    // Return HTML response (karena form + iframe memerlukan HTML, bukan JSON)
    return HtmlService.createHtmlOutput(
      '<html><body><p>Data berhasil disimpan.</p></body></html>'
    );

  } catch (err) {
    Logger.log('doPost ERROR: ' + err.toString());
    return HtmlService.createHtmlOutput(
      '<html><body><p>Error: ' + err.toString() + '</p></body></html>'
    );
  }
}

// =====================================================================
// TEST: Jalankan fungsi ini dari editor untuk tes simpan data
// Pilih fungsi "testSaveData" lalu klik ▶ Run
// Kemudian cek sheet Data_Supervisi — harus ada 1 baris baru
// =====================================================================
function testSaveData() {
  const testData = {
    tanggal: '2026-04-01',
    supervisor: 'TEST SUPERVISOR',
    ruangan: 'Ruang Mawar',
    nama_perawat: 'TEST PERAWAT',
    jabatan: 'Perawat Pelaksana',
    shift: 'Pagi (07.00-14.00)',
    skor_askep: 85,
    skor_sop: 80,
    skor_manajemen: 75,
    skor_dokumentasi: 90,
    skor_total: 82,
    kategori: 'Baik',
    catatan: 'Test data dari script editor',
    rekomendasi: 'Test rekomendasi',
    target_perbaikan: '2026-04-30',
    detail_scores: '{}'
  };
  
  const result = simpanDataSupervisi(testData);
  Logger.log('Test result: ' + JSON.stringify(result));
  
  // Tampilkan alert
  SpreadsheetApp.getUi().alert(
    'Test berhasil! Cek sheet Data_Supervisi — harus ada baris baru dengan nama "TEST PERAWAT".\n\n' +
    'Jika baris muncul, berarti backend sudah benar.\n' +
    'Hapus baris test tersebut setelah selesai mengecek.'
  );
}

// =====================================================================
// doGet — mengirim data ke rekap.html dan dashboard.html
// =====================================================================
function doGet(e) {
  const action = e?.parameter?.action || 'getData';
  const ss = SpreadsheetApp.getActiveSpreadsheet();

  try {
    if (action === 'getData') {
      const sheet = ss.getSheetByName(SHEET_DATA);
      if (!sheet || sheet.getLastRow() <= 1) {
        return jsonResponse({ data: [] });
      }
      const rows = sheet.getDataRange().getValues();
      const headers = rows[0];
      const data = rows.slice(1).map(row => {
        const obj = {};
        headers.forEach((h, i) => {
          const key = h.toLowerCase().replace(/[^a-z0-9]/g, '_');
          obj[key] = row[i] instanceof Date
            ? row[i].toISOString().split('T')[0]
            : row[i];
        });
        // Normalisasi field name agar cocok dengan JS
        return {
          tanggal: obj.tanggal_supervisi,
          supervisor: obj.nama_supervisor,
          ruangan: obj.ruangan,
          nama_perawat: obj.nama_perawat,
          jabatan: obj.jabatan,
          shift: obj.shift,
          skor_askep: Number(obj.skor_askep) || 0,
          skor_sop: Number(obj.skor_sop) || 0,
          skor_manajemen: Number(obj.skor_manajemen) || 0,
          skor_dokumentasi: Number(obj.skor_dokumentasi) || 0,
          skor_total: Number(obj.skor_total) || 0,
          kategori: obj.kategori,
          catatan: obj.catatan,
          rekomendasi: obj.rekomendasi,
          target_perbaikan: obj.target_perbaikan
        };
      }).filter(d => d.tanggal); // buang baris kosong
      return jsonResponse({ data });
    }

    if (action === 'getStats') {
      const sheet = ss.getSheetByName(SHEET_DATA);
      if (!sheet || sheet.getLastRow() <= 1) {
        return jsonResponse({ total: 0, rata: 0 });
      }
      const rows = sheet.getDataRange().getValues().slice(1);
      const now = new Date();
      const bulanIni = rows.filter(r => {
        const t = r[1] instanceof Date ? r[1] : new Date(r[1]);
        return t.getMonth() === now.getMonth() && t.getFullYear() === now.getFullYear();
      });
      const rata = bulanIni.length
        ? Math.round(bulanIni.reduce((a,r) => a + (Number(r[11])||0), 0) / bulanIni.length)
        : 0;
      return jsonResponse({ total: rows.length, bulan: bulanIni.length, rata });
    }

    if (action === 'saveData') {
      // Menerima data dari form.html via GET request (bypass CORS)
      const jsonData = e.parameter.data;
      if (!jsonData) {
        return jsonResponse({ status: 'error', message: 'Parameter data kosong.' });
      }
      try {
        const data = JSON.parse(jsonData);
        simpanDataSupervisi(data);
        return jsonResponse({ status: 'ok', message: 'Data berhasil disimpan.' });
      } catch (parseErr) {
        return jsonResponse({ status: 'error', message: 'Gagal parse data: ' + parseErr.toString() });
      }
    }

    if (action === 'getMasterStaf') {
      const sheet = ss.getSheetByName(SHEET_STAF);
      if (!sheet) return jsonResponse({ staf: [] });
      const rows = sheet.getDataRange().getValues().slice(1);
      const staf = rows.map(r => ({
        nama: r[0], jabatan: r[1], ruangan: r[2]
      })).filter(s => s.nama);
      return jsonResponse({ staf });
    }

    return jsonResponse({ error: 'Action tidak dikenal: ' + action });

  } catch (err) {
    return jsonResponse({ error: err.toString() });
  }
}

// =====================================================================
// Shared: simpan data supervisi ke sheet
// =====================================================================
function simpanDataSupervisi(data) {
  const ss = SpreadsheetApp.getActiveSpreadsheet();

  // Pastikan sheet Data_Supervisi ada
  let sheet = ss.getSheetByName(SHEET_DATA);
  if (!sheet) {
    sheet = ss.insertSheet(SHEET_DATA);
    sheet.appendRow(HEADERS);
    const hRange = sheet.getRange(1, 1, 1, HEADERS.length);
    hRange.setFontWeight('bold');
    hRange.setBackground('#185FA5');
    hRange.setFontColor('#ffffff');
    sheet.setFrozenRows(1);
  }

  // Tambahkan baris data baru
  sheet.appendRow([
    new Date(),                          // Timestamp
    data.tanggal || '',                  // Tanggal supervisi
    data.supervisor || '',               // Nama supervisor
    data.ruangan || '',                  // Ruangan
    data.nama_perawat || '',             // Nama perawat
    data.jabatan || '',                  // Jabatan
    data.shift || '',                    // Shift
    data.skor_askep || 0,               // Skor aspek A
    data.skor_sop || 0,                 // Skor aspek B
    data.skor_manajemen || 0,           // Skor aspek C
    data.skor_dokumentasi || 0,         // Skor aspek D
    data.skor_total || 0,               // Skor total
    data.kategori || '',                 // Kategori
    data.catatan || '',                  // Catatan
    data.rekomendasi || '',              // Rekomendasi
    data.target_perbaikan || '',         // Target perbaikan
    data.detail_scores || ''             // JSON detail skor
  ]);

  // Auto-update rekap bulanan
  updateRekapBulanan(ss);
  
  return { status: 'ok' };
}

// =====================================================================
// Helper: update rekap bulanan otomatis
// =====================================================================
function updateRekapBulanan(ss) {
  const dataSheet = ss.getSheetByName(SHEET_DATA);
  if (!dataSheet || dataSheet.getLastRow() <= 1) return;

  let rekapSheet = ss.getSheetByName(SHEET_REKAP);
  if (!rekapSheet) {
    rekapSheet = ss.insertSheet(SHEET_REKAP);
    rekapSheet.appendRow([
      'Bulan', 'Jumlah_Supervisi', 'Rata_Skor_Total',
      'Rata_Askep', 'Rata_SOP', 'Rata_Manajemen', 'Rata_Dokumentasi',
      'Jml_Sangat_Baik', 'Jml_Baik', 'Jml_Cukup', 'Jml_Kurang'
    ]);
    rekapSheet.getRange(1,1,1,11).setFontWeight('bold').setBackground('#185FA5').setFontColor('#ffffff');
    rekapSheet.setFrozenRows(1);
  }

  const rows = dataSheet.getDataRange().getValues().slice(1);
  const byMonth = {};

  rows.forEach(r => {
    const tgl = r[1] instanceof Date ? r[1] : new Date(r[1]);
    if (isNaN(tgl)) return;
    const key = Utilities.formatDate(tgl, Session.getScriptTimeZone(), 'yyyy-MM');
    if (!byMonth[key]) byMonth[key] = { scores: [], askep: [], sop: [], mgmt: [], dok: [], cats: {} };
    byMonth[key].scores.push(Number(r[11]) || 0);
    byMonth[key].askep.push(Number(r[7]) || 0);
    byMonth[key].sop.push(Number(r[8]) || 0);
    byMonth[key].mgmt.push(Number(r[9]) || 0);
    byMonth[key].dok.push(Number(r[10]) || 0);
    const kat = r[12] || 'Tidak Diketahui';
    byMonth[key].cats[kat] = (byMonth[key].cats[kat] || 0) + 1;
  });

  const avg = arr => arr.length ? Math.round(arr.reduce((a,b)=>a+b,0)/arr.length) : 0;

  // Clear existing rekap (keep header)
  if (rekapSheet.getLastRow() > 1) {
    rekapSheet.getRange(2, 1, rekapSheet.getLastRow() - 1, 11).clearContent();
  }

  const sortedMonths = Object.keys(byMonth).sort();
  sortedMonths.forEach((month, i) => {
    const m = byMonth[month];
    rekapSheet.getRange(i + 2, 1, 1, 11).setValues([[
      month,
      m.scores.length,
      avg(m.scores),
      avg(m.askep),
      avg(m.sop),
      avg(m.mgmt),
      avg(m.dok),
      m.cats['Sangat Baik'] || 0,
      m.cats['Baik'] || 0,
      m.cats['Cukup'] || 0,
      m.cats['Kurang'] || 0
    ]]);
  });
}

// =====================================================================
// Helper: JSON response dengan CORS header
// =====================================================================
function jsonResponse(data) {
  return ContentService
    .createTextOutput(JSON.stringify(data))
    .setMimeType(ContentService.MimeType.JSON);
}

// =====================================================================
// Setup awal — jalankan sekali untuk membuat semua sheet
// =====================================================================
function setupSheets() {
  const ss = SpreadsheetApp.getActiveSpreadsheet();

  // Sheet Data_Supervisi
  let s1 = ss.getSheetByName(SHEET_DATA);
  if (!s1) {
    s1 = ss.insertSheet(SHEET_DATA);
    s1.appendRow(HEADERS);
    s1.getRange(1,1,1,HEADERS.length).setFontWeight('bold').setBackground('#185FA5').setFontColor('#ffffff');
    s1.setFrozenRows(1);
    s1.setColumnWidth(1, 130); // Timestamp
    s1.setColumnWidth(4, 160); // Ruangan
    s1.setColumnWidth(5, 200); // Nama perawat
    s1.setColumnWidth(14, 300); // Catatan
  }

  // Sheet Rekap_Bulanan
  let s2 = ss.getSheetByName(SHEET_REKAP);
  if (!s2) {
    s2 = ss.insertSheet(SHEET_REKAP);
    s2.appendRow([
      'Bulan', 'Jumlah_Supervisi', 'Rata_Skor_Total',
      'Rata_Askep', 'Rata_SOP', 'Rata_Manajemen', 'Rata_Dokumentasi',
      'Jml_Sangat_Baik', 'Jml_Baik', 'Jml_Cukup', 'Jml_Kurang'
    ]);
    s2.getRange(1,1,1,11).setFontWeight('bold').setBackground('#185FA5').setFontColor('#ffffff');
    s2.setFrozenRows(1);
  }

  // Sheet Master_Staf
  let s3 = ss.getSheetByName(SHEET_STAF);
  if (!s3) {
    s3 = ss.insertSheet(SHEET_STAF);
    s3.appendRow(['Nama_Perawat', 'Jabatan', 'Ruangan']);
    s3.getRange(1,1,1,3).setFontWeight('bold').setBackground('#185FA5').setFontColor('#ffffff');
    s3.setFrozenRows(1);
    // Contoh data staf
    const contoh = [
      ['Ns. Siti Rahayu, S.Kep', 'Kepala Ruangan', 'Ruang Mawar'],
      ['Ns. Budi Santoso, S.Kep', 'Perawat Pelaksana', 'Ruang Mawar'],
      ['Ns. Ahmad Fauzi, S.Kep', 'Kepala Ruangan', 'Ruang Melati'],
      ['Ns. Rina Wulandari, S.Kep', 'Perawat Pelaksana', 'Ruang Melati'],
    ];
    s3.getRange(2, 1, contoh.length, 3).setValues(contoh);
  }

  SpreadsheetApp.getUi().alert('Setup selesai! Sheet berhasil dibuat. Silakan deploy sebagai Web App.');
}
