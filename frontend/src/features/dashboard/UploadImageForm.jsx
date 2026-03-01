import React, { useState, useEffect, useRef, useCallback } from 'react'
import axios from '../../services/axiosInstances'

const UploadImageForm = () => {
  const [folders, setFolders] = useState([])
  const [folderId, setFolderId] = useState('')
  const [imageFile, setImageFile] = useState(null)
  const [preview, setPreview] = useState(null)
  const [metadata, setMetadata] = useState('')
  const [message, setMessage] = useState('')
  const [error, setError] = useState('')
  const [dragOver, setDragOver] = useState(false)
  const [uploading, setUploading] = useState(false)

  const fileInputRef = useRef(null)

  useEffect(() => {
    const fetchFolders = async () => {
      try {
        const res = await axios.get('/upload/folders')
        setFolders(res.data || [])
      } catch {
        setError('Failed to fetch folders')
      }
    }
    fetchFolders()
  }, [])

  const validateAndSet = (f) => {
    if (!f) return
    if (!f.type?.startsWith('image/')) {
      setError('Please choose a valid image file')
      setImageFile(null)
      setPreview(null)
      return
    }
    setError('')
    setMessage('')
    setImageFile(f)
    setPreview(URL.createObjectURL(f))
  }

  const onPick = () => fileInputRef.current?.click()

  const onDrop = useCallback((e) => {
    e.preventDefault()
    e.stopPropagation()
    setDragOver(false)
    const f = e.dataTransfer?.files?.[0]
    validateAndSet(f)
  }, [])

  const onDragOver = (e) => { e.preventDefault(); setDragOver(true) }
  const onDragLeave = (e) => { e.preventDefault(); setDragOver(false) }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')
    setMessage('')

    if (!folderId || !imageFile) {
      setError('Select a folder and an image before uploading')
      return
    }

    setUploading(true)
    const reader = new FileReader()
    reader.onloadend = async () => {
      try {
        const base64Image = reader.result
        await axios.post('/upload/image', {
          folderId,
          base64Image,
          metadata: { description: metadata }
        })
        setMessage('✅ Image uploaded successfully')
        setImageFile(null)
        setPreview(null)
        setMetadata('')
      } catch {
        setError('❌ Upload failed')
      } finally {
        setUploading(false)
      }
    }
    reader.readAsDataURL(imageFile)
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="rounded-xl border border-gray-200 bg-white/90 backdrop-blur p-4 shadow-sm"
    >
      {/* Header */}
      <div className="mb-3 flex items-center justify-between">
        <h2 className="text-lg font-semibold">Upload Image</h2>
        <button
          type="button"
          onClick={() => { setImageFile(null); setPreview(null); setMetadata(''); setMessage(''); setError('') }}
          className="text-xs text-gray-600 hover:text-gray-800"
        >
          Reset
        </button>
      </div>

      {/* Folder select */}
      <label className="block text-sm font-medium text-gray-700 mb-1">Folder</label>
      <div className="relative mb-3">
        <select
          value={folderId}
          onChange={e => setFolderId(e.target.value)}
          className="w-full appearance-none rounded-md border border-gray-300 bg-white px-3 py-2 pr-9
                     focus:border-blue-500 focus:ring-2 focus:ring-blue-100 outline-none"
        >
          <option value="">Select Folder</option>
          {folders.map(f => (
            <option key={f._id} value={f._id}>{f.name}</option>
          ))}
        </select>
        <svg
          className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400"
          viewBox="0 0 24 24" fill="none" aria-hidden="true"
        >
          <path d="M6 9l6 6 6-6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
        </svg>
      </div>

      {/* Dropzone / picker */}
      <label className="block text-sm font-medium text-gray-700 mb-1">Image</label>
      <div
        onClick={onPick}
        onDrop={onDrop}
        onDragOver={onDragOver}
        onDragLeave={onDragLeave}
        className={`relative flex flex-col items-center justify-center rounded-md border-2 border-dashed p-5 cursor-pointer
          ${dragOver ? 'border-blue-400 bg-blue-50/60' : preview ? 'border-emerald-400 bg-emerald-50/40' : 'border-gray-300 hover:bg-gray-50'}
        `}
        role="button"
        tabIndex={0}
        onKeyDown={(e) => (e.key === 'Enter' || e.key === ' ') && onPick()}
        aria-label="Choose image file"
      >
        <input
          ref={fileInputRef}
          type="file"
          accept="image/*"
          onChange={e => validateAndSet(e.target.files?.[0])}
          className="hidden"
        />
        <svg className="w-8 h-8 text-gray-500 mb-2" viewBox="0 0 24 24" fill="none" aria-hidden="true">
          <path d="M12 5v14m7-7H5" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
        </svg>
        <div className="text-sm text-gray-700">
          {preview ? 'Change image' : 'Click or drag an image here'}
        </div>
        <div className="text-xs text-gray-500">PNG / JPG</div>

        {preview && (
          <div className="mt-3">
            <img
              src={preview}
              alt="Preview"
              className="max-h-40 rounded-md border border-gray-200 shadow-sm"
            />
          </div>
        )}
      </div>

      {/* Metadata */}
      <label className="mt-4 block text-sm font-medium text-gray-700 mb-1">Description (optional)</label>
      <input
        type="text"
        placeholder="Short description"
        value={metadata}
        onChange={e => setMetadata(e.target.value)}
        className="w-full rounded-md border border-gray-300 bg-white px-3 py-2
                   focus:border-blue-500 focus:ring-2 focus:ring-blue-100 outline-none"
      />

      {/* Actions */}
      <div className="mt-4 flex items-center gap-3">
        <button
          type="submit"
          disabled={uploading}
          className="inline-flex items-center justify-center rounded-md px-4 py-2
                     bg-blue-600 text-white font-medium shadow hover:bg-blue-700
                     disabled:opacity-60 disabled:cursor-not-allowed"
        >
          {uploading ? 'Uploading…' : 'Upload'}
        </button>

        {imageFile && !uploading && (
          <button
            type="button"
            onClick={() => { setImageFile(null); setPreview(null) }}
            className="text-sm text-gray-600 hover:text-gray-800"
          >
            Clear selection
          </button>
        )}
      </div>

      {/* Status */}
      {error && (
        <p className="mt-3 text-sm rounded-md bg-red-50 text-red-700 border border-red-200 px-3 py-2">
          {error}
        </p>
      )}
      {message && !error && (
        <p className="mt-3 text-sm rounded-md bg-emerald-50 text-emerald-700 border border-emerald-200 px-3 py-2">
          {message}
        </p>
      )}
    </form>
  )
}

export default UploadImageForm
