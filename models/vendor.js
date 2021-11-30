import mongoose from 'mongoose'

/**
 * Monggos Schema for Vendor
 */

const schema = new mongoose.Schema({
  username: {
    type: String,
    required: true,
    unique: true,
  },
  password: {
    type: String,
    required: true,
  },
  name: {
    type: String,
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
  description: {
    type: String,
  },
  profilePic: {
    type: String
},
  createdAt: {
    type: String
},
  items: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Item'
  }],
})

export default mongoose.model('Vendor', schema)