import React, { useState } from 'react'
import { useParams, Link } from 'react-router-dom'
import MainLayout from '../layouts/MainLayout'
import UploadForm from '../features/dashboard/UploadForm'
import ImageGrid from '../features/dashboard/ImageGrid'

const FolderImagesPage = () => {
  const { id } = useParams()
  const [refresh, setRefresh] = useState(0)

  return (
    <MainLayout>
      {/* Header */}
      <div className="sticky top-14 z-10 bg-white/80 backdrop-blur border-b border-gray-100">
        <div className="max-w-6xl mx-auto px-2 sm:px-0 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Link
              to="/dashboard"
              className="text-sm text-blue-600 hover:underline"
            >
              ← Back to Dashboard
            </Link>
            <h2 className="text-xl font-bold">Images in Folder</h2>
            <span className="text-xs px-2 py-1 rounded-full bg-gray-100 text-gray-700 border border-gray-200">
              ID: {id}
            </span>
          </div>
        </div>
      </div>

      {/* Body */}
      <div className="max-w-6xl mx-auto mt-4 space-y-4">
        {/* Upload card */}
        <div className="rounded-xl border border-gray-200 bg-white/90 backdrop-blur p-4 shadow-sm">
          <UploadForm
            folderId={id}
            onUploadSuccess={() => setRefresh((n) => n + 1)}
          />
        </div>

        {/* Images grid */}
        <div className="rounded-xl border border-gray-200 bg-white/90 backdrop-blur p-4 shadow-sm">
          <ImageGrid key={refresh} folderId={id} />
        </div>
      </div>
    </MainLayout>
  )
}

export default FolderImagesPage
