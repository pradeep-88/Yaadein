// import React, { useState } from 'react'
// import axios from '../../services/axiosInstances'

// const UploadForm = ({ folderId, onUploadSuccess }) => {
//   const [file, setFile] = useState(null)
//   const [metadata, setMetadata] = useState('')
//   const [uploading, setUploading] = useState(false)
//   const [error, setError] = useState('')

//   const handleFileChange = (e) => {
//     const selected = e.target.files[0]
//     if (selected && selected.type.startsWith('image/')) {
//       setFile(selected)
//       setError('')
//     } else {
//       setFile(null)
//       setError('Please select a valid image file')
//     }
//   }

//   const handleUpload = async (e) => {
//     e.preventDefault()

//     if (!file) return setError('Please select an image first')
//     if (!folderId) return setError('Folder ID is missing')

//     setUploading(true)
//     setError('')

//     try {
//       const reader = new FileReader()

//       reader.onloadend = async () => {
//         const base64Image = reader.result

//         await axios.post('/upload/image', {
//           base64Image,
//           folderId,
//           metadata: metadata?.trim() || 'N/A',
//         })

//         setFile(null)
//         setMetadata('')
//         onUploadSuccess?.()
//       }

//       reader.readAsDataURL(file)
//     } catch (err) {
//       console.error(err)
//       setError('Upload failed. Try again.')
//     } finally {
//       setUploading(false)
//     }
//   }

//   return (
//     <form onSubmit={handleUpload} className="bg-white p-4 rounded shadow mb-6">
//       <h3 className="text-lg font-semibold mb-2">Upload Image</h3>

//       <input
//         type="file"
//         accept="image/*"
//         onChange={handleFileChange}
//         className="mb-2"
//       />

//       <input
//         type="text"
//         placeholder="Enter metadata (optional)"
//         value={metadata}
//         onChange={(e) => setMetadata(e.target.value)}
//         className="w-full px-3 py-2 border rounded mb-2"
//       />

//       <button
//         type="submit"
//         disabled={uploading}
//         className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
//       >
//         {uploading ? 'Uploading...' : 'Upload'}
//       </button>

//       {error && <p className="text-red-500 text-sm mt-2">{error}</p>}
//     </form>
//   )
// }

// export default UploadForm


// import React, { useState } from 'react'
// import axios from '../../services/axiosInstances'

// const UploadForm = ({ folderId, onUploadSuccess }) => {
//   const [file, setFile] = useState(null)
//   const [metadata, setMetadata] = useState('')
//   const [uploading, setUploading] = useState(false)
//   const [error, setError] = useState('')
//   const [success, setSuccess] = useState('')
//   const [preview, setPreview] = useState(null)

//   const handleFileChange = (e) => {
//     const selected = e.target.files[0]
//     if (selected && selected.type.startsWith('image/')) {
//       setFile(selected)
//       setPreview(URL.createObjectURL(selected))
//       setError('')
//     } else {
//       setError('Please select a valid image file')
//       setFile(null)
//       setPreview(null)
//     }
//   }

//   const handleUpload = async (e) => {
//     e.preventDefault()
//     setSuccess('')
//     if (!file) return setError('Please select an image first')
//     if (!folderId) return setError('Folder ID is missing')

//     setUploading(true)
//     setError('')

//     try {
//       const reader = new FileReader()
//       reader.onloadend = async () => {
//         const base64Image = reader.result

//         const res = await axios.post('/upload/image', {
//           base64Image,
//           folderId,
//           metadata: metadata || ' ',
//         })

//         setSuccess('✅ Image uploaded successfully!')
//         setFile(null)
//         setPreview(null)
//         setMetadata('')
//         onUploadSuccess?.()
//       }
//       reader.readAsDataURL(file)
//     } catch (err) {
//       setError('❌ Upload failed. Try again.')
//     } finally {
//       setUploading(false)
//     }
//   }

//   return (
//     <form onSubmit={handleUpload} className="bg-white p-4 rounded shadow mb-6">
//       <h3 className="text-lg font-semibold mb-2">Upload Image</h3>

//       <input
//         type="file"
//         accept="image/*"
//         onChange={handleFileChange}
//         className="mb-2"
//       />

//       {preview && (
//         <div className="mb-2">
//           <img src={preview} alt="Preview" className="w-40 h-auto border rounded" />
//         </div>
//       )}

//       <input
//         type="text"
//         placeholder="Enter metadata (optional)"
//         value={metadata}
//         onChange={(e) => setMetadata(e.target.value)}
//         className="w-full px-3 py-2 border rounded mb-2"
//       />

//       <button
//         type="submit"
//         disabled={uploading}
//         className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
//       >
//         {uploading ? 'Uploading...' : 'Upload'}
//       </button>

//       {error && <p className="text-red-500 text-sm mt-2">{error}</p>}
//       {success && <p className="text-green-600 text-sm mt-2">{success}</p>}
//     </form>
//   )
// }

// export default UploadForm



// import React, { useState ,useRef} from 'react'
// import axios from '../../services/axiosInstances'
// import toast from 'react-hot-toast'


// const UploadForm = ({ folderId, onUploadSuccess }) => {
//   const [file, setFile] = useState(null)
//   const [preview, setPreview] = useState(null)
//   const [title, setTitle] = useState('')
//   const [description, setDescription] = useState('')
//   const [tags, setTags] = useState('')
//   const [uploading, setUploading] = useState(false)
//   const [error, setError] = useState('')
//   const [success, setSuccess] = useState('')
//   const fileInputRef = useRef(null)


//   const handleFileChange = (e) => {
//     const selected = e.target.files[0]
//     if (selected && selected.type.startsWith('image/')) {
//       setFile(selected)
//       setPreview(URL.createObjectURL(selected))
//       setError('')
//     } else {
//       setError('Please select a valid image file')
//       setFile(null)
//       setPreview(null)
//     }
//   }

//   const handleUpload = async (e) => {
//     e.preventDefault()
//     setSuccess('')
//     if (!file) return setError('Please select an image first')
//     if (!folderId) return setError('Folder ID is missing')

//     setUploading(true)
//     setError('')

//     try {
//       const reader = new FileReader()
//       reader.onloadend = async () => {
//         const base64Image = reader.result
//         const tagArray = tags
//           .split(',')
//           .map(tag => tag.trim())
//           .filter(tag => tag.length > 0)

//         const res = await axios.post('/upload/image', {
//           base64Image,
//           folderId,
//           metadata: {
//             title,
//             description,
//             tags: tagArray
//           }
//         })

//         toast.success('✅ Image uploaded successfully!')
//         setFile(null)
//         setPreview(null)
//         setTitle('')
//         setDescription('')
//         setTags('')
//         onUploadSuccess?.()
//       }
//       reader.readAsDataURL(file)
//     } catch (err) {
//   console.error(err)
//   if (err.response?.status === 403) {
//     setError('🚫 You do not have permission to upload to this folder.')
//   } else {
//     setError('❌ Upload failed. Try again.')
//   }
// }
//  finally {
//       setUploading(false)
//     }
//   }

//   return (
//     <form onSubmit={handleUpload} className="bg-white p-4 rounded shadow mb-6">
//       <h3 className="text-lg font-semibold mb-2">Upload Image</h3>

//       <input type="file" accept="image/*" onChange={handleFileChange} className="mb-2" ref={fileInputRef} />

//       {preview && <img src={preview} alt="Preview" className="w-40 h-auto border mb-2" />}

//       <input
//         type="text"
//         placeholder="Title"
//         value={title}
//         onChange={(e) => setTitle(e.target.value)}
//         className="w-full px-3 py-2 border rounded mb-2"
//       />

//       <input
//         type="text"
//         placeholder="Description"
//         value={description}
//         onChange={(e) => setDescription(e.target.value)}
//         className="w-full px-3 py-2 border rounded mb-2"
//       />

//       <input
//         type="text"
//         placeholder="Tags (comma-separated)"
//         value={tags}
//         onChange={(e) => setTags(e.target.value)}
//         className="w-full px-3 py-2 border rounded mb-2"
//       />

//       <button
//         type="submit"
//         disabled={uploading}
//         className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
//       >
//         {uploading ? 'Uploading...' : 'Upload'}
//       </button>

//       {error && <p className="text-red-500 text-sm mt-2">{error}</p>}
//       {success && <p className="text-green-600 text-sm mt-2">{success}</p>}
//     </form>
//   )
// }

// export default UploadForm


import React, { useState, useRef, useCallback } from 'react'
import axios from '../../services/axiosInstances'
import toast from 'react-hot-toast'

const UploadForm = ({ folderId, onUploadSuccess }) => {
  const [file, setFile] = useState(null)
  const [preview, setPreview] = useState(null)
  const [title, setTitle] = useState('')
  const [description, setDescription] = useState('')
  const [tags, setTags] = useState('')
  const [uploading, setUploading] = useState(false)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')
  const [dragOver, setDragOver] = useState(false)
  const [progress, setProgress] = useState(0)
  const fileInputRef = useRef(null)

  const pickFile = () => fileInputRef.current?.click()

  const validateAndSet = (f) => {
    if (f && f.type.startsWith('image/')) {
      setFile(f)
      setPreview(URL.createObjectURL(f))
      setError('')
    } else {
      setError('Please select a valid image file')
      setFile(null)
      setPreview(null)
    }
  }

  const handleFileChange = (e) => validateAndSet(e.target.files?.[0])

  const onDrop = useCallback((e) => {
    e.preventDefault()
    e.stopPropagation()
    setDragOver(false)
    const f = e.dataTransfer.files?.[0]
    validateAndSet(f)
  }, [])

  const onDragOver = (e) => {
    e.preventDefault()
    e.stopPropagation()
    setDragOver(true)
  }
  const onDragLeave = (e) => {
    e.preventDefault()
    e.stopPropagation()
    setDragOver(false)
  }

  const handleUpload = async (e) => {
    e.preventDefault()
    setSuccess('')
    setError('')
    setProgress(0)

    if (!file) return setError('Please select an image first')
    if (!folderId) return setError('Folder ID is missing')

    setUploading(true)
    try {
      const reader = new FileReader()
      reader.onloadend = async () => {
        const base64Image = reader.result
        const tagArray = tags.split(',').map(t => t.trim()).filter(Boolean)

        await axios.post('/upload/image',
          { base64Image, folderId, metadata: { title, description, tags: tagArray } },
          {
            onUploadProgress: (evt) => {
              if (!evt.total) return
              const pct = Math.round((evt.loaded / evt.total) * 100)
              setProgress(pct)
            }
          }
        )

        toast.success('Image uploaded')
        setFile(null)
        setPreview(null)
        setTitle('')
        setDescription('')
        setTags('')
        setProgress(100)
        setSuccess('Uploaded!')
        onUploadSuccess?.()
      }
      reader.readAsDataURL(file)
    } catch (err) {
      console.error(err)
      setProgress(0)
      if (err.response?.status === 403) {
        setError('You do not have permission to upload to this folder.')
      } else {
        setError('Upload failed. Try again.')
      }
    } finally {
      setUploading(false)
    }
  }

  const disabled = uploading

  return (
    <form onSubmit={handleUpload} className="mb-6">
      <div className="rounded-xl border border-gray-200 bg-white/90 backdrop-blur p-4 shadow-sm">
        <div
          onClick={pickFile}
          onDrop={onDrop}
          onDragOver={onDragOver}
          onDragLeave={onDragLeave}
          className={`relative flex flex-col items-center justify-center rounded-lg border-2 border-dashed p-5 cursor-pointer
            ${dragOver ? 'border-blue-400 bg-blue-50/60' : preview ? 'border-emerald-400 bg-emerald-50/40' : 'border-gray-300 hover:bg-gray-50'}
          `}
          role="button"
          tabIndex={0}
          onKeyDown={(e) => (e.key === 'Enter' || e.key === ' ') && pickFile()}
          aria-label="Choose image file"
        >
          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            onChange={handleFileChange}
            className="hidden"
            disabled={disabled}
          />
          <svg className="w-8 h-8 text-gray-500 mb-2" viewBox="0 0 24 24" fill="none" aria-hidden="true">
            <path d="M12 5v14m7-7H5" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
          </svg>
          <div className="text-sm text-gray-700">
            {preview ? 'Change image' : 'Click or drag an image here'}
          </div>
          <div className="text-xs text-gray-500">PNG/JPG</div>
          {preview && (
            <div className="mt-3">
              <img src={preview} alt="Preview" className="max-h-36 rounded-md border border-gray-200 shadow-sm" />
            </div>
          )}
        </div>

        <div className="mt-4 grid grid-cols-1 gap-3">
          <input
            type="text"
            placeholder="Title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            disabled={disabled}
            className="w-full px-3 py-2 rounded-md border border-gray-300 focus:border-blue-500 focus:ring-2 focus:ring-blue-100 outline-none"
          />

          <input
            type="text"
            placeholder="Description"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            disabled={disabled}
            className="w-full px-3 py-2 rounded-md border border-gray-300 focus:border-blue-500 focus:ring-2 focus:ring-blue-100 outline-none"
          />

          <input
            type="text"
            placeholder="Tags (comma-separated)"
            value={tags}
            onChange={(e) => setTags(e.target.value)}
            disabled={disabled}
            className="w-full px-3 py-2 rounded-md border border-gray-300 focus:border-blue-500 focus:ring-2 focus:ring-blue-100 outline-none"
          />
        </div>

        {/* Progress */}
        {uploading && (
          <div className="mt-4">
            <div className="h-2 w-full rounded bg-gray-100 overflow-hidden">
              <div
                className="h-full bg-gradient-to-r from-blue-600 to-indigo-500 transition-all"
                style={{ width: `${progress}%` }}
              />
            </div>
            <div className="mt-1 text-xs text-gray-600">{progress}%</div>
          </div>
        )}

        <div className="mt-4 flex items-center gap-3">
          <button
            type="submit"
            disabled={disabled}
            className="inline-flex items-center justify-center rounded-md px-4 py-2
                       bg-blue-600 text-white font-medium shadow hover:bg-blue-700
                       disabled:opacity-60 disabled:cursor-not-allowed"
          >
            {uploading ? 'Uploading…' : 'Upload'}
          </button>

          {preview && !uploading && (
            <button
              type="button"
              onClick={() => { setFile(null); setPreview(null); }}
              className="text-sm text-gray-600 hover:text-gray-800"
            >
              Clear selection
            </button>
          )}
        </div>

        {/* Messages */}
        {error && (
          <p className="mt-3 text-sm rounded-md bg-red-50 text-red-700 border border-red-200 px-3 py-2">
            {error}
          </p>
        )}
        {success && (
          <p className="mt-3 text-sm rounded-md bg-emerald-50 text-emerald-700 border border-emerald-200 px-3 py-2">
            {success}
          </p>
        )}
      </div>
    </form>
  )
}

export default UploadForm
