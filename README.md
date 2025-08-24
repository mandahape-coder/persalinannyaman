# 🏥 Sistem Deteksi Nyeri & Darurat Persalinan

Aplikasi berbasis web untuk memantau **skala nyeri pasien persalinan** secara real-time menggunakan kamera.  
Dilengkapi dengan **sistem darurat** untuk memanggil bantuan medis bila diperlukan.

---

## 🚀 Demo Online
Buka langsung di browser melalui GitHub Pages:  
👉 [Demo Aplikasi](https://USERNAME.github.io/sistem-deteksi-nyeri/)  
*(ganti `USERNAME` dengan username GitHub kamu)*

---

## 📌 Fitur Utama
- 📹 **Monitoring Kamera**: Menampilkan video real-time dari pasien.
- 📊 **Skala Nyeri Otomatis**: Estimasi skor nyeri (0–10).
- 🚨 **Sistem Darurat**: Tombol manual + auto-alert jika nyeri berat.
- 📸 **Snapshot**: Simpan foto kondisi saat ini.
- 📋 **Log Aktivitas**: Catatan semua event.

---

## 📂 Struktur Project
```
├── index.html
├── style.css
├── script.js
└── README.md
```

---

## ⚡ Cara Menjalankan
1. Clone repo ini:
   ```bash
   git clone https://github.com/USERNAME/sistem-deteksi-nyeri.git
   ```
2. Buka file `index.html` di browser.
3. Izinkan akses kamera.
4. Sistem akan mulai mendeteksi dan menampilkan log.

---

## ⚠️ Catatan
- Saat ini, skala nyeri masih berupa **simulasi acak**.
- Untuk pengembangan lebih lanjut, bisa integrasi **TensorFlow.js** untuk analisis ekspresi wajah.

---

## 👨‍💻 Pengembangan Lanjut
- Integrasi **AI/ML** untuk deteksi ekspresi wajah.
- Simpan data monitoring ke **database**.
- Kirim notifikasi darurat via **WhatsApp / SMS Gateway**.
