import vision from '@google-cloud/vision'
import path from 'path'
import { fileURLToPath } from 'url'

// Required for __dirname in ES modules
const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

// Create a Vision client using the JSON key
const client = new vision.ImageAnnotatorClient({
  keyFilename: path.join(__dirname, '../gcloud-key.json') // adjust if needed
})

export default client
