const mongoose = require('../../index')

const RightsList = mongoose.model('RightsList', new mongoose.Schema({
  id: {
    type: Number
  },
  authName: {
    type: String
  },
  path: {
    type: String
  },
  pid: {
    type: Number
  },
  level: {
    type: String
  }
}))

module.exports = RightsList;