import React, { useEffect, useState } from 'react'
import axios from '../../services/axiosInstances'
import toast from 'react-hot-toast'
import { useConfirmDialog } from '../../ConfirmDialogContext'

const StatCard = ({ label, value, icon }) => (
  <div className="rounded-xl border border-gray-200 bg-white/90 p-4 shadow-sm hover:bg-gray-50 transition">
    <div className="flex items-center gap-3">
      <div className="h-10 w-10 rounded-lg flex items-center justify-center text-white shadow-md"
           style={{ backgroundImage: 'linear-gradient(135deg,#3b82f6,#8b5cf6)' }}>
        {icon}
      </div>
      <div>
        <div className="text-sm text-gray-600">{label}</div>
        <div className="text-2xl font-extrabold">{value ?? '—'}</div>
      </div>
    </div>
  </div>
)

const Section = ({ title, children, right }) => (
  <section className="rounded-xl border border-gray-200 bg-white/90 p-4 shadow-sm">
    <div className="mb-3 flex items-center justify-between gap-3">
      <h3 className="text-lg font-semibold">{title}</h3>
      {right}
    </div>
    {children}
  </section>
)

export default function AdminDashboard() {
  const [loading, setLoading] = useState(true)
  const [overview, setOverview] = useState({})
  const [users, setUsers] = useState([])
  const [folders, setFolders] = useState([])
  const [images, setImages] = useState([])
  const { openConfirm } = useConfirmDialog()

  const fetchData = async () => {
    setLoading(true)
    try {
      const [ov, us, fo, im] = await Promise.all([
        axios.get('/admin/overview'),
        axios.get('/admin/users'),
        axios.get('/admin/folders'),
        axios.get('/admin/images')
      ])
      setOverview(ov.data)
      setUsers(us.data || [])
      setFolders(fo.data || [])
      setImages(im.data || [])
    } catch {
      toast.error('Failed to load admin data')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => { fetchData() }, [])

  const handleDeleteUser = (id) => {
    openConfirm(
      'Delete User',
      'This will permanently remove the user and all their data.',
      async () => {
        try {
          await axios.delete(`/admin/user/${id}`)
          toast.success('User deleted')
          fetchData()
        } catch {
          toast.error('Failed to delete user')
        }
      }
    )
  }

  const handleDeleteFolder = (id) => {
    openConfirm(
      'Delete Folder',
      'This will delete the folder and all its images.',
      async () => {
        try {
          await axios.delete(`/admin/folder/${id}`)
          toast.success('Folder deleted')
          fetchData()
        } catch {
          toast.error('Failed to delete folder')
        }
      }
    )
  }

  const handleDeleteImage = (id) => {
    openConfirm(
      'Delete Image',
      'This action cannot be undone.',
      async () => {
        try {
          await axios.delete(`/admin/image/${id}`)
          toast.success('Image deleted')
          fetchData()
        } catch {
          toast.error('Failed to delete image')
        }
      }
    )
  }

  return (
    <div className="max-w-6xl mx-auto px-2 sm:px-0 py-6 space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold">Admin Dashboard(Yaadein)</h1>
        <button
          onClick={fetchData}
          className="app-btn inline-flex items-center gap-2 px-3 py-2 rounded-md text-sm"
          title="Refresh"
        >
          <svg className="h-4 w-4" viewBox="0 0 24 24" fill="none">
            <path d="M4 4v6h6M20 20v-6h-6" stroke="currentColor" strokeWidth="2" />
            <path d="M20 9A8 8 0 1 0 6 19" stroke="currentColor" strokeWidth="2" />
          </svg>
          Refresh
        </button>
      </div>

      {loading ? (
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          {[...Array(3)].map((_, i) => (
            <div key={i} className="rounded-xl border border-gray-200 p-4">
              <div className="h-10 w-10 rounded-lg bg-gray-200/70" />
              <div className="mt-3 h-4 w-24 bg-gray-200/70 rounded" />
              <div className="mt-2 h-6 w-16 bg-gray-200/70 rounded" />
            </div>
          ))}
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <StatCard
            label="Total Users"
            value={overview.userCount}
            icon={<svg viewBox="0 0 24 24" className="h-5 w-5" fill="none">
              <path d="M12 12a5 5 0 1 0-5-5 5 5 0 0 0 5 5Zm7 8a7 7 0 1 0-14 0" stroke="currentColor" strokeWidth="2"/>
            </svg>}
          />
          <StatCard
            label="Total Folders"
            value={overview.folderCount}
            icon={<svg viewBox="0 0 24 24" className="h-5 w-5" fill="none">
              <path d="M3 7h6l2 2h10v8a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V7z" stroke="currentColor" strokeWidth="2"/>
            </svg>}
          />
          <StatCard
            label="Total Images"
            value={overview.imageCount}
            icon={<svg viewBox="0 0 24 24" className="h-5 w-5" fill="none">
              <path d="M4 5h16v14H4z" stroke="currentColor" strokeWidth="2"/>
              <path d="M4 15l4-4 3 3 5-5 4 4" stroke="currentColor" strokeWidth="2"/>
            </svg>}
          />
        </div>
      )}

      <Section title="Users" right={<span className="chip text-xs">{users.length} total</span>}>
        <div className="overflow-auto rounded-md border border-gray-200">
          <table className="min-w-full text-sm">
            <thead className="bg-gray-50">
              <tr className="text-left">
                <th className="px-3 py-2 font-semibold">Email</th>
                <th className="px-3 py-2 font-semibold">Role</th>
                <th className="px-3 py-2 font-semibold">Created</th>
                <th className="px-3 py-2 font-semibold">Actions</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                [...Array(5)].map((_, i) => (
                  <tr key={i} className="border-t border-gray-200">
                    <td className="px-3 py-3"><div className="h-4 w-56 bg-gray-200/70 rounded" /></td>
                    <td className="px-3 py-3"><div className="h-4 w-16 bg-gray-200/70 rounded" /></td>
                    <td className="px-3 py-3"><div className="h-4 w-28 bg-gray-200/70 rounded" /></td>
                    <td className="px-3 py-3"><div className="h-8 w-20 bg-gray-200/70 rounded" /></td>
                  </tr>
                ))
              ) : users.length === 0 ? (
                <tr><td className="px-3 py-3 text-gray-600" colSpan={4}>No users found.</td></tr>
              ) : (
                users.map(u => (
                  <tr key={u._id} className="border-t border-gray-200">
                    <td className="px-3 py-2 break-all">{u.email}</td>
                    <td className="px-3 py-2">
                      <span className="badge">{u.isAdmin ? 'Admin' : 'User'}</span>
                    </td>
                    <td className="px-3 py-2">{u.createdAt ? new Date(u.createdAt).toLocaleDateString() : '—'}</td>
                    <td className="px-3 py-2">
                      <button
                        onClick={() => handleDeleteUser(u._id)}
                        className="rounded px-3 py-1 text-sm bg-red-50/90 text-red-600 hover:bg-red-100"
                      >
                        Delete
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </Section>

      <Section title="Folders" right={<span className="chip text-xs">{folders.length} total</span>}>
        <div className="overflow-auto rounded-md border border-gray-200">
          <table className="min-w-full text-sm">
            <thead className="bg-gray-50">
              <tr className="text-left">
                <th className="px-3 py-2 font-semibold">Name</th>
                <th className="px-3 py-2 font-semibold">Owner</th>
                <th className="px-3 py-2 font-semibold">Updated</th>
                <th className="px-3 py-2 font-semibold">Actions</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                [...Array(5)].map((_, i) => (
                  <tr key={i} className="border-t border-gray-200">
                    <td className="px-3 py-3"><div className="h-4 w-40 bg-gray-200/70 rounded" /></td>
                    <td className="px-3 py-3"><div className="h-4 w-56 bg-gray-200/70 rounded" /></td>
                    <td className="px-3 py-3"><div className="h-4 w-24 bg-gray-200/70 rounded" /></td>
                    <td className="px-3 py-3"><div className="h-8 w-20 bg-gray-200/70 rounded" /></td>
                  </tr>
                ))
              ) : folders.length === 0 ? (
                <tr><td className="px-3 py-3 text-gray-600" colSpan={4}>No folders found.</td></tr>
              ) : (
                folders.map(f => (
                  <tr key={f._id} className="border-t border-gray-200">
                    <td className="px-3 py-2">{f.name}</td>
                    <td className="px-3 py-2">{f.userId?.email || 'Unknown'}</td>
                    <td className="px-3 py-2">{f.updatedAt ? new Date(f.updatedAt).toLocaleDateString() : '—'}</td>
                    <td className="px-3 py-2">
                      <button
                        onClick={() => handleDeleteFolder(f._id)}
                        className="rounded px-3 py-1 text-sm bg-red-50/90 text-red-600 hover:bg-red-100"
                      >
                        Delete
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </Section>

      <Section title="Images" right={<span className="chip text-xs">{images.length} total</span>}>
        <div className="overflow-auto rounded-md border border-gray-200">
          <table className="min-w-full text-sm">
            <thead className="bg-gray-50">
              <tr className="text-left">
                <th className="px-3 py-2 font-semibold">Preview</th>
                <th className="px-3 py-2 font-semibold">Title</th>
                <th className="px-3 py-2 font-semibold">Folder</th>
                <th className="px-3 py-2 font-semibold">Tags</th>
                <th className="px-3 py-2 font-semibold">Actions</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                [...Array(5)].map((_, i) => (
                  <tr key={i} className="border-t border-gray-200">
                    <td className="px-3 py-3"><div className="h-14 w-20 bg-gray-200/70 rounded" /></td>
                    <td className="px-3 py-3"><div className="h-4 w-40 bg-gray-200/70 rounded" /></td>
                    <td className="px-3 py-3"><div className="h-4 w-32 bg-gray-200/70 rounded" /></td>
                    <td className="px-3 py-3"><div className="h-4 w-24 bg-gray-200/70 rounded" /></td>
                    <td className="px-3 py-3"><div className="h-8 w-20 bg-gray-200/70 rounded" /></td>
                  </tr>
                ))
              ) : images.length === 0 ? (
                <tr><td className="px-3 py-3 text-gray-600" colSpan={5}>No images found.</td></tr>
              ) : (
                images.map(img => (
                  <tr key={img._id} className="border-t border-gray-200 align-top">
                    <td className="px-3 py-2">
                      {img.url ? (
                        <img src={img.url} alt={img.metadata?.title || 'Image'} className="h-14 w-20 object-cover rounded border" />
                      ) : '—'}
                    </td>
                    <td className="px-3 py-2">
                      <div className="font-semibold">{img.metadata?.title || 'Untitled'}</div>
                      {img.metadata?.description && (
                        <div className="text-xs text-gray-600 mt-0.5 line-clamp-2 max-w-xs">
                          {img.metadata.description}
                        </div>
                      )}
                    </td>
                    <td className="px-3 py-2">{img.folderId?.name || 'Unknown'}</td>
                    <td className="px-3 py-2">
                      <div className="flex flex-wrap gap-1 max-w-xs">
                        {img.metadata?.tags?.map((t, i) => (
                          <span key={i} className="px-2 py-0.5 rounded-full border border-gray-200 bg-gray-100 text-gray-700 text-[11px]">
                            #{t}
                          </span>
                        ))}
                      </div>
                    </td>
                    <td className="px-3 py-2">
                      <button
                        onClick={() => handleDeleteImage(img._id)}
                        className="rounded px-3 py-1 text-sm bg-red-50/90 text-red-600 hover:bg-red-100"
                      >
                        Delete
                      </button>
                      {img.qrCodeUrl && (
                        <div className="mt-2">
                          <img src={img.qrCodeUrl} alt="QR" className="w-14 h-14 object-contain border rounded bg-white" />
                        </div>
                      )}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </Section>
    </div>
  )
}
