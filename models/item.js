import mongoose from 'mongoose'

/**
 * Monggos Schema for Item
 */

const schema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  price: {
    type: String,
    required: true,
  },
  inventoryCount: {
    type: Number,
    required: true,
  },
  images: {
    type: [String],
  },
  description: {
    type: String,
  },
  onHold: {
    type: Boolean,
  }, 
  totalOnHold: {
    type: Number,
  }
})

export default mongoose.model('Item', schema)