const express = require('express');
const uploadRouter = express.Router();
const multer = require('multer');
const path = require('path');
const fs = require('fs');
const imgPath = path.join(__dirname, '../../static/images');

var storage = multer.diskStorage({
  destination: function (req, file, cb) {
    // 指定文件路径
    cb(null, imgPath)
  },
  filename: function (req, file, cb) {
    // 指定文件名
    //文件名重复覆盖
    // 后缀名发生改变,如何解决？
    let exts = file.originalname.split('.') //拿到源文件的后缀名
    let ext = exts[exts.length - 1]
    let tmpname = (new Date()).getTime() + parseInt(Math.random() * 9999)
    //为了避免重复，用时间戳表示
    cb(null, `${tmpname}.${ext}`);
  }
});
var upload = multer({
  storage: storage
});

//上传图片必须用post方法
//hehe就是上传图片数据的key值，前端必须保持统一。可以用postman模拟，数据类型是表单对象。
uploadRouter.post('/api/upload', upload.single('file', 10), (req, res) => {
  let { size, mimetype } = req.file
  let types = ['jpg', 'jpeg', 'png', 'gif'] //允许上传的数据类型
  let tmpType = mimetype.split('/')[1];
  if (size > 500000) {
    return res.send({ meta: { status: 403, msg: '图片过大' } })
  } else if (types.indexOf(tmpType) == -1) {
    return res.send({ meta: { status: 403, msg: '所传类型不支持' } })
  } else {
    let url = `/static/images/${req.file.filename}`
    res.send({ data: { tmp_path: url, url: 'http://localhost:3000' + url, filename: req.file.filename }, meta: { status: 201, msg: 'ok' } })
  }
})
uploadRouter.delete('/api/upload/:filename', (req, res) => {
  const filename = '/' + req.params.filename;
  fs.unlink(imgPath + filename, (err) => {
    if (err) throw err;
    res.send({ meta: { status: 201, msg: '删除图片成功' } })
  });
})

module.exports = uploadRouter;