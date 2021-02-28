const express = require('express');
const userCollection = require('../../mongodb/model/user');
const userRouter = express.Router();
const bcrypt = require('bcryptjs');
//查询用户数据
userRouter.get('/api/users', async (req, res) => {
  //获取传过来的参数
  if (req.query) {
    const { query, pagenum, pagesize } = req.query;
    //处理搜索数据
    let username = {};
    query === '' ? username : username = { username: query };
    const usersList = await userCollection.find(username, { password: 0 });
    //搜索结果的总数量
    const totalpage = usersList.length;
    const users = [];
    const count = +pagenum * +pagesize - +pagesize;
    for (let i = count; i < count + (+pagesize); i++) {
      if (usersList[i]) {
        users.push(usersList[i]);
      }
    }
    if (users.length === 0) {
      return res.send({ meta: { msg: '获取用户数据失败', status: 403 } })
    }
    return res.send({ data: { pagenum, totalpage, users }, meta: { msg: '获取用户数据成功', status: 200 } });
  }
  res.send({ meta: { msg: '获取用户数据失败', status: 403 } })
});
//添加用户数据
userRouter.post('/api/users', async (req, res) => {
  let user = req.body;
  user.password = bcrypt.hashSync(user.password, bcrypt.genSaltSync(10));
  let addUser = await userCollection.create(user);
  if (addUser) {
    addUser.password = '...';
    res.send({ addUser, meta: { status: 201, msg: '添加用户成功' } });
  } else {
    res.send({ meta: { msg: '添加用户失败', status: 400 } });
  }
})
//删除用户数据
userRouter.delete('/api/users/:id', async (req, res) => {
  const deleteUser = await userCollection.findByIdAndDelete(req.params.id, {password: 0});
  if (deleteUser) {
    res.send({ deleteUser, meta: { msg: '删除用户成功', status: 201 } });
  } else {
    res.send({ meta: { msg: '删除用户失败', status: 401 } });
  }

})
//获取修改用户数据
userRouter.get('/api/users/:id', async (req, res) => {
  const editUser = await userCollection.findById(req.params.id, {password: 0});
  if(editUser) {
    return res.send({editUser, meta: {msg: '获取修改用户数据成功', status: 201}})
  }
  return res.send({meta: {msg: '获取修改用户数据失败', status: 401}})
})
//修改用户数据
userRouter.put('/api/users/:id', async (req, res) => {
  const editUser = await userCollection.findByIdAndUpdate(req.params.id, req.body, {password: 0});
  if(editUser) {
    res.send({editUser, meta: {msg: '修改用户成功', status: 201}});
  }else {
    res.send({meta: {msg: '修改用户失败', status: 401}});
  }
})
userRouter.put('/api/users/:id/roles', async (req, res) => {
  const id = req.params.id;
  const selectRoleId = req.body.rid;
  const user = await userCollection.findById(id);
  user.roleName = selectRoleId;
  const isSuccess = await userCollection.findByIdAndUpdate(id, user, {password: 0});
  if(isSuccess) {
    res.send({isSuccess, meta: {msg: '修改用户成功', status: 201}});
  }else {
    res.send({meta: {msg: '修改用户失败', status: 401}});
  }
})
module.exports = userRouter;