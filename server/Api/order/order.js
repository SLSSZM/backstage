const express = require('express');
const orderRouter = express.Router();
const orderCollection = require('../../mongodb/model/order');
const counter = require('../../mongodb/model/counters');

orderRouter.get('/api/order', async (req, res) => {
  let { query, pagenum, pagesize } = req.query;
  query = query === '' ? {} : { order_number: query };
  pagenum = parseInt(pagenum);
  pagesize = parseInt(pagesize);
  const data = await orderCollection.find(query);
  const total = data.length;
  const start = pagenum * pagesize - pagesize;
  let goods = [];
  for (let i = start; i < start + pagesize; i++) {
    if (data[i]) {
      goods.push(data[i]);
    }
  }

  if (goods.length === 0) {
    return res.send({ meta: { msg: '获取订单列表失败', status: 403 } });
  }
  res.send({ data: { goods, total, pagenum }, meta: { msg: '获取订单列表成功', status: 201 } });
})

orderRouter.put('/api/order/:orderId', async (req, res) => {
  const id = { order_id: req.params.orderId };
  const editData = req.body;
  const isOk = await orderCollection.updateOne(id, editData);
  if (isOk.nModified === 0) {
    return res.send({ meta: { msg: '获取订单列表失败', status: 403 } });
  }
  res.send({ meta: { msg: '获取订单列表成功', status: 201 } });
})



module.exports = orderRouter;