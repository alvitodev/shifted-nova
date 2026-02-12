# ALVITO.DEV // COMMAND CENTER

![System Status](https://img.shields.io/badge/SYSTEM-OPERATIONAL-success?style=for-the-badge&logo=rss)
![Astro](https://img.shields.io/badge/ASTRO-5.0-orange?style=for-the-badge&logo=astro)
![Tailwind](https://img.shields.io/badge/TAILWIND-v4-blue?style=for-the-badge&logo=tailwindcss)
![React](https://img.shields.io/badge/REACT-ISLANDS-blue?style=for-the-badge&logo=react)

> **"A digital garden containing technical logs, projects, and visual databanks. Designed with Industrial Sci-Fi aesthetics."**

---

## 📂 MISSION BRIEF

Website ini bukan sekadar portofolio, melainkan sebuah **Command Center** digital. Dibangun menggunakan **Astro** untuk performa maksimal, dipadukan dengan **React** untuk interaktivitas, dan dibalut dengan **Tailwind CSS** untuk styling bertema Cyberpunk/Industrial.

### 🚀 KEY FEATURES

#### 1. VISUAL SYSTEM: "INDUSTRIAL DARK"

- **Palette:** Zinc-950 (Void Black) & Yellow-400 (Industrial Yellow).
- **Typography:** `JetBrains Mono` untuk elemen teknis, `Plus Jakarta Sans` untuk keterbacaan.
- **Effects:** CRT Scanlines, Vignette, Grid Background, dan Glitch Hover effects.

#### 2. CORE MODULES

- **DASHBOARD (`/`)**: Halaman utama bergaya "Control Panel" dengan ringkasan aktivitas terbaru dan widget dinamis.
- **NEURAL LOGS (`/writing`)**: Blog teknis dengan sistem tab filter interaktif (Technical, Opinion, Featured) menggunakan **React Islands**.
- **ACTIVE PROTOCOLS (`/work`)**: Galeri proyek dengan layout responsif dan efek visual premium.
- **PERSONNEL FILE (`/about`)**: Halaman profil dengan informasi lengkap dan social links.

#### 3. DATABANKS (CONTENT COLLECTIONS)

- **`/notes`**: Catatan cepat dan tips teknis.
- **`/feed`**: Micro-blogging timeline untuk update status dan insights.
- **`/library`**: Database buku, film, dan game yang dikonsumsi.
- **`/gallery`**: Koleksi visual dan fotografi.

---

## 🛠️ TECH STACK

| Component          | Technology                                 | Peran                                             |
| :----------------- | :----------------------------------------- | :------------------------------------------------ |
| **Core Framework** | [Astro](https://astro.build)               | Static Site Generator ultra-cepat.                |
| **Styling**        | [Tailwind CSS v4](https://tailwindcss.com) | Utility-first CSS framework.                      |
| **Interactivity**  | [React](https://react.dev)                 | Astro Islands untuk komponen dinamis.             |
| **Icons**          | Lucide React                               | Ikon vektor bersih dan konsisten.                 |
| **Content**        | [MDX](https://mdxjs.com)                   | Markdown + JSX untuk konten yang kaya.            |
| **Typography**     | JetBrains Mono & Plus Jakarta Sans         | Google Fonts via @fontsource.                     |
| **CI/CD**          | GitHub Actions                             | Otomatisasi build dan deployment ke GitHub Pages. |

---

## 📂 SYSTEM ARCHITECTURE

```
src/
├── components/         # Komponen UI & Layout
│   ├── react/          # React Islands (Interactive Components)
│   └── ui/             # Reusable UI Components
├── content/            # Content Collections
│   ├── writing/        # Long-form articles & blog posts
│   ├── work/           # Portfolio projects
│   ├── notes/          # Quick snippets
│   ├── feed/           # Timeline updates
│   ├── library/        # Media database
│   ├── gallery/        # Visual collection
│   └── authors/        # Author metadata
├── layouts/            # Page templates
├── lib/                # Utility functions
├── pages/              # File-based routing (Astro routes)
└── styles/             # Global CSS & Tailwind config
```

---

## ⚡ INITIALIZATION SEQUENCE

Ikuti langkah ini untuk menjalankan sistem di mesin lokal.

### 1. Clone Repository

```bash
git clone https://github.com/alvitodev/alvitodev.github.io.git
cd alvitodev.github.io
```

### 2. Install Dependencies

```bash
npm install
```

### 3. Launch Dev Server

```bash
npm run dev
```

Akses di `http://localhost:4321`.

### 4. Build for Production

```bash
npm run build
```

---

## 📝 CONTENT MANAGEMENT

### Struktur Branch & Deployment

- **`dev` Branch (Source):** Menampung seluruh source code Astro.
- **`main` Branch (Build Output):** Hasil build (`dist/`) yang di-deploy ke GitHub Pages.

Setiap push ke branch `dev` akan otomatis di-build dan di-deploy melalui **GitHub Actions**.

### Menambah Konten Baru

#### Writing / Blog Post

Buat folder baru di `src/content/writing/judul-artikel/index.mdx`:

```markdown
---
title: 'Judul Artikel'
description: 'Deskripsi singkat...'
publishDate: 2025-12-10
category: 'technical'
isFeatured: false
tags: ['astro', 'tutorial']
---

Isi artikel di sini...
```

#### Work / Projects

Buat folder baru di `src/content/work/nama-proyek/index.mdx`:

```markdown
---
title: 'Project Name'
description: 'Deskripsi proyek...'
publishDate: 2025-01-01
status: 'completed'
techStack: ['React', 'Node.js', 'Astro']
demoLink: 'https://...'
repoLink: 'https://...'
---

Detail studi kasus...
```

#### Notes / Quick Snippets

Buat file di `src/content/notes/judul-catatan.md`.

#### Feed / Updates

Buat file di `src/content/feed/YYYY-MM-DD-update.md`.

---

## 📋 PROJECT STATUS

- [x] Astro 5.0 Setup
- [x] Tailwind CSS v4 Integration
- [x] React Islands (Interactive Components)
- [x] Content Collections
- [x] Dynamic Routing
- [x] GitHub Actions CI/CD
- [ ] Advanced customization & features

---

## © LICENSE

All source code is protected under **MIT License**. Content and Assets are property of **Alvito.dev**.

```
SYSTEM_REVISION: 2025.12.10
STATUS: OPERATIONAL
END_OF_FILE
```
