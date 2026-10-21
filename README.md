ASTER MONEV 2026 — FRONTEND VERCEL + GOOGLE APPS SCRIPT BACKEND

Isi paket:
- index.html: frontend statis hasil konversi Index.html yang Anda unggah; tampilan, pertanyaan, navigasi, NIP, dropdown wilayah, validasi, dan modal konfirmasi dipertahankan.
- api/submit.js: proxy server-side Vercel menuju Google Apps Script.
- CODE_GS_ADD_DOPOST.txt: fungsi doPost tambahan untuk ditempel ke Code.gs yang ada.
- package.json, vercel.json, .env.example.

PERSIAPAN BACKEND GOOGLE APPS SCRIPT
1. Buka proyek Apps Script yang sekarang terhubung ke spreadsheet respons.
2. Tempel isi CODE_GS_ADD_DOPOST.txt di bagian paling bawah Code.gs. Jangan mengganti atau menghapus fungsi lama.
3. Apps Script > Project Settings > Script properties, tambahkan:
   VERCEL_API_SECRET = rahasia acak panjang minimal 32 karakter.
   Gunakan password manager untuk membuatnya. Jangan taruh secret di index.html atau GitHub.
4. Deploy > Manage deployments > Edit > New version > Deploy sebagai Web app.
   Execute as: Me.
   Who has access: sesuai opsi yang diizinkan kebijakan instansi. Endpoint yang diakses Vercel harus dapat menerima permintaan; shared secret memeriksa akses aplikasi.
5. Salin URL deployment /exec.

KONFIGURASI VERCEL
1. Unggah folder ini ke repository GitHub lalu import repository ke Vercel.
2. Project Settings > Environment Variables, tambahkan:
   GAS_WEB_APP_URL = URL Apps Script /exec
   GAS_SHARED_SECRET = nilai sama dengan VERCEL_API_SECRET
3. Tambahkan untuk Production (dan Preview jika diperlukan), lalu redeploy.
4. Buka URL Vercel dan kirim satu respons uji. Pastikan masuk ke sheet Respons Monev ASTER.

KEAMANAN
- Secret hanya berada di Vercel server function dan Script Properties, bukan browser.
- Batasi akses repository/Vercel project dan lindungi akun Google.
- Web App Apps Script mungkin perlu dapat dipanggil tanpa login untuk menerima request Vercel, tergantung konfigurasi akun/organisasi. Ikuti kebijakan instansi sebelum memilih akses publik.
- Shared secret adalah kontrol akses untuk endpoint, bukan autentikasi per pengguna. Untuk membatasi berdasarkan akun organisasi, perlu tambahan Google OAuth atau kontrol identitas lain.
- Frontend mengunci tombol selama pengiriman dan setelah berhasil, tetapi belum menyediakan idempotency key untuk mengatasi dua request server yang simultan.
- Jangan mencatat NIP atau isi jawaban pada log.
- Periksa apakah kebijakan instansi mengizinkan frontend pada Vercel, karena instrumen dapat berisi informasi internal.

CATATAN
Data wilayah dipertahankan dari Index.html yang diunggah. Periksa daftar wilayah master sebelum produksi. Jangan menjalankan setupSpreadsheet() pada spreadsheet respons yang sudah berisi data, karena fungsi tersebut membersihkan sheet.
