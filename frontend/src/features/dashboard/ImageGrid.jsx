import React, { useEffect, useState } from 'react'
import axios from '../../services/axiosInstances'
import { useAuth } from '../../contexts/AuthContext'
import toast from 'react-hot-toast'
import { useConfirmDialog } from '../../ConfirmDialogContext'

const ImageGrid = ({ folderId }) => {
  const [images, setImages] = useState([])
  const [loading, setLoading] = useState(true)
  const { userId, isAdmin } = useAuth()
  const { openConfirm } = useConfirmDialog()

  useEffect(() => {
    const fetchImages = async () => {
      try {
        const res = await axios.get(`/upload/images/${folderId}`)
        setImages(res.data || [])
      } catch (err) {
        console.error('Failed to fetch images', err)
        toast.error('Failed to fetch images')
      } finally {
        setLoading(false)
      }
    }
    fetchImages()
  }, [folderId])

  const confirmDelete = (id) => {
    openConfirm(
      'Delete Image',
      'Are you sure you want to delete this image? This action cannot be undone.',
      async () => {
        try {
          await axios.delete(`/upload/image/${id}`)
          setImages(prev => prev.filter(img => img._id !== id))
          toast.success('Image deleted successfully')
        } catch (err) {
          toast.error('Failed to delete image')
        }
      }
    )
  }

  const getOwnerId = (img) =>
    img.uploadedBy?._id ??
    img.uploadedBy ??
    img.userId ??
    img.ownerId ??
    img.user

  const canDelete = (img) => isAdmin || String(getOwnerId(img)) === String(userId)

  if (loading) {
    return (
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
        {[...Array(8)].map((_, i) => (
          <div key={i} className="rounded-xl border border-gray-200 bg-white/80 p-2">
            <div className="h-40 w-full rounded-lg bg-gray-200/70 animate-pulse" />
            <div className="mt-2 h-4 w-2/3 rounded bg-gray-200/70 animate-pulse" />
          </div>
        ))}
      </div>
    )
  }

  if (images.length === 0) {
    return (
      <div className="rounded-xl border border-gray-200 bg-white/90 p-6 text-center text-gray-600">
        No images yet. Upload your first image above.
      </div>
    )
  }

  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
      {images.map(img => (
        <figure
          key={img._id}
          className="group relative rounded-xl border border-gray-200 bg-white/90 backdrop-blur
                     overflow-hidden shadow-sm hover:shadow-lg transition"
        >
          {/* Media */}
          <div className="relative">
            <img
              src={img.url}
              alt={img.metadata?.title || 'uploaded'}
              className="w-full h-44 object-cover transition-transform duration-300 group-hover:scale-[1.02]"
              loading="lazy"
            />

            {/* Top-right action chip (always visible on mobile; fades in on hover for md+) */}
            {canDelete(img) && (
              <div className="absolute top-2 right-2 z-10">
                <button
                  onClick={() => confirmDelete(img._id)}
                  className="rounded-full bg-red-50/95 text-red-600 px-2.5 py-1 text-xs font-medium
                             shadow hover:bg-red-100 transition md:opacity-0 md:group-hover:opacity-100"
                  title="Delete"
                >
                  Delete
                </button>
              </div>
            )}
          </div>

          {/* Meta */}
          <figcaption className="p-3">
            <div className="flex items-center justify-between gap-2">
              <div className="font-semibold text-gray-800 truncate">
                {img.metadata?.title || 'Untitled'}
              </div>
              {/* Tiny badge if QR present */}
              {img.qrCodeUrl && (
                <span className="shrink-0 text-[10px] px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200">
                  QR
                </span>
              )}
            </div>

            {img.metadata?.description && (
              <p className="mt-1 text-sm text-gray-600 line-clamp-2">
                {img.metadata.description}
              </p>
            )}

            {!!(img.metadata?.tags?.length) && (
              <div className="mt-2 flex flex-wrap gap-1">
                {img.metadata.tags.slice(0, 3).map((tag, idx) => (
                  <span
                    key={idx}
                    className="inline-flex items-center rounded-full bg-gray-100 text-gray-700
                               border border-gray-200 px-2 py-0.5 text-[11px]"
                  >
                    #{tag}
                  </span>
                ))}
                {img.metadata.tags.length > 3 && (
                  <span className="text-[11px] text-gray-500">
                    +{img.metadata.tags.length - 3}
                  </span>
                )}
              </div>
            )}

            {img.qrCodeUrl && (
              <div className="mt-3">
                <img
                  src={img.qrCodeUrl}
                  alt="QR code"
                  className="w-20 h-20 object-contain border rounded bg-white"
                />
              </div>
            )}
          </figcaption>
        </figure>
      ))}
    </div>
  )
}

export default ImageGrid
