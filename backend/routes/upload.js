import express from 'express'
import { uploadImage, createFolder, getFolders, getImagesByFolder,deleteFolder,deleteImage} from '../controllers/uploadController.js'
import { authMiddleware } from '../middleware/auth.js'

const router = express.Router()

router.post('/folder', authMiddleware, createFolder)
router.get('/folders', authMiddleware, getFolders)
router.post('/image', authMiddleware, uploadImage)
router.get('/images/:folderId', authMiddleware, getImagesByFolder)
router.delete('/folder/:id', authMiddleware, deleteFolder)
router.delete('/image/:id', authMiddleware, deleteImage)


export default router
