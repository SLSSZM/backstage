const express = require('express');
const rightsTree = require('../../mongodb/model/rights/rightsTree');
const rightsList = require('../../mongodb/model/rights/rightsList');
const RightsRouter = express.Router();

//获取权限列表list/tree
RightsRouter.get('/api/rights/:type', async (req, res) => {
  const type = req.params.type;
  let rights = {};
  if(type === "list"){
    rights = await rightsList.find({});
  }else {
    rights = await rightsTree.find({});
  }
  res.send({data: rights, meta: {status: 201, msg: '获取权限列表成功'}});
})

module.exports = RightsRouter