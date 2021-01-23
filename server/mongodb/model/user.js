const mongoose = require('../index');

//创建user的集合存储账号
const User = mongoose.model('User', new mongoose.Schema({
  username: {
    type: String
  },
  password: {
    type: String
  },
  email: {
    type: String
  },
  mobile: {
    type: Number
  },
  roleName: {
    type: String,
    default: 'root'
  }
}));

module.exports = User;