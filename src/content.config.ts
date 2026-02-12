import { defineCollection, z } from 'astro:content';
import { glob } from 'astro/loaders';

// 1. WRITING (Ex-Blog) - Perbaikan Schema Image & Date
const writing = defineCollection({
  loader: glob({ pattern: "**/*.{md,mdx}", base: "./src/content/writing" }),
  schema: ({ image }) => z.object({
    title: z.string(),
    description: z.string(),
    // Gunakan coerce.date() agar aman membaca string tanggal
    publishDate: z.coerce.date(), 
    updatedDate: z.coerce.date().optional(),
    // Gunakan helper image()
    heroImage: image().optional(),
    banner: image().optional(), 
    tags: z.array(z.string()).optional(),
    isFeatured: z.boolean().default(false),
    category: z.enum(['technical', 'opinion', 'tutorial']).default('technical'),
  }),
});

// 2. WORK (Ex-Projects) - Perbaikan Schema Image & Date
const work = defineCollection({
  loader: glob({ pattern: "**/*.{md,mdx}", base: "./src/content/work" }),
  schema: ({ image }) => z.object({
    title: z.string(),
    description: z.string(),
    publishDate: z.coerce.date(),
    heroImage: image().optional(),
    techStack: z.array(z.string()).default([]),
    repoLink: z.string().url().optional(),
    demoLink: z.string().url().optional(),
    status: z.enum(['completed', 'in-progress', 'maintained']).default('completed'),
  }),
});

// 3. NOTES
const notes = defineCollection({
  loader: glob({ pattern: "**/*.{md,mdx}", base: "./src/content/notes" }),
  schema: z.object({
    title: z.string(),
    publishDate: z.coerce.date(),
    tags: z.array(z.string()).optional(),
  }),
});

// 4. FEED
const feed = defineCollection({
  loader: glob({ pattern: "**/*.{md,mdx}", base: "./src/content/feed" }),
  schema: z.object({
    publishDate: z.coerce.date(),
    image: z.string().optional(),
    spotifyEmbed: z.string().optional(),
  }),
});

// 5. LIBRARY
const library = defineCollection({
  loader: glob({ pattern: "**/*.json", base: "./src/content/library" }),
  schema: z.object({
    id: z.string(),
    title: z.string(),
    type: z.enum(['book', 'movie', 'tv', 'game']),
    status: z.enum(['finished', 'reading', 'watching', 'playing', 'dropped', 'wishlist']),
    rating: z.number().min(0).max(5).optional(),
    dateFinished: z.coerce.date().optional(),
    coverImage: z.string().optional(),
    creator: z.string().optional(),
  }),
});

// 6. GALLERY
const gallery = defineCollection({
  loader: glob({ pattern: "**/*.json", base: "./src/content/gallery" }),
  schema: z.object({
    id: z.string(),
    title: z.string(),
    image: z.string(),
    dateTaken: z.coerce.date(),
    location: z.string().optional(),
    camera: z.string().optional(),
  }),
});

// 7. AUTHORS (Dipertahankan agar tidak error import)
const authors = defineCollection({
  loader: glob({ pattern: "**/*.{md,mdx}", base: "./src/content/authors" }),
  schema: z.object({
    name: z.string(),
    avatar: z.string().optional(),
    about: z.string().optional(),
    email: z.string().optional(),
    mail: z.string().optional(),
    bio: z.string().optional(),
    pronouns: z.string().optional(),
    website: z.string().optional(),
    linkedin: z.string().optional(),
    twitter: z.string().optional(),
    github: z.string().optional(),
  }),
});

export const collections = { 
  writing, 
  work, 
  notes, 
  feed, 
  library, 
  gallery, 
  authors 
};
