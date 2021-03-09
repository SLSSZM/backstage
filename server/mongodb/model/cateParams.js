const mongoose = require('../index');

const CateParams = mongoose.model('cateparam', new mongoose.Schema({
  attr_id: {
    type: Number
  },
  attr_name: {
    type: String
  },
  attr_sel: {
    type: String
  },
  attr_vals: {
    type: String,
    default: ''
  },
  attr_write: {
    type: String
  },
  cat_id: {
    type: Number
  }
}))

module.exports = CateParams;