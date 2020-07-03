const mongoose = require('mongoose')

const schema = new mongoose.Schema({
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
  items: {
    type: [Item]
  },
})

module.exports = mongoose.model('Vendor', schema)