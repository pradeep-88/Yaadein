import React, { useEffect, useMemo, useState } from 'react'
import axios from '../../services/axiosInstances'
import FolderCard from './FolderCard'
import CreateFolderForm from './CreateFolderForm'
import UploadForm from './UploadForm'

export default function Dashboard() {
  const [folders, setFolders] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [q, setQ] = useState('')
  const [sortKey, setSortKey] = useState('updated') // 'updated' | 'name' | 'created'

  const fetchFolders = async () => {
    setError('')
    try {
      const res = await axios.get('/upload/folders')
      setFolders(res.data || [])
    } catch (err) {
      console.error('Failed to fetch folders', err)
      setError('Failed to load folders')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchFolders()
  }, [])

  const filtered = useMemo(() => {
    const term = q.trim().toLowerCase()
    const list = term
      ? folders.filter(f => (f.name || '').toLowerCase().includes(term))
      : folders.slice()

    list.sort((a, b) => {
      if (sortKey === 'name') return (a.name || '').localeCompare(b.name || '')
      if (sortKey === 'created') return new Date(b.createdAt) - new Date(a.createdAt)
      // default: updated
      return new Date(b.updatedAt || b.createdAt) - new Date(a.updatedAt || a.createdAt)
    })
    return list
  }, [folders, q, sortKey])

  if (loading) {
    return (
      <div className="p-4 space-y-6">
        {/* header skeleton */}
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div className="h-8 w-48 bg-gray-200/70 rounded" />
          <div className="flex gap-2">
            <div className="h-10 w-64 bg-gray-200/70 rounded" />
            <div className="h-10 w-28 bg-gray-200/70 rounded" />
          </div>
        </div>
        {/* card skeletons */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
          {[...Array(6)].map((_, i) => (
            <div key={i} className="rounded-xl border border-gray-200 p-4 shadow-sm">
              <div className="h-36 bg-gray-200/70 rounded mb-3" />
              <div className="h-5 w-1/2 bg-gray-200/70 rounded mb-2" />
              <div className="h-4 w-1/3 bg-gray-200/70 rounded" />
            </div>
          ))}
        </div>
      </div>
    )
  }

  return (
    <div className="p-4">
      {/* Sticky header bar with glass + gradient accent */}
      <div className="sticky top-0 z-10 backdrop-blur supports-[backdrop-filter]:bg-white/70 bg-white/80 border-b border-gray-100">
        <div className="py-3 flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            <h1 className="text-2xl font-semibold">Your Folders</h1>
            <span className="text-xs px-2 py-1 rounded-full bg-gradient-to-r from-blue-600/10 to-fuchsia-500/10 text-blue-700 border border-blue-200/60">
              {folders.length} total
            </span>
          </div>

          <div className="flex items-center gap-2">
            {/* Search */}
            <div className="relative">
              <svg className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" viewBox="0 0 24 24" fill="none">
                <circle cx="11" cy="11" r="7" stroke="currentColor" strokeWidth="2" />
                <path d="M20 20l-3.5-3.5" stroke="currentColor" strokeWidth="2" />
              </svg>
              <input
                value={q}
                onChange={e => setQ(e.target.value)}
                placeholder="Search folders..."
                className="pl-9 pr-3 py-2 rounded-md border border-gray-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 outline-none transition w-64 bg-white/90"
              />
            </div>

            {/* Sort */}
            <select
              value={sortKey}
              onChange={e => setSortKey(e.target.value)}
              className="py-2 px-3 rounded-md border border-gray-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 outline-none transition bg-white/90"
            >
              <option value="updated">Sort: Last updated</option>
              <option value="created">Sort: Newest</option>
              <option value="name">Sort: Name</option>
            </select>

            {/* Create (compact, but full-featured inside) */}
            <div className="hidden sm:block">
              <CreateFolderForm onFolderCreated={fetchFolders} />
            </div>
          </div>
        </div>
      </div>

      {/* Inline create on mobile */}
      <div className="sm:hidden mt-3">
        <CreateFolderForm onFolderCreated={fetchFolders} />
      </div>

      {/* Error */}
      {error && (
        <div className="mt-4 text-sm rounded-md bg-red-50 text-red-700 border border-red-200 px-3 py-2">
          {error}
        </div>
      )}

      {/* Empty state */}
      {filtered.length === 0 ? (
        <div className="mt-10 flex flex-col items-center justify-center text-center">
          <div className="w-24 h-24 rounded-full bg-gradient-to-br from-blue-100 to-indigo-100 flex items-center justify-center shadow-inner">
            <svg className="w-12 h-12 text-indigo-400" viewBox="0 0 24 24" fill="none">
              <path d="M3 7h18v10a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V7z" stroke="currentColor" strokeWidth="2"/>
              <path d="M3 7l3-4h12l3 4" stroke="currentColor" strokeWidth="2"/>
            </svg>
          </div>
          <h2 className="mt-4 text-xl font-semibold">No folders yet</h2>
          <p className="text-gray-600 max-w-md mt-1">
            Create your first folder to start organizing and uploading images.
          </p>
          <div className="mt-4">
            <CreateFolderForm onFolderCreated={fetchFolders} />
          </div>
        </div>
      ) : (
        <div className="mt-6 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
          {filtered.map(folder => (
            <div
              key={folder._id}
              className="group rounded-xl border border-gray-200 p-4 shadow-sm bg-white/90 backdrop-blur
                         hover:shadow-lg hover:-translate-y-0.5 transition"
            >
              {/* Title row with gradient badge + date */}
              <div className="flex items-start justify-between mb-3">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-blue-500 to-indigo-500
                                  text-white flex items-center justify-center shadow-md">
                    <svg className="w-6 h-6" viewBox="0 0 24 24" fill="none">
                      <path d="M3 7h6l2 2h10v8a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V7z" stroke="currentColor" strokeWidth="2"/>
                    </svg>
                  </div>
                  <div>
                    <div className="font-semibold">{folder.name || 'Untitled'}</div>
                    <div className="text-xs text-gray-500">
                      {folder.updatedAt
                        ? `Updated ${new Date(folder.updatedAt).toLocaleDateString()}`
                        : `Created ${new Date(folder.createdAt).toLocaleDateString()}`}
                    </div>
                  </div>
                </div>
              </div>

              {/* Folder actions / link etc. */}
              <FolderCard folder={folder} onDelete={fetchFolders} />

              {/* Inline uploader */}
              <div className="mt-3">
                <UploadForm folderId={folder._id} onUploadSuccess={fetchFolders} />
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
