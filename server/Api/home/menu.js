const express = require('express');
const menuCollection = require('../../mongodb/model/menu');
const menuRouter = express.Router();
menuRouter.get('/api/menu', async (req, res) => {
  const menu = await menuCollection.find({});
  if(menu.length === 0) {
    res.send({meta: {msg: '获取菜单数据失败', status: 403}})
  }
  res.send({data: menu, meta: {msg: '获取菜单数据成功', status: 200}})
})

module.exports = menuRouter;