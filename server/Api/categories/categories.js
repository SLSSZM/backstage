const express = require('express');
const categoriesCollection = require('../../mongodb/model/categories');
const categoriesRouter = express.Router();
const counter = require('../../mongodb/model/counters')

//获取商品分类
categoriesRouter.get('/api/categories', async (req, res) => {
  req.query ? req.query : {};
  //查找商品分类所有参数
  const cateList = await categoriesCollection.find({});
  let { type, pagenum, pagesize } = req.query;
  //对type进行判断
  //1为获取一级分类
  //2为获取一二级分类
  //其余获取所有分类
  if(+type === 1) {
    cateList.forEach(item => delete item.children);
  }else if(+type === 2) {
    cateList.forEach(item => {
      item.children.forEach(item2 => delete item2.children);
    });
  }
  //所有数据
  const total = cateList.length;
  let start = +pagenum * +pagesize - +pagesize;
  let result = [];
  //如果有当前页数则返回所求的数据，如果没有则返回所有数据
  if(pagenum && pagesize) {
    for(let i=start; i<total; i++) {
      result.push(cateList[i]);
    }
  }else {
    result = cateList.slice();
  }
  const data = {
    pagenum,
    pagesize,
    result,
    total
  }
  if(result.length === 0) {
    res.send({meta: {msg: '获取分类数据失败', status: 403}})
  }
  res.send({ data, meta: { msg: '获取分类数据成功', status: 201 } })
});
//添加商品分类
categoriesRouter.post('/api/categories', async(req, res) => {
  let addCategoriesForm = req.body;
  addCategoriesForm.cat_id = await counter.addId();
  let add = {};
  if(addCategoriesForm.cat_level === 0) {
    add = await categoriesCollection.create(addCategoriesForm);
  }else if(addCategoriesForm.cat_level === 1){
    let parentCate = await categoriesCollection.findOne({cat_id: addCategoriesForm.cat_pid});
    parentCate.children.push(addCategoriesForm);
    add = await categoriesCollection.updateOne({cat_id: addCategoriesForm.cat_pid}, parentCate);
  }else {
    let cateList = await categoriesCollection.find({});
    let parentCate = {};
    cateList.forEach(item => {
      item.children.forEach(item2 => {
        if(item2.cat_id === addCategoriesForm.cat_pid) {
          parentCate = item;
        }
      })
    })
    parentCate.children.forEach(item => {
      if(item.cat_id === addCategoriesForm.cat_pid) {
        if(!item.children) {
          item.children = [];
        }
        item.children.push(addCategoriesForm);
      }
    });
    add = await categoriesCollection.updateOne({cat_id: parentCate.cat_id}, parentCate);
  }
  if(!add) {
    res.send({meta: {msg: '添加分类数据失败', status: 403}})
  }
  res.send({ add, meta: { msg: '添加分类数据成功', status: 201 } })
})
//编辑商品分类
categoriesRouter.put('/api/categories', async (req, res) => {
  const cate = req.body;
  const level = cate.cat_level;
  const id = cate.cat_id;
  const pid = cate.cat_pid;
  let edit = {};
  if(level === 0){
    edit = await categoriesCollection.updateOne({cat_id: id}, cate);
  }else if(level ===1) {
    let parentCate = await categoriesCollection.findOne({cat_id: pid})
    parentCate.children.forEach(item => {
      if(item.cat_id === id) {
        item.cat_name = cate.cat_name;
      }
    })
    console.log(parentCate)
    edit = await categoriesCollection.updateOne({cat_id: pid}, parentCate);
  }else {
    const cateList = await categoriesCollection.find({});
    let result = {};
    cateList.forEach(item => {
      item.children.forEach(item2 => {
        if(item2.children) {
          item2.children.forEach(item3 => {
            if(item3.cat_id === id) {
              item3.cat_name = cate.cat_name;
              result = item;
            }
          })
        }
      })
    })
    console.log(result)
    edit = await categoriesCollection.updateOne({cat_id: result.cat_id}, result);
  }

  if(!edit) {
    res.send({meta: {msg: '编辑分类数据失败', status: 403}})
  }
  res.send({ edit, meta: { msg: '编辑分类数据成功', status: 201 } })
})
//删除商品分类
categoriesRouter.delete('/api/categories/:id/:level/:pid', async (req, res) => {
  const level = +req.params.level;
  const id = +req.params.id;
  const pid = +req.params.pid;
  let delCate = {};
  if(level === 0){
    delCate = await categoriesCollection.deleteOne({cat_id: id});
  }else if(level === 1) {
    let parentCate = await categoriesCollection.findOne({cat_id: pid})
    parentCate.children.forEach((item, index) => {
      if(item.cat_id === id) {
        parentCate.children.splice(index, 1);
      }
    })
    // console.log(parentCate)
    delCate = await categoriesCollection.updateOne({cat_id: pid}, parentCate);
  }else {
    const cateList = await categoriesCollection.find({});
    let result = {};
    cateList.forEach(item => {
      item.children.forEach(item2 => {
        if(item2.children) {
          item2.children.forEach((item3, index) => {
            if(item3.cat_id === id) {
              item2.children.splice(index, 1);
              result = item;
            }
          })
        }
      })
    })
    // console.log(result)
    delCate = await categoriesCollection.updateOne({cat_id: result.cat_id}, result);
  }

  if(!delCate) {
    res.send({meta: {msg: '删除分类数据失败', status: 403}})
  }
  res.send({ delCate, meta: { msg: '删除分类数据成功', status: 201 } })
})

module.exports = categoriesRouter;