const express = require('express');
const goodsRouter = express.Router();
const goodsCollection = require('../../mongodb/model/goods');
const counter = require('../../mongodb/model/counters');

//获取商品列表数据
goodsRouter.get('/api/goods', async (req, res) => {
  let { query, pagenum, pagesize } = req.query;
  query === '' ? query = {} : query = { goods_name: query };
  const info = await goodsCollection.find(query);
  const total = info.length;
  const result = []
  const start = +pagenum * +pagesize - +pagesize;
  for (let i = start; i < start + (+pagesize); i++) {
    if (info[i]) {
      result.push(info[i]);
    }
  }
  if (result.length === 0) {
    return res.send({ meta: { status: 403, msg: '获取商品数据失败' } })
  }
  res.send({ data: { total, result, pagenum }, meta: { status: 201, msg: '获取商品数据成功' } });

})
//添加商品
goodsRouter.post('/api/goods', async (req, res) => {
  const data = req.body;
  data.goods_id = await counter.addId();
  const createGoods = await goodsCollection.create(data);
  if (!data) {
    return res.send({ meta: { status: 403, msg: '添加商品失败' } })
  }
  res.send({ data: createGoods, meta: { status: 201, msg: '添加商品成功' } });
})
//删除商品
goodsRouter.delete('/api/goods/:id', async (req, res) => {
  const id = req.params.id;
  const deleteGoods = await goodsCollection.deleteOne({ goods_id: id });
  if (deleteGoods.deletedCount === 0) {
    return res.send({ meta: { status: 403, msg: '删除商品失败' } });
  }
  res.send({ meta: { status: 201, msg: '删除商品成功' } });
})
//编辑商品
goodsRouter.put('/api/goods/:id', async (req, res) => {
  const id = req.params.id;
  const data = req.body;
  data.goods_weight = parseInt(data.goods_weight);
  data.goods_price = parseInt(data.goods_price);
  data.goods_number = parseInt(data.goods_number);
  data.upd_time = new Date().getTime();
  const editGoods = await goodsCollection.updateOne({ goods_id: id }, data);
  if (editGoods.nModified === 0) {
    return res.send({ meta: { status: 403, msg: '编辑商品失败' } });
  }
  res.send({ meta: { status: 201, msg: '编辑商品成功' } });
})
//获取编辑商品的数据
goodsRouter.get('/api/goods/:id', async (req, res) => {
  const id = req.params.id;
  const data = await goodsCollection.findOne({ goods_id: id });
  if (!data) {
    return res.send({ meta: { status: 403, msg: '获取商品数据失败' } });
  }
  res.send({ data, meta: { status: 201, msg: '获取商品数据成功' } });
})






module.exports = goodsRouter;