// import React from 'react'
// import { Link } from 'react-router-dom'
// import api from '../../services/axiosInstances'
// import { useAuth } from '../../contexts/AuthContext'

// const FolderCard = ({ folder, onDelete }) => {
//   const { userId, isAdmin } = useAuth()

//   // Normalize possible shapes: string | ObjectId | { _id }
//   const folderOwner =
//     folder.userId?._id ??
//     (typeof folder.userId === 'object' ? folder.userId?.toString?.() : folder.userId) ??
//     folder.ownerId ?? // if your API uses ownerId
//     folder.user;      // or user

//   const canDelete = isAdmin || String(folderOwner) === String(userId)

//   const handleDelete = async () => {
//     if (!window.confirm(`Delete folder "${folder.name || 'Untitled'}"?`)) return
//     try {
//       await api.delete(`/upload/folder/${folder._id}`)
//       onDelete?.()
//     } catch (err) {
//       alert('Failed to delete folder')
//     }
//   }

//   return (
//     <div className="relative bg-white shadow-md p-4 rounded border hover:shadow-lg transition">
//       <Link to={`/folder/${folder._id}`}>
//         <h2 className="text-lg font-semibold">{folder.name || 'Untitled Folder'}</h2>
//         <p className="text-sm text-gray-600 break-all">ID: {folder._id}</p>
//       </Link>

//       {canDelete && (
//         <button
//           onClick={handleDelete}
//           className="absolute top-2 right-2 z-10 text-red-500 hover:text-red-700 text-sm"
//         >
//           Delete
//         </button>
//       )}
//     </div>
//   )
// }

// export default FolderCard




// import React from 'react'
// import { Link } from 'react-router-dom'
// import api from '../../services/axiosInstances'
// import { useAuth } from '../../contexts/AuthContext'

// const FolderCard = ({ folder, onDelete }) => {
//   const { userId, isAdmin } = useAuth()
//   const canDelete = isAdmin || folder.userId === userId // backend returns strings

//   const handleDelete = async () => {
//     if (!window.confirm(`Delete folder "${folder.name || 'Untitled'}"?`)) return
//     try {
//       await api.delete(`/upload/folder/${folder._id}`)
//       onDelete?.()
//     } catch (err) {
//       alert('Failed to delete folder')
//     }
//   }

//   return (
//     <div className="relative bg-white shadow-md p-4 rounded border hover:shadow-lg transition">
//       <Link to={`/folder/${folder._id}`}>
//         <h2 className="text-lg font-semibold">{folder.name || 'Untitled Folder'}</h2>
//         <p className="text-sm text-gray-600 break-all">ID: {folder._id}</p>
//       </Link>

//       {canDelete && (
//         <button
//           onClick={handleDelete}
//           className="absolute top-2 right-2 z-10 text-red-500 hover:text-red-700 text-sm"
//         >
//           Delete
//         </button>
//       )}
//     </div>
//   )
// }

// export default FolderCard


import React from 'react'
import { Link, useNavigate } from 'react-router-dom'
import api from '../../services/axiosInstances'
import { useAuth } from '../../contexts/AuthContext'
import { useConfirmDialog } from '../../ConfirmDialogContext'

const FolderCard = ({ folder, onDelete }) => {
  const { userId, isAdmin } = useAuth()
  const { openConfirm } = useConfirmDialog()
  const navigate = useNavigate()

  const canDelete = isAdmin || folder.userId === userId

  const handleDelete = (e) => {
    e.stopPropagation()
    e.preventDefault()

    openConfirm(
      'Delete Folder',
      `Are you sure you want to delete "${folder.name || 'Untitled'}"? This will remove all its images.`,
      async () => {
        try {
          await api.delete(`/upload/folder/${folder._id}`)
          onDelete?.()
        } catch {
          // keep it simple; you can toast here if you prefer
          alert('Failed to delete folder')
        }
      }
    )
  }

  // Optional: click on the whole card (except Delete) goes to folder page
  const goToFolder = () => navigate(`/folder/${folder._id}`)

  return (
    // Gradient border shell
    <div className="group p-[2px] rounded-2xl bg-[conic-gradient(at_20%_20%,#3b82f6,#a855f7,#ec4899,#22d3ee,#3b82f6)] transition">
      {/* Glass card */}
      <div
        className="relative rounded-[18px] bg-white/90 backdrop-blur-md shadow-md
                   transition will-change-transform
                   hover:-translate-y-0.5 hover:shadow-xl cursor-pointer"
        onClick={goToFolder}
        role="button"
      >
        {/* Shimmer header strip */}
        <div className="h-1.5 w-full rounded-t-[18px] overflow-hidden">
          <div className="h-full w-[40%] bg-white/60 translate-x-[-50%]
                          group-hover:translate-x-[160%] transition-transform duration-[1600ms] ease-linear" />
        </div>

        {/* Content */}
        <div className="p-4">
          {/* Top row: icon + name/date */}
          <div className="flex items-start justify-between gap-3">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-blue-500 to-indigo-500 text-white flex items-center justify-center shadow">
                <svg className="w-6 h-6" viewBox="0 0 24 24" fill="none" aria-hidden="true">
                  <path d="M3 7h6l2 2h10v8a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V7z" stroke="currentColor" strokeWidth="2"/>
                </svg>
              </div>
              <div>
                <div className="font-semibold">{folder.name || 'Untitled Folder'}</div>
                <div className="text-xs text-gray-500">
                  {folder.updatedAt
                    ? `Updated ${new Date(folder.updatedAt).toLocaleDateString()}`
                    : `Created ${new Date(folder.createdAt).toLocaleDateString()}`}
                </div>
              </div>
            </div>

            {/* Delete (fades in on hover) */}
            {canDelete && (
              <button
                onClick={handleDelete}
                title="Delete folder"
                className="opacity-0 group-hover:opacity-100 transition
                           text-red-600 hover:text-red-700 text-sm
                           bg-red-50/80 hover:bg-red-100 px-2 py-1 rounded shadow-sm"
              >
                Delete
              </button>
            )}
          </div>

          {/* Subline with ID + animated underline */}
          <Link
            to={`/folder/${folder._id}`}
            className="block mt-3 pr-12"
            onClick={(e) => e.stopPropagation()}
          >
            <p className="text-sm text-gray-600 break-all">ID: {folder._id}</p>
            <span className="mt-2 block h-px w-0 bg-gradient-to-r from-blue-500 via-indigo-500 to-fuchsia-500
                             group-hover:w-full transition-all duration-500" />
          </Link>
        </div>
      </div>
    </div>
  )
}

export default FolderCard
