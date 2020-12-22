const mongoose = require('../index');

//创建user的集合存储账号
const User = mongoose.model('User', new mongoose.Schema({
  username: {
    type: String
  },
  password: {
    type: String
  }
}));

module.exports = User;