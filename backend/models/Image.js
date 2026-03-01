// import mongoose from 'mongoose'

// const imageSchema = new mongoose.Schema({
//   url: String,
//   metadata: {
//     title: String,
//     description: String,
//     tags: [String],
//   },
//   folderId: mongoose.Schema.Types.ObjectId,
//   qrCodeUrl: String,
// }, { timestamps: true })

// export default mongoose.model('Image', imageSchema)


import mongoose from 'mongoose'

const imageSchema = new mongoose.Schema(
  {
    url: { type: String, required: true },
    metadata: {
      title: { type: String, default: '' },
      description: { type: String, default: '' },
      tags: { type: [String], default: [] },
    },
    folderId: { type: mongoose.Schema.Types.ObjectId, ref: 'Folder', required: true },
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    qrCodeUrl: String,
  },
  { timestamps: true }
)

export default mongoose.model('Image', imageSchema)
