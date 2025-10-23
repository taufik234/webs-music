# 🎵 Webs Music

**Webs Music** adalah proyek berbasis **TypeScript** dan **JavaScript** yang terdiri dari dua bagian utama — **frontend** dan **backend**.  
Tujuannya adalah untuk membuat platform musik berbasis web yang dapat memutar, mengelola, dan menampilkan daftar musik secara interaktif.

---

## 📚 Daftar Isi

- [Struktur Proyek](#-struktur-proyek)
- [Teknologi yang Digunakan](#-teknologi-yang-digunakan)
- [Prasyarat Instalasi](#-prasyarat-instalasi)
- [Instalasi](#-instalasi)
- [Menjalankan Proyek](#-menjalankan-proyek)
- [Contoh Penggunaan](#-contoh-penggunaan)
- [Konfigurasi Tambahan](#-konfigurasi-tambahan)
- [Fitur](#-fitur)
- [Kontributor](#-kontributor)
- [Lisensi](#-lisensi)

---

## 🗂️ Struktur Proyek

```
webs-music/
├── backend/          # Server-side API & logic
│   ├── src/
│   ├── package.json
│   └── ...
│
├── frontend/         # Aplikasi web client (React/TypeScript)
│   ├── src/
│   ├── public/
│   ├── package.json
│   └── ...
│
├── package.json      # Konfigurasi root (jika ada monorepo)
├── package-lock.json
└── .gitignore
```

Struktur ini memisahkan sisi **backend (server)** dan **frontend (client)** untuk memudahkan pengembangan terpisah namun tetap terintegrasi.

---

## ⚙️ Teknologi yang Digunakan

| Komponen        | Teknologi Utama                |
| --------------- | ------------------------------ |
| **Frontend**    | React, TypeScript, HTML, CSS   |
| **Backend**     | Node.js, Express (kemungkinan) |
| **Build Tools** | npm / yarn                     |
| **Database**    | (Supabase)                     |

---

## 📦 Prasyarat Instalasi

Sebelum memulai, pastikan Anda telah menginstal:

- [Node.js](https://nodejs.org/) **v16.x** atau lebih baru
- [npm](https://www.npmjs.com/) atau [yarn](https://yarnpkg.com/)
- [Git](https://git-scm.com/)

---

## 🛠️ Instalasi

Clone repository ke komputer lokal Anda:

```bash
git clone https://github.com/taufik234/webs-music.git
cd webs-music
```

Kemudian instal semua dependensi:

```bash
npm install
```

Jika frontend dan backend memiliki `package.json` terpisah, jalankan instalasi pada masing-masing folder:

```bash
cd backend
npm install

cd ../frontend
npm install
```

---

## ▶️ Menjalankan Proyek

### Jalankan Backend

```bash
cd backend
npm start
```

Server backend akan berjalan di `http://localhost:5000` (default).

### Jalankan Frontend

```bash
cd frontend
npm run dev
```

Aplikasi frontend biasanya akan berjalan di `http://localhost:3000`.

---

## 💡 Contoh Penggunaan

1. Jalankan backend dan frontend sesuai langkah di atas.
2. Buka browser dan akses `http://localhost:3000`.
3. Pilih lagu dari daftar yang tersedia.
4. Tekan tombol **Play** untuk memutar musik.
5. Anda dapat menambahkan lagu ke daftar putar dan mengontrol pemutaran.

---

## ⚙️ Konfigurasi Tambahan

Beberapa konfigurasi (jika digunakan) dapat ditentukan dalam file `.env`:

```env
# Konfigurasi server
PORT=5000

# Jika menggunakan subabase atau database lain
DATABASE_URL=your_database_url

# Token keamanan
JWT_SECRET=your_secret_key
```

Pastikan untuk **tidak meng-commit file `.env`** ke GitHub demi keamanan.

---

## ✨ Fitur

- 🎧 Pemutaran musik berbasis web
- 📁 Manajemen playlist
- 🔍 Pencarian lagu
- ⚙️ API backend untuk streaming dan data musik
- 💻 Tampilan modern berbasis React (frontend)
- 🧩 Struktur modular (frontend & backend terpisah)

---

## 🧑‍💻 Kontributor

Proyek ini dibuat dan dikembangkan oleh:

- [**taufik234**](https://github.com/taufik234)

---

> **Webs Music** — dengarkan, kembangkan, dan nikmati musik di web Anda! 🎶
