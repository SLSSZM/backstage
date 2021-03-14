const express = require('express');
const categoriesRouter = express.Router();
const categoriesCollection = require('../../mongodb/model/categories');
const counter = require('../../mongodb/model/counters');
const cateParamsCollection = require('../../mongodb/model/cateParams');

//获取商品分类
categoriesRouter.get('/api/categories', async (req, res) => {
  req.query ? req.query : {};
  //查找商品分类所有参数
  let cateList = await categoriesCollection.find({});
  let { type, pagenum, pagesize } = req.query;
  //对type进行判断
  //1为获取一级分类
  //2为获取一二级分类
  //其余获取所有分类
  if (+type === 1) {
    cateList.forEach(item => item.children = undefined);
  } else if (+type === 2) {
    cateList.forEach(item => {
      item.children.forEach(item2 => item2.children = undefined);
    });
  }
  for (let i = 0; i < cateList.length; i++) {
    if (cateList[i].children.length === 0) {
      cateList[i].children = undefined
    }
  }
  //所有数据
  const total = cateList.length;
  let start = +pagenum * +pagesize - +pagesize;
  let result = [];
  //如果有当前页数则返回所求的数据，如果没有则返回所有数据
  if (pagenum && pagesize) {
    for (let i = start; i < start + (+pagesize); i++) {
      if (cateList[i]) {
        result.push(cateList[i]);
      }
    }
  } else {
    result = cateList.slice();
  }
  const data = {
    pagenum,
    pagesize,
    result,
    total
  }
  if (result.length === 0) {
    res.send({ meta: { msg: '获取分类数据失败', status: 403 } })
  }
  res.send({ data, meta: { msg: '获取分类数据成功', status: 201 } })
});
//添加商品分类
categoriesRouter.post('/api/categories', async (req, res) => {
  let addCategoriesForm = req.body;
  addCategoriesForm.cat_id = await counter.addId();
  let add = {};
  if (addCategoriesForm.cat_level === 0) {
    add = await categoriesCollection.create(addCategoriesForm);
  } else if (addCategoriesForm.cat_level === 1) {
    let parentCate = await categoriesCollection.findOne({ cat_id: addCategoriesForm.cat_pid });
    parentCate.children.push(addCategoriesForm);
    add = await categoriesCollection.updateOne({ cat_id: addCategoriesForm.cat_pid }, parentCate);
  } else {
    let cateList = await categoriesCollection.find({});
    let parentCate = {};
    cateList.forEach(item => {
      item.children.forEach(item2 => {
        if (item2.cat_id === addCategoriesForm.cat_pid) {
          parentCate = item;
        }
      })
    })
    parentCate.children.forEach(item => {
      if (item.cat_id === addCategoriesForm.cat_pid) {
        if (!item.children) {
          item.children = [];
        }
        item.children.push(addCategoriesForm);
      }
    });
    add = await categoriesCollection.updateOne({ cat_id: parentCate.cat_id }, parentCate);
  }
  if (!add) {
    res.send({ meta: { msg: '添加分类数据失败', status: 403 } })
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
  if (level === 0) {
    edit = await categoriesCollection.updateOne({ cat_id: id }, cate);
  } else if (level === 1) {
    let parentCate = await categoriesCollection.findOne({ cat_id: pid })
    parentCate.children.forEach(item => {
      if (item.cat_id === id) {
        item.cat_name = cate.cat_name;
      }
    })
    console.log(parentCate)
    edit = await categoriesCollection.updateOne({ cat_id: pid }, parentCate);
  } else {
    const cateList = await categoriesCollection.find({});
    let result = {};
    cateList.forEach(item => {
      item.children.forEach(item2 => {
        if (item2.children) {
          item2.children.forEach(item3 => {
            if (item3.cat_id === id) {
              item3.cat_name = cate.cat_name;
              result = item;
            }
          })
        }
      })
    })
    edit = await categoriesCollection.updateOne({ cat_id: result.cat_id }, result);
  }

  if (!edit) {
    res.send({ meta: { msg: '编辑分类数据失败', status: 403 } })
  }
  res.send({ edit, meta: { msg: '编辑分类数据成功', status: 201 } })
})
//删除商品分类
categoriesRouter.delete('/api/categories/:id/level/:level/pid/:pid', async (req, res) => {
  const level = +req.params.level;
  const id = +req.params.id;
  const pid = +req.params.pid;
  if (!level && !id && !pid) {
    return res.send({ meta: { msg: '删除分类数据失败', status: 403 } });
  }
  let delCate = {};
  if (level === 0) {
    delCate = await categoriesCollection.deleteOne({ cat_id: id });
  } else if (level === 1) {
    let parentCate = await categoriesCollection.findOne({ cat_id: pid })
    parentCate.children.forEach((item, index) => {
      if (item.cat_id === id) {
        parentCate.children.splice(index, 1);
      }
    })
    // console.log(parentCate)
    delCate = await categoriesCollection.updateOne({ cat_id: pid }, parentCate);
  } else {
    const cateList = await categoriesCollection.find({});
    let result = {};
    cateList.forEach(item => {
      item.children.forEach(item2 => {
        if (item2.children) {
          item2.children.forEach((item3, index) => {
            if (item3.cat_id === id) {
              item2.children.splice(index, 1);
              result = item;
            }
          })
        }
      })
    })
    // console.log(result)
    delCate = await categoriesCollection.updateOne({ cat_id: result.cat_id }, result);
  }

  if (!delCate) {
    res.send({ meta: { msg: '删除分类数据失败', status: 403 } })
  }
  res.send({ delCate, meta: { msg: '删除分类数据成功', status: 201 } })
})
//获取商品分类参数
categoriesRouter.get('/api/categories/:id/attributes', async (req, res) => {
  const id = req.params.id;
  const sel = req.query.sel;
  const data = await cateParamsCollection.find({ cat_id: id, attr_sel: sel });
  if (!data) {
    return res.send({ meta: { status: 403, msg: '获取参数数据失败' } });
  }
  res.send({ data, meta: { status: 201, msg: '获取参数数据成功' } })

})
//获取单个商品分类参数
categoriesRouter.get('/api/categories/:id/attributes/:attrId', async (req, res) => {
  const id = req.params.id;
  const attrId = req.params.attrId;
  const sel = req.query.attr_sel;
  const data = await cateParamsCollection.findOne({ cat_id: id, attr_id: attrId, attr_sel: sel });
  if (!data) {
    return res.send({ meta: { status: 403, msg: '获取参数数据失败' } });
  }
  res.send({ data, meta: { status: 201, msg: '获取参数数据成功' } })
})
//添加商品分类参数
categoriesRouter.post('/api/categories/:id/attributes', async (req, res) => {
  const id = req.params.id;
  let data = req.body;
  data.attr_id = await counter.addId();
  data.cat_id = +id;
  if (data.attr_sel === 'many') {
    data.attr_write = 'list';
  } else {
    data.attr_write = 'manual';
  }
  const paramsSave = await cateParamsCollection.create(data);
  if (!paramsSave) {
    return res.send({ meta: { status: 403, msg: '添加参数数据失败' } });
  }
  res.send({ paramsSave, meta: { status: 201, msg: ' 添加参数数据成功' } })
})
//编辑商品分类参数
categoriesRouter.put('/api/categories/:id/attributes/:attrId', async (req, res) => {
  const id = +req.params.id;
  const attrId = +req.params.attrId;
  const data = req.body;
  data.cat_id = id;
  data.attr_id = attrId;
  const paramsEdit = await cateParamsCollection.updateOne({ cat_id: id, attr_id: attrId, attr_sel: data.attr_sel }, data);
  if (paramsEdit.nModified === 0) {
    return res.send({ meta: { status: 403, msg: '编辑参数数据失败' } });
  }
  res.send({ meta: { status: 201, msg: '编辑参数数据成功' } })
})
//删除商品分类参数
categoriesRouter.delete('/api/categories/:id/attributes/:attrId', async (req, res) => {
  const id = req.params.id;
  const attrId = req.params.attrId;
  const ParamsDelete = await cateParamsCollection.deleteOne({ cat_id: id, attr_id: attrId });
  if (ParamsDelete.deletedCount === 0) {
    return res.send({ meta: { status: 403, msg: '删除参数数据失败' } });
  }
  res.send({ meta: { status: 201, msg: '删除参数数据成功' } });
})

module.exports = categoriesRouter;