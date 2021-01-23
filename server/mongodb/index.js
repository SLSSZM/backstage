const mongoose = require('mongoose');

//连接mongodb
mongoose.connect('mongodb://localhost:27017/backstage', {
  user: "root", pass: "211722662", authSource: "admin",
  useNewUrlParser: true,
  useUnifiedTopology: true,
  useCreateIndex: true,
  useFindAndModify: false
}).then(() => console.log('连接数据库成功'));

module.exports = mongoose;
