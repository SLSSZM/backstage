const mongoose = require('../index')

const Categoies = mongoose.model('Categoies', new mongoose.Schema({
  cat_deleted: {
    type: Boolean,
    default: false
  },
  cat_name: {
    type: String
  },
  cat_level: {
    type: Number
  },
  children: {
    type: []
  },
  cat_id: {
    type: Number,
    default: 0
  },
  cat_pid: {
    type: Number
  }
}))
module.exports = Categoies;