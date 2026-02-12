import { useState, useMemo } from 'react'

// Tipe data sederhana untuk props (agar tidak ribet import dari content collection)
type Post = {
  id: string
  title: string
  description: string
  publishDate: Date
  category: 'technical' | 'opinion' | 'tutorial'
  isFeatured: boolean
}

interface Props {
  posts: Post[]
}

export default function WritingDashboard({ posts }: Props) {
  // State untuk Tab yang aktif
  const [activeTab, setActiveTab] = useState<
    'all' | 'technical' | 'opinion' | 'featured'
  >('all')

  // Filter logika
  const filteredPosts = useMemo(() => {
    if (activeTab === 'all') return posts
    if (activeTab === 'featured') return posts.filter((p) => p.isFeatured)
    return posts.filter((p) => p.category === activeTab)
  }, [activeTab, posts])

  // Format tanggal (Helper function kecil)
  const formatDate = (date: Date) => {
    return new Intl.DateTimeFormat('en-GB', {
      day: 'numeric',
      month: 'short',
      year: 'numeric',
    }).format(new Date(date))
  }

  return (
    <div className="flex flex-col gap-8">
      {/* --- TAB CONTROLS --- */}
      <div className="flex flex-wrap gap-2 border-b border-zinc-800 pb-4">
        {['all', 'technical', 'opinion', 'featured'].map((tab) => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab as any)}
            className={`border px-4 py-1.5 font-mono text-xs tracking-wider uppercase transition-all duration-300 ${
              activeTab === tab
                ? 'border-yellow-500 bg-yellow-500 font-bold text-zinc-950 shadow-[0_0_10px_rgba(245,158,11,0.4)]'
                : 'border-zinc-800 bg-zinc-900/50 text-zinc-500 hover:border-zinc-600 hover:text-zinc-300'
            } `}
          >
            [{tab.toUpperCase()}]
          </button>
        ))}
      </div>

      {/* --- POST LIST --- */}
      <div className="animate-in fade-in slide-in-from-bottom-4 grid gap-4 duration-500">
        {filteredPosts.length === 0 ? (
          <div className="border border-dashed border-zinc-800 p-8 text-center font-mono text-sm text-zinc-600">
            // NO_DATA_FOUND_IN_SECTOR
          </div>
        ) : (
          filteredPosts.map((post) => (
            <a
              key={post.id}
              href={`/writing/${post.id}`}
              className="group relative block border border-zinc-800 bg-zinc-900/40 p-5 transition-all duration-300 hover:border-yellow-500/50 hover:bg-zinc-900"
            >
              {/* Dekorasi Hover di Kiri */}
              <div className="absolute top-0 left-0 h-full w-1 bg-yellow-500 opacity-0 transition-opacity group-hover:opacity-100" />

              <div className="flex flex-col gap-2 md:flex-row md:items-baseline md:justify-between">
                <h3 className="font-mono text-lg font-bold text-zinc-200 transition-colors group-hover:text-yellow-500">
                  {post.title}
                </h3>
                <span className="font-mono text-xs whitespace-nowrap text-zinc-600">
                  {formatDate(post.publishDate)}
                </span>
              </div>

              <p className="mt-2 line-clamp-2 max-w-2xl text-sm text-zinc-400">
                {post.description}
              </p>

              <div className="mt-3 flex gap-2">
                {/* Badge Kategori */}
                <span className="rounded border border-zinc-700 px-1.5 py-0.5 text-[10px] text-zinc-500 uppercase">
                  {post.category}
                </span>
                {post.isFeatured && (
                  <span className="rounded border border-yellow-900/50 bg-yellow-900/10 px-1.5 py-0.5 text-[10px] text-yellow-600 uppercase">
                    Featured
                  </span>
                )}
              </div>
            </a>
          ))
        )}
      </div>
    </div>
  )
}
