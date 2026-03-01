// import jwt from 'jsonwebtoken'
// import User from '../models/User.js'

// // ✅ Middleware to verify token and attach user
// export const authMiddleware = async (req, res, next) => {
//   const authHeader = req.headers.authorization
//   if (!authHeader || !authHeader.startsWith('Bearer ')) {
//     return res.status(401).json({ error: 'No token provided' })
//   }

//   const token = authHeader.split(' ')[1]

//   try {
//     const decoded = jwt.verify(token, process.env.JWT_SECRET)
//     const user = await User.findById(decoded.id).select('-password')

//     if (!user) return res.status(401).json({ error: 'User not found' })

//     req.user = user // ✅ Attach full user object to request
//     next()
//   } catch (err) {
//     console.error('JWT verification error:', err.message)
//     return res.status(401).json({ error: 'Invalid token' })
//   }
// }

// // ✅ Admin-only check
// export const isAdminMiddleware = (req, res, next) => {
//   if (req.user?.isAdmin) return next()
//   return res.status(403).json({ error: 'Admin only access' })
// }


// import jwt from 'jsonwebtoken'
// import User from '../models/User.js'

// // Verify token, attach user + normalized ids to req
// export const authMiddleware = async (req, res, next) => {
//   const auth = req.headers.authorization || ''
//   if (!auth.startsWith('Bearer ')) {
//     return res.status(401).json({ error: 'No token provided' })
//   }

//   const token = auth.slice(7)
//   try {
//     const decoded = jwt.verify(token, process.env.JWT_SECRET)
//     // token should be signed with { id: user._id, isAdmin: user.isAdmin }
//     const user = await User.findById(decoded.id).select('-password')
//     if (!user) return res.status(401).json({ error: 'User not found' })

//     // Normalize access everywhere
//     req.user = user                    // Mongoose doc
//     req.userId = user._id              // ObjectId
//     req.userIdStr = String(user._id)   // string
//     req.isAdmin = !!user.isAdmin

//     next()
//   } catch (e) {
//     console.error('JWT verification error:', e.message)
//     return res.status(401).json({ error: 'Invalid token' })
//   }
// }

// export const isAdminMiddleware = (req, res, next) => {
//   if (req.isAdmin) return next()
//   return res.status(403).json({ error: 'Admin only access' })
// }


import jwt from 'jsonwebtoken'
import User from '../models/User.js'

// Verify token, load user, and expose normalized IDs for controllers
export const authMiddleware = async (req, res, next) => {
  const auth = req.headers.authorization || ''
  if (!auth.startsWith('Bearer ')) {
    return res.status(401).json({ error: 'No token provided' })
  }

  const token = auth.slice(7)
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET)
    // When signing JWT, use: { id: user._id, isAdmin: user.isAdmin }
    const user = await User.findById(decoded.id).select('-password')
    if (!user) return res.status(401).json({ error: 'User not found' })

    // Expose both object & string forms so controllers never guess
    req.user = user                 // Mongoose doc (has _id as ObjectId)
    req.userId = user._id           // ObjectId
    req.userIdStr = String(user._id) // string
    req.isAdmin = !!user.isAdmin

    next()
  } catch (e) {
    console.error('JWT verification error:', e.message)
    return res.status(401).json({ error: 'Invalid token' })
  }
}

// Optional: gate admin-only routes
export const isAdminMiddleware = (req, res, next) => {
  if (req.isAdmin) return next()
  return res.status(403).json({ error: 'Admin only access' })
}
