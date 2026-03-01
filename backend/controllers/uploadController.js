



// import Folder from '../models/Folder.js'
// import Image from '../models/Image.js'
// import cloudinary from '../config/cloudinary.js'
// import QRCode from 'qrcode'

// // ✅ Create a new folder
// export const createFolder = async (req, res) => {
//   try {
//     const folder = await Folder.create({
//       name: req.body.name,
//       userId: req.user._id,
//     })
//     res.status(201).json(folder)
//   } catch (err) {
//     console.error('❌ Folder Creation Error:', err)
//     res.status(500).json({ error: 'Failed to create folder', details: err.message })
//   }
// }

// // ✅ Get all folders (visible to all authenticated users)
// export const getFolders = async (req, res) => {
//   try {
//     const folders = await Folder.find()
//     res.status(200).json(folders)
//   } catch (err) {
//     console.error('❌ Get Folders Error:', err)
//     res.status(500).json({ error: 'Failed to fetch folders', details: err.message })
//   }
// }

// // ✅ Upload image (only if folder belongs to the user)
// export const uploadImage = async (req, res) => {
//   try {
//     const { metadata, folderId, base64Image } = req.body

//     if (!base64Image || !folderId || !metadata) {
//       return res.status(400).json({ error: 'Missing required fields' })
//     }

//     // 🔒 Ensure folder belongs to uploader
//     const folder = await Folder.findById(folderId)
//     if (!folder) return res.status(404).json({ error: 'Folder not found' })
//     if (!folder.userId.equals(req.user._id)) {
//       return res.status(403).json({ error: 'Not authorized to upload to this folder' })
//     }

//     const uploadRes = await cloudinary.uploader.upload(base64Image, { folder: 'ISP' })
//     const qrCodeDataUrl = await QRCode.toDataURL(uploadRes.secure_url)

//     const image = await Image.create({
//       url: uploadRes.secure_url,
//       folderId,
//       userId: req.user._id,
//       metadata: {
//         title: metadata.title || '',
//         description: metadata.description || '',
//         tags: Array.isArray(metadata.tags) ? metadata.tags : [],
//       },
//       qrCodeUrl: qrCodeDataUrl,
//     })

//     res.status(201).json(image)
//   } catch (err) {
//     console.error('❌ Upload Error:', err)
//     res.status(500).json({ error: 'Upload failed', details: err.message })
//   }
// }

// // ✅ Get all images by folder (open to all logged-in users)
// export const getImagesByFolder = async (req, res) => {
//   try {
//     const images = await Image.find({ folderId: req.params.folderId })
//     res.status(200).json(images)
//   } catch (err) {
//     console.error('❌ Get Images Error:', err)
//     res.status(500).json({ error: 'Failed to get images', details: err.message })
//   }
// }

// // ✅ Delete folder (only owner) and its images
// export const deleteFolder = async (req, res) => {
//   const folderId = req.params.id
//   const userId = req.user._id

//   try {
//     const folder = await Folder.findOneAndDelete({ _id: folderId, userId })
//     if (!folder) {
//       return res.status(404).json({ message: 'Folder not found or unauthorized' })
//     }

//     // Delete all images under this folder
//     const images = await Image.find({ folderId: folder._id })

//     for (const img of images) {
//       const publicId = img.url.split('/').pop().split('.')[0]
//       await cloudinary.uploader.destroy(`ISP/${publicId}`)
//     }

//     await Image.deleteMany({ folderId: folder._id })

//     res.status(200).json({ message: 'Folder and associated images deleted' })
//   } catch (error) {
//     console.error('❌ Delete Folder Error:', error)
//     res.status(500).json({ message: 'Server error while deleting folder' })
//   }
// }

// // ✅ Delete image (only by uploader)
// export const deleteImage = async (req, res) => {
//   const userId = req.user._id

//   try {
//     const image = await Image.findOne({ _id: req.params.id, userId })
//     if (!image) return res.status(404).json({ error: 'Image not found or unauthorized' })

//     const publicId = image.url.split('/').pop().split('.')[0]
//     await cloudinary.uploader.destroy(`ISP/${publicId}`)
//     await image.deleteOne()

//     res.json({ message: 'Image deleted successfully' })
//   } catch (err) {
//     console.error('❌ Delete Image Error:', err)
//     res.status(500).json({ error: 'Delete failed', details: err.message })
//   }
// }



// import Folder from '../models/Folder.js'
// import Image from '../models/Image.js'
// import cloudinary from '../config/cloudinary.js'
// import QRCode from 'qrcode'

// // ✅ Create a new folder
// export const createFolder = async (req, res) => {
//   try {
//     const folder = await Folder.create({
//       name: req.body.name,
//       userId: req.user._id,
//     })
//     res.status(201).json(folder)
//   } catch (err) {
//     console.error('❌ Folder Creation Error:', err)
//     res.status(500).json({ error: 'Failed to create folder', details: err.message })
//   }
// }

// // ✅ Get all folders
// export const getFolders = async (req, res) => {
//   try {
//     const folders = await Folder.find()
//     res.status(200).json(folders)
//   } catch (err) {
//     console.error('❌ Get Folders Error:', err)
//     res.status(500).json({ error: 'Failed to fetch folders', details: err.message })
//   }
// }

// // ✅ Upload image with QR code generation
// export const uploadImage = async (req, res) => {
//   try {
//     const { metadata, folderId, base64Image } = req.body

//     if (!base64Image || !folderId || !metadata) {
//       return res.status(400).json({ error: 'Missing required fields' })
//     }

//     // 🔒 Ensure folder belongs to uploader
//     const folder = await Folder.findById(folderId)
//     if (!folder) return res.status(404).json({ error: 'Folder not found' })
//     if (!folder.userId.equals(req.user._id)) {
//       return res.status(403).json({ error: 'Not authorized to upload to this folder' })
//     }

//     // 📤 Upload to Cloudinary
//     const uploadRes = await cloudinary.uploader.upload(base64Image, { folder: 'ISP' })

//     // 📸 Generate QR Code for the image URL
//     const qrCodeDataUrl = await QRCode.toDataURL(uploadRes.secure_url)

//     // 🖼️ Save image metadata in DB
//     const image = await Image.create({
//       url: uploadRes.secure_url,
//       folderId,
//       userId: req.user._id,
//       metadata: {
//         title: metadata.title || '',
//         description: metadata.description || '',
//         tags: Array.isArray(metadata.tags) ? metadata.tags : [],
//       },
//       qrCodeUrl: qrCodeDataUrl,
//     })

//     res.status(201).json(image)
//   } catch (err) {
//     console.error('❌ Upload Error:', err)
//     res.status(500).json({ error: 'Upload failed', details: err.message })
//   }
// }

// // ✅ Get all images by folder ID
// export const getImagesByFolder = async (req, res) => {
//   try {
//     const images = await Image.find({ folderId: req.params.folderId })
//     res.status(200).json(images)
//   } catch (err) {
//     console.error('❌ Get Images Error:', err)
//     res.status(500).json({ error: 'Failed to get images', details: err.message })
//   }
// }

// // ✅ Delete folder and all its images
// export const deleteFolder = async (req, res) => {
//   const folderId = req.params.id
//   const userId = req.user._id

//   try {
//     const folder = await Folder.findOneAndDelete({ _id: folderId, userId })
//     if (!folder) {
//       return res.status(404).json({ message: 'Folder not found or unauthorized' })
//     }

//     const images = await Image.find({ folderId: folder._id })
//     for (const img of images) {
//       const publicId = img.url.split('/').pop().split('.')[0]
//       await cloudinary.uploader.destroy(`ISP/${publicId}`)
//     }

//     await Image.deleteMany({ folderId: folder._id })

//     res.status(200).json({ message: 'Folder and associated images deleted' })
//   } catch (error) {
//     console.error('❌ Delete Folder Error:', error)
//     res.status(500).json({ message: 'Server error while deleting folder' })
//   }
// }

// // ✅ Delete single image
// export const deleteImage = async (req, res) => {
//   const userId = req.user._id

//   try {
//     const image = await Image.findOne({ _id: req.params.id, userId })
//     if (!image) return res.status(404).json({ error: 'Image not found or unauthorized' })

//     const publicId = image.url.split('/').pop().split('.')[0]
//     await cloudinary.uploader.destroy(`ISP/${publicId}`)
//     await image.deleteOne()

//     res.json({ message: 'Image deleted successfully' })
//   } catch (err) {
//     console.error('❌ Delete Image Error:', err)
//     res.status(500).json({ error: 'Delete failed', details: err.message })
//   }
// }



import Folder from '../models/Folder.js'
import Image from '../models/Image.js'
import cloudinary from '../config/cloudinary.js'
import QRCode from 'qrcode'

// Utility: normalize Mongoose docs/lean objects to strings for IDs
const toStr = (id) => (id == null ? id : String(id))

// Create folder
export const createFolder = async (req, res) => {
  try {
    const folder = await Folder.create({
      name: req.body.name,
      userId: req.userId, // normalized from middleware (ObjectId)
    })
    const out = { ...folder.toObject(), _id: toStr(folder._id), userId: toStr(folder.userId) }
    res.status(201).json(out)
  } catch (err) {
    console.error('❌ Folder Creation Error:', err)
    res.status(500).json({ error: 'Failed to create folder', details: err.message })
  }
}

// Get folders (owner-only unless admin)
export const getFolders = async (req, res) => {
  try {
    const query = req.isAdmin ? {} : { userId: req.userId }
    const folders = await Folder.find(query).sort({ updatedAt: -1 }).lean()
    const out = folders.map(f => ({ ...f, _id: toStr(f._id), userId: toStr(f.userId) }))
    res.status(200).json(out)
  } catch (err) {
    console.error('❌ Get Folders Error:', err)
    res.status(500).json({ error: 'Failed to fetch folders', details: err.message })
  }
}

// Upload image
export const uploadImage = async (req, res) => {
  try {
    const { metadata, folderId, base64Image } = req.body
    if (!base64Image || !folderId || !metadata) {
      return res.status(400).json({ error: 'Missing required fields' })
    }

    // Check folder ownership (or admin)
    const folder = await Folder.findById(folderId)
    if (!folder) return res.status(404).json({ error: 'Folder not found' })
    if (!req.isAdmin && toStr(folder.userId) !== req.userIdStr) {
      return res.status(403).json({ error: 'Not authorized to upload to this folder' })
    }

    // Upload to Cloudinary
    const uploadRes = await cloudinary.uploader.upload(base64Image, { folder: 'ISP' })

    // Generate QR for image URL
    const qrCodeDataUrl = await QRCode.toDataURL(uploadRes.secure_url)

    // Save image
    const image = await Image.create({
      url: uploadRes.secure_url,
      folderId,
      userId: req.userId, // ObjectId
      metadata: {
        title: metadata.title || '',
        description: metadata.description || '',
        tags: Array.isArray(metadata.tags) ? metadata.tags : [],
      },
      qrCodeUrl: qrCodeDataUrl,
    })

    const out = {
      ...image.toObject(),
      _id: toStr(image._id),
      folderId: toStr(image.folderId),
      userId: toStr(image.userId),
    }
    res.status(201).json(out)
  } catch (err) {
    console.error('❌ Upload Error:', err)
    res.status(500).json({ error: 'Upload failed', details: err.message })
  }
}

// Get images by folder
export const getImagesByFolder = async (req, res) => {
  try {
    const images = await Image.find({ folderId: req.params.folderId })
      .sort({ createdAt: -1 })
      .lean()
    const out = images.map(i => ({
      ...i,
      _id: toStr(i._id),
      folderId: toStr(i.folderId),
      userId: toStr(i.userId),
    }))
    res.status(200).json(out)
  } catch (err) {
    console.error('❌ Get Images Error:', err)
    res.status(500).json({ error: 'Failed to get images', details: err.message })
  }
}

// Delete folder (owner or admin). Also remove images + Cloudinary files.
export const deleteFolder = async (req, res) => {
  const folderId = req.params.id
  try {
    const folder = await Folder.findById(folderId)
    if (!folder) return res.status(404).json({ message: 'Folder not found' })
    if (!req.isAdmin && toStr(folder.userId) !== req.userIdStr) {
      return res.status(403).json({ message: 'Forbidden' })
    }

    const images = await Image.find({ folderId: folder._id })
    for (const img of images) {
      const publicId = img.url.split('/').pop().split('.')[0]
      try {
        await cloudinary.uploader.destroy(`ISP/${publicId}`)
      } catch (e) {
        console.warn('Cloudinary destroy warn:', e.message)
      }
    }
    await Image.deleteMany({ folderId: folder._id })
    await folder.deleteOne()

    res.status(200).json({ message: 'Folder and associated images deleted' })
  } catch (error) {
    console.error('❌ Delete Folder Error:', error)
    res.status(500).json({ message: 'Server error while deleting folder' })
  }
}

// Delete image (owner or admin)
export const deleteImage = async (req, res) => {
  try {
    const image = await Image.findById(req.params.id)
    if (!image) return res.status(404).json({ error: 'Image not found' })
    if (!req.isAdmin && toStr(image.userId) !== req.userIdStr) {
      return res.status(403).json({ error: 'Forbidden' })
    }

    const publicId = image.url.split('/').pop().split('.')[0]
    try {
      await cloudinary.uploader.destroy(`ISP/${publicId}`)
    } catch (e) {
      console.warn('Cloudinary destroy warn:', e.message)
    }
    await image.deleteOne()

    res.json({ message: 'Image deleted successfully' })
  } catch (err) {
    console.error('❌ Delete Image Error:', err)
    res.status(500).json({ error: 'Delete failed', details: err.message })
  }
}
