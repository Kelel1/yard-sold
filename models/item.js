const mongoose     = require('mongoose')

/**
 * Monggos Schema for Item
 */

const schema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  price: {
    type: mongoose.Schema.Types.Decimal128,
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
  }
})

module.exports = mongoose.model('Item', schema)