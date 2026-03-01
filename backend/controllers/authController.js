import bcrypt from 'bcryptjs'
import jwt from 'jsonwebtoken'
import User from '../models/User.js'

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
const MIN_PASSWORD_LENGTH = 6

const generateToken = (userId) =>
  jwt.sign({ id: userId }, process.env.JWT_SECRET, { expiresIn: '7d' })

export const registerUser = async (req, res) => {
  const { email, password } = req.body
  const emailTrim = typeof email === 'string' ? email.trim().toLowerCase() : ''

  if (!emailTrim || !password) {
    return res.status(400).json({ error: 'Email and password required' })
  }
  if (!EMAIL_REGEX.test(emailTrim)) {
    return res.status(400).json({ error: 'Invalid email format' })
  }
  if (password.length < MIN_PASSWORD_LENGTH) {
    return res.status(400).json({ error: `Password must be at least ${MIN_PASSWORD_LENGTH} characters` })
  }

  try {
    const existingUser = await User.findOne({ email: emailTrim })
    if (existingUser) {
      return res.status(409).json({ error: 'User already exists' })
    }

    const hashedPassword = await bcrypt.hash(password, 10)
    const isFirstUser = (await User.countDocuments()) === 0

    const newUser = await User.create({
      email: emailTrim,
      password: hashedPassword,
      isAdmin: isFirstUser, // only first user becomes admin; ignore isAdmin from client
    })

    const token = generateToken(newUser._id)

    res.status(201).json({
      token,
      user: {
        id: newUser._id,
        email: newUser.email,
        isAdmin: newUser.isAdmin,
      },
    })
  } catch (err) {
    console.error('❌ Register Error:', err)
    res.status(500).json({ error: 'Server error' })
  }
}

export const login = async (req, res) => {
  const { email, password } = req.body
  const emailTrim = typeof email === 'string' ? email.trim().toLowerCase() : ''

  if (!emailTrim || !password) {
    return res.status(400).json({ error: 'Email and password required' })
  }

  try {
    const user = await User.findOne({ email: emailTrim })
    if (!user) {
      return res.status(400).json({ error: 'Invalid credentials' })
    }

    const isMatch = await bcrypt.compare(password, user.password)
    if (!isMatch) {
      return res.status(400).json({ error: 'Invalid credentials' })
    }

    const token = generateToken(user._id)

    res.status(200).json({
      token,
      user: {
        id: user._id,
        email: user.email,
        isAdmin: user.isAdmin,
      },
    })
  } catch (err) {
    console.error('❌ Login Error:', err)
    res.status(500).json({ error: 'Server error' })
  }
}
