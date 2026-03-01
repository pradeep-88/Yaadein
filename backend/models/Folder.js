// import mongoose from 'mongoose'

// const folderSchema = new mongoose.Schema({
//   name: String,
//   userId: mongoose.Schema.Types.ObjectId,
// }, { timestamps: true })

// export default mongoose.model('Folder', folderSchema)


import mongoose from 'mongoose'

const folderSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  },
  { timestamps: true }
)

export default mongoose.model('Folder', folderSchema)
