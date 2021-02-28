const express = require('express');
const rolesCollection = require('../../mongodb/model/roles');
const rightsCollection = require('../../mongodb/model/rights/rightsTree');
const rolesRouter = express.Router();

//获取角色列表
rolesRouter.get('/api/roles', async (req, res) => {
  const rolesList = await rolesCollection.find({});
  if(rolesList.length === 0) {
    res.send({meta: {status: 201, msg: '用户列表为空'}});
  }else {
    res.send({data: rolesList, meta: {status: 201, msg: '获取用户列表成功'}});
  }
})
//添加角色
rolesRouter.post('/api/roles', async (req, res) => {
  const role = req.body;
  const addrole = await rolesCollection.create(role);
  if(!addrole) {
    return res.send({data: addrole, meta: {status: 401, msg: '添加角色失败'}});
  }
  res.send({meta: {status: 201, msg: '添加角色成功'}});
})
//删除角色
rolesRouter.delete('/api/roles/:id', async (req, res) => {
  const roleId = req.params.id;
  const deleteRole = await rolesCollection.findByIdAndDelete(roleId);
  if(!deleteRole) {
    return res.send({data: deleteRole, meta: {status: 401, msg: '删除角色失败'}});
  }
  res.send({meta: {status: 201, msg: '删除角色成功'}})
})
//编辑角色
rolesRouter.put('/api/roles/:id', async (req, res) => {
  const role = req.body ? req.body : {};
  const id = req.params.id;
  const editRole = await rolesCollection.findByIdAndUpdate(id, role);
  if(editRole) {
    res.send({meta: {msg: '修改角色成功', status: 201}});
  }else {
    res.send({data: editUser, meta: {msg: '修改角色失败', status: 401}});
  }
})
//获取编辑用户数据
rolesRouter.get('/api/roles/:id', async (req, res) => {
  const id = req.params.id;
  const editRole = await rolesCollection.findById(id);
  if(!editRole) {
    return res.send({data: editRole, meta: {status: 401, msg: '获取编辑角色数据失败'}});
  }
  res.send({data: editRole, meta: {status: 201, msg: '获取编辑角色数据成功'}});
})
//删除角色权限
rolesRouter.delete('/api/roles/:rolesId/rights/:rightId', async (req, res) => {
  const right = await rolesCollection.findById(req.params.rolesId);
  const rightId = +req.params.rightId;
  right.children.forEach((ele, index) => {
    if(ele.id === rightId) {
      return right.children.splice(index, 1);
    }
    ele.children.forEach((ele2, index2) => {
      if(ele2.id === rightId) {
        return right.children[index].children.splice(index2, 1);
      }
      ele2.children.forEach((ele3, index3) => {
        if(ele3.id === rightId) {
          return right.children[index].children[index2].children.splice(index3, 1);
        }
      })
    })
  });
  const update = await rolesCollection.findByIdAndUpdate(req.params.rolesId, right);
  if(update) {
    return res.send({data: right, meta: {status: 201, msg: '删除权限成功'}})
  }
  res.send({meta: {status: 201, msg: '删除权限失败'}})
})
//分配权限
rolesRouter.post('/api/roles/:roleId/rights', async (req, res) => {
  const roleId = req.params.roleId;
  const allId = req.body.rid.split(',').map(item => parseInt(item));
  //获取所有的权限tree型
  let rolesList = await rightsCollection.find({});
  //将权限数据按照传过来的数据进行更改
  let result = [];
  result = getdata(rolesList, allId);
  //获取当前修改的角色
  let role = await rolesCollection.findById(roleId);
  //将当前的角色的权限进行修改
  role.children = result;
  let updataRole = await rolesCollection.findByIdAndUpdate(roleId, role);
  res.send({data: updataRole, meta: {status: 201, msg: '修改权限成功'}});
})







//树形数组按id删除
function getdata(arr, allId) {
  let data = [];
  let allId2 = allId.slice();
  allId.forEach((id, index) => {
    arr.forEach(item => {
      if(item.id === id) {
        allId2.splice(index, 1);
        if(item.children) {
          item.children = getdata(item.children, allId2);
        }
        data.push(item);
      }
    });
  })
  arr = data.slice();
  return arr
}
  

module.exports = rolesRouter;