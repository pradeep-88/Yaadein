// import express from 'express'
// import { getOverview, listUsers, listAllFolders, listAllImages } from '../controllers/adminController.js'
// import { authMiddleware, isAdminMiddleware } from '../middleware/auth.js'
// import { deleteUser } from '../controllers/adminController.js'

// const router = express.Router()

// router.get('/overview', authMiddleware, isAdminMiddleware, getOverview)
// router.get('/users', authMiddleware, isAdminMiddleware, listUsers)
// router.get('/folders', authMiddleware, isAdminMiddleware, listAllFolders)
// router.get('/images', authMiddleware, isAdminMiddleware, listAllImages)
// router.delete('/user/:id', authMiddleware, isAdminMiddleware, deleteUser)

// export default router


import express from 'express'
import {
  getOverview,
  listUsers,
  listAllFolders,
  listAllImages,
  deleteUser,
  deleteFolder,
  deleteImage
} from '../controllers/adminController.js'

import { authMiddleware, isAdminMiddleware } from '../middleware/auth.js'

const router = express.Router()

// Routes only accessible by authenticated admins
router.get('/overview', authMiddleware, isAdminMiddleware, getOverview)
router.get('/users', authMiddleware, isAdminMiddleware, listUsers)
router.get('/folders', authMiddleware, isAdminMiddleware, listAllFolders)
router.get('/images', authMiddleware, isAdminMiddleware, listAllImages)
router.delete('/user/:id', authMiddleware, isAdminMiddleware, deleteUser)
router.delete('/folder/:id', deleteFolder)
router.delete('/image/:id', deleteImage)


export default router
