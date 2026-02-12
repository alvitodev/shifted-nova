import { getCollection, render } from 'astro:content'
import type { CollectionEntry } from 'astro:content'

// =============================================================================
// TYPES (PENTING: INI YANG HILANG SEBELUMNYA)
// =============================================================================

export type TOCHeading = {
  slug: string
  text: string
  depth: number
  isSubpostTitle?: boolean
}

export type TOCSection = {
  type: 'parent' | 'subpost'
  title: string
  headings: TOCHeading[]
  subpostId?: string
}

// =============================================================================
// CORE DATA FETCHING
// =============================================================================

export async function getAllWriting(): Promise<CollectionEntry<'writing'>[]> {
  const posts = await getCollection('writing')
  return posts.sort((a, b) => b.data.publishDate.valueOf() - a.data.publishDate.valueOf())
}

export async function getAllWork(): Promise<CollectionEntry<'work'>[]> {
  const projects = await getCollection('work')
  return projects.sort((a, b) => b.data.publishDate.valueOf() - a.data.publishDate.valueOf())
}

// ALIASES FOR COMPATIBILITY
export const getAllPosts = getAllWriting
export const getAllProjects = getAllWork
export const getAllPostsAndSubposts = getAllWriting 

// =============================================================================
// SINGLE POST RETRIEVAL
// =============================================================================

export async function getPost(id: string): Promise<CollectionEntry<'writing'> | undefined> {
  const posts = await getAllWriting()
  return posts.find((post) => post.id === id)
}

export const getPostById = getPost 

// =============================================================================
// SUBPOSTS & NAVIGATION LOGIC
// =============================================================================

export function isSubpost(id: string): boolean {
  return id.includes('/')
}

export function getParentId(id: string): string {
  return id.split('/')[0]
}

export async function getParentPost(id: string): Promise<CollectionEntry<'writing'> | undefined> {
  const parentId = getParentId(id)
  return getPost(parentId)
}

export async function getSubposts(id: string): Promise<CollectionEntry<'writing'>[]> {
  const posts = await getAllWriting()
  return posts
    .filter((post) => post.id.startsWith(`${id}/`) && post.id !== id)
    .sort((a, b) => a.data.publishDate.valueOf() - b.data.publishDate.valueOf())
}

export const getSubpostsForParent = getSubposts

export async function hasSubposts(id: string): Promise<boolean> {
  const subposts = await getSubposts(id)
  return subposts.length > 0
}

export async function getSubpostCount(id: string): Promise<number> {
  const subposts = await getSubposts(id)
  return subposts.length
}

export async function getAdjacentPosts(id: string) {
  const posts = await getAllWriting()
  const isSub = isSubpost(id)
  const parentId = isSub ? getParentId(id) : id
  
  const siblings = posts.filter(p => {
    if (isSub) return getParentId(p.id) === parentId
    return !isSubpost(p.id)
  }).sort((a, b) => b.data.publishDate.valueOf() - a.data.publishDate.valueOf())

  const index = siblings.findIndex((p) => p.id === id)
  
  return {
    newer: index > 0 ? siblings[index - 1] : undefined,
    older: index < siblings.length - 1 ? siblings[index + 1] : undefined,
    parent: isSub ? await getPost(parentId) : undefined
  }
}

// =============================================================================
// READING TIME & TOC LOGIC
// =============================================================================

export async function getPostReadingTime(id: string): Promise<string> {
  const post = await getPost(id)
  if (!post) return '0 min read'
  
  const { remarkPluginFrontmatter } = await render(post)
  const minutes = remarkPluginFrontmatter?.minutesRead || 0
  return `${Math.ceil(minutes)} min read`
}

export async function getCombinedReadingTime(id: string): Promise<string> {
  const post = await getPost(id)
  if (!post) return '0 min read'

  let totalMinutes = 0
  const { remarkPluginFrontmatter } = await render(post)
  totalMinutes += remarkPluginFrontmatter?.minutesRead || 0

  if (await hasSubposts(id)) {
    const subposts = await getSubposts(id)
    for (const subpost of subposts) {
      const { remarkPluginFrontmatter: subProps } = await render(subpost)
      totalMinutes += subProps?.minutesRead || 0
    }
  }
  return `${Math.ceil(totalMinutes)} min read`
}

export async function getTOCSections(id: string): Promise<TOCSection[]> {
  const post = await getPost(id)
  if (!post) return []
  
  // 1. Ambil headings dari post saat ini
  const { headings } = await render(post)
  
  // 2. Format headings agar sesuai tipe TOCHeading
  const formattedHeadings: TOCHeading[] = headings
    .filter((h) => h.depth <= 3)
    .map(h => ({
      slug: h.slug,
      text: h.text,
      depth: h.depth,
      isSubpostTitle: false
    }))

  // 3. Kembalikan array of TOCSection (Wajib array agar map di sidebar berjalan)
  return [{
    type: 'parent',
    title: post.data.title,
    headings: formattedHeadings
  }]
}

// =============================================================================
// FORMATTER UTILS
// =============================================================================

export function formatDate(date: Date): string {
  return new Intl.DateTimeFormat('en-GB', {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
  }).format(date);
}

// =============================================================================
// DUMMY UTILS
// =============================================================================

export async function parseAuthors(_authors: string[]) { return [] }
export async function getPostsByAuthor(_authorId: string) { return [] }
export async function getAllAuthors() { return [] }
