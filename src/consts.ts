// Place any global data in this file.
// You can import this data from anywhere in your site by using the `import` keyword.

export const SITE = {
  title: 'Alvito.dev',
  description:
    'Command Center for Muhammad Alvito Devanova. A digital garden containing technical logs, projects, and visual databanks.',
  locale: 'id-ID', // Diset ke Indonesia karena target audiens/bahasa konten dominan
  url: 'https://alvitodev.github.io', 
  author: 'Muhammad Alvito Devanova',
  twitter: '@alvitodev', 
}

// Navigasi Global (Opsional, jika ingin dipusatkan di sini)
export const NAV_ITEMS = [
  { href: '/', label: 'HOME' },
  { href: '/writing', label: 'WRITING' },
  { href: '/work', label: 'WORK' },
  { href: '/notes', label: 'NOTES' },
  { href: '/feed', label: 'FEED' },
  { href: '/library', label: 'LIBRARY' },
  { href: '/gallery', label: 'GALLERY' },
  { href: '/about', label: 'ABOUT' },
]

// Icon map for social links
export const ICON_MAP: Record<string, string> = {
  GitHub: 'mdi:github',
  Twitter: 'mdi:twitter',
  LinkedIn: 'mdi:linkedin',
  Email: 'mdi:email',
  // Add more as needed
}
