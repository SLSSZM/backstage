const express = require('express');
const userCollection = require('../../mongodb/model/user');
const loginRouter = express.Router();
const bcrypt = require('bcryptjs');
const jwtToken = require('../../jwt');

loginRouter.post('/api/login', async (req, res) => {
  const {username, password} = req.body;
  const user = await userCollection.find({username});
  if(user.length === 0){
    res.send({data: {}, meta:{msg: '账号错误或不存在', status: 400}});
  }else{
    bcrypt.compare(password, user[0].password, (err, isOk) => {
      if(err){
        res.send(err);
      }else{
        if(isOk){
          let token = jwtToken.generateToken({username});
          res.send({data: {username, token}, meta:{msg: '登录成功', status: 200}});
        }else{
          res.send({data: user[0].username, meta:{msg: '密码错误', status: 400}});
        }
      }
    })
  }
})


module.exports = loginRouter;