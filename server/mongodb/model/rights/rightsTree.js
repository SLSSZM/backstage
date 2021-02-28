const mongoose = require('../../index')

const RightsTree = mongoose.model('RightsTree', new mongoose.Schema({
  id: {
    type: Number
  },
  authName: {
    type: String
  },
  path: {
    type: String
  },
  children: {
    type: []
  }
}))

module.exports = RightsTree;