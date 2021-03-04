const express = require('express');
const app = express();
//tools
const jwtToken = require('./ras/jwt');
//api
const login = require('./Api/login/login');
const menu = require('./Api/home/menu');
const userList = require('./Api/home/user');
const rights = require('./Api/power/rights');
const roles = require('./Api/power/roles');
const categories = require('./Api/categories/categories');
//跨域
app.use(require('cors')());
app.use(express.json());
// 验证token
app.use((req, res, next) => {
  if(req.url !== '/api/login'){
    let token = req.headers.authorization || {};
    let result = jwtToken.verifyToken(token);
    if(result === 'err') {
      res.send({meta: {status: 403, msg: '登录已过期，请重新登录'}});
    }else{
      return next();
    }
  }
  next();
})
//使用路由
app.use(login);
app.use(menu);
app.use(userList);
app.use(rights);
app.use(roles);
app.use(categories);

app.listen(3000, () => console.log("Server start"));
