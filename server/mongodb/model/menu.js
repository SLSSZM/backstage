const mongoose = require('../index')

const Menu = mongoose.model('Menu', new mongoose.Schema({
  id: {
    type: Number,
    default: new Date()
  },
  authname: {
    type: String
  },
  path: {
    type: String
  },
  children: {
    type: []
  }
}))
module.exports = Menu;