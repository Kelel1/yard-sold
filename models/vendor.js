const mongoose = require('mongoose')

/**
 * Monggos Schema for Vendor
 */

const schema = new mongoose.Schema({
  username: {
    type: String,
    required: true,
  },
  passwordHash: {
    type: String,
    required: true,
  },
  name: {
    type: String,
    required: true,
    unique: true,
  },
  phone: {
    type: String,
    minlength: 10
  },
  email: {
    type: String,
    minlength: 5,
  },
  address: {
    type: String,
    minlength: 5
  },
  items: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Item'
  }],
})

module.exports = mongoose.model('Vendor', schema)