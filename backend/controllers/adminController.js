// import User from '../models/User.js'
// import Folder from '../models/Folder.js'
// import Image from '../models/Image.js'

// export const getOverview = async (req, res) => {
//   try {
//     const userCount = await User.countDocuments()
//     const folderCount = await Folder.countDocuments()
//     const imageCount = await Image.countDocuments()
//     res.json({ userCount, folderCount, imageCount })
//   } catch {
//     res.status(500).json({ error: 'Failed to fetch stats' })
//   }
// }

// export const listUsers = async (req, res) => {
//   const users = await User.find().select('-password')
//   res.json(users)
// }

// export const listAllFolders = async (req, res) => {
//   const folders = await Folder.find().populate('userId', 'email')
//   res.json(folders)
// }

// export const listAllImages = async (req, res) => {
//   const images = await Image.find().populate('folderId')
//   res.json(images)
// }


// export const deleteUser = async (req, res) => {
//   try {
//     const userId = req.params.id

//     // Step 1: Delete all folders and images of the user
//     const userFolders = await Folder.find({ userId })
//     const folderIds = userFolders.map(f => f._id)

//     await Image.deleteMany({ folderId: { $in: folderIds } })
//     await Folder.deleteMany({ userId })

//     // Step 2: Delete user
//     await User.findByIdAndDelete(userId)

//     res.json({ success: true, message: 'User and related data deleted' })
//   } catch (err) {
//     console.error('Error deleting user:', err)
//     res.status(500).json({ error: 'Failed to delete user' })
//   }
// }




// import User from '../models/User.js'
// import Folder from '../models/Folder.js'
// import Image from '../models/Image.js'

// // Dashboard Overview
// export const getOverview = async (req, res) => {
//   try {
//     const userCount = await User.countDocuments()
//     const folderCount = await Folder.countDocuments()
//     const imageCount = await Image.countDocuments()
//     res.json({ userCount, folderCount, imageCount })
//   } catch {
//     res.status(500).json({ error: 'Failed to fetch stats' })
//   }
// }

// // List all users (excluding password)
// export const listUsers = async (req, res) => {
//   const users = await User.find().select('-password')
//   res.json(users)
// }

// // List all folders
// export const listAllFolders = async (req, res) => {
//   const folders = await Folder.find().populate('userId', 'email')
//   res.json(folders)
// }

// // List all images
// export const listAllImages = async (req, res) => {
//   const images = await Image.find().populate('folderId')
//   res.json(images)
// }

// // Delete a user and all their folders and images
// export const deleteUser = async (req, res) => {
//   try {
//     const userId = req.params.id

//     const userFolders = await Folder.find({ userId })
//     const folderIds = userFolders.map(f => f._id)

//     await Image.deleteMany({ folderId: { $in: folderIds } })
//     await Folder.deleteMany({ userId })
//     await User.findByIdAndDelete(userId)

//     res.json({ success: true, message: 'User and related data deleted' })
//   } catch (err) {
//     console.error('Error deleting user:', err)
//     res.status(500).json({ error: 'Failed to delete user' })
//   }
// }

// // ✅ Delete a specific folder and its images
// export const deleteFolder = async (req, res) => {
//   try {
//     const folderId = req.params.id

//     await Image.deleteMany({ folderId })
//     await Folder.findByIdAndDelete(folderId)

//     res.json({ success: true, message: 'Folder and its images deleted' })
//   } catch (err) {
//     console.error('Error deleting folder:', err)
//     res.status(500).json({ error: 'Failed to delete folder' })
//   }
// }

// // ✅ Delete a specific image
// export const deleteImage = async (req, res) => {
//   try {
//     const imageId = req.params.id

//     await Image.findByIdAndDelete(imageId)

//     res.json({ success: true, message: 'Image deleted' })
//   } catch (err) {
//     console.error('Error deleting image:', err)
//     res.status(500).json({ error: 'Failed to delete image' })
//   }
// }



import User from '../models/User.js'
import Folder from '../models/Folder.js'
import Image from '../models/Image.js'
import QRCode from 'qrcode' // For generating QR codes

// 📊 Dashboard Overview
export const getOverview = async (req, res) => {
  try {
    const userCount = await User.countDocuments()
    const folderCount = await Folder.countDocuments()
    const imageCount = await Image.countDocuments()
    res.json({ userCount, folderCount, imageCount })
  } catch {
    res.status(500).json({ error: 'Failed to fetch stats' })
  }
}

// 👥 List all users (excluding passwords)
export const listUsers = async (req, res) => {
  try {
    const users = await User.find().select('-password')
    res.json(users)
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch users' })
  }
}

// 📁 List all folders with user emails
export const listAllFolders = async (req, res) => {
  try {
    const folders = await Folder.find().populate('userId', 'email')
    res.json(folders)
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch folders' })
  }
}

// 🖼️ List all images with folder info
export const listAllImages = async (req, res) => {
  try {
    const images = await Image.find().populate('folderId')
    res.json(images)
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch images' })
  }
}

// 🧾 Upload image with QR code
export const uploadImageWithQR = async (req, res) => {
  try {
    const { folderId, imageUrl } = req.body

    if (!folderId || !imageUrl) {
      return res.status(400).json({ error: 'Missing required fields' })
    }

    // Generate QR code from image URL
    const qrDataUrl = await QRCode.toDataURL(imageUrl)

    const image = new Image({
      folderId,
      imageUrl,
      qrCode: qrDataUrl,
    })

    await image.save()
    res.json({ success: true, image })
  } catch (err) {
    console.error('Error uploading image with QR:', err)
    res.status(500).json({ error: 'Failed to upload image with QR code' })
  }
}

// ❌ Delete a user and related data
export const deleteUser = async (req, res) => {
  try {
    const userId = req.params.id
    const userFolders = await Folder.find({ userId })
    const folderIds = userFolders.map(f => f._id)

    await Image.deleteMany({ folderId: { $in: folderIds } })
    await Folder.deleteMany({ userId })
    await User.findByIdAndDelete(userId)

    res.json({ success: true, message: 'User and related data deleted' })
  } catch (err) {
    console.error('Error deleting user:', err)
    res.status(500).json({ error: 'Failed to delete user' })
  }
}

// ❌ Delete a folder and its images
export const deleteFolder = async (req, res) => {
  try {
    const folderId = req.params.id

    await Image.deleteMany({ folderId })
    await Folder.findByIdAndDelete(folderId)

    res.json({ success: true, message: 'Folder and its images deleted' })
  } catch (err) {
    console.error('Error deleting folder:', err)
    res.status(500).json({ error: 'Failed to delete folder' })
  }
}

// ❌ Delete a specific image
export const deleteImage = async (req, res) => {
  try {
    const imageId = req.params.id
    await Image.findByIdAndDelete(imageId)

    res.json({ success: true, message: 'Image deleted' })
  } catch (err) {
    console.error('Error deleting image:', err)
    res.status(500).json({ error: 'Failed to delete image' })
  }
}
