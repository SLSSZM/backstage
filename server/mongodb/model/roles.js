const mongoose = require('../index');

const Roles = mongoose.model('Role', new mongoose.Schema({
  id: {
    type: Number
  },
  roleDesc: {
    type: String
  },
  roleName: {
    type: String
  },
  children: {
    type: [],
    default: []
  }
}))

module.exports = Roles;