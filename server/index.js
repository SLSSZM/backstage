const express = require('express');
const login = require('./router/login');
const app = express();
const jwtToken = require('./jwt');
//跨域
app.use(require('cors')());
app.use(express.json());
// 验证token
app.use((req, res, next) => {
  if(req.url !== '/api/login'){
    let token = req.token || {};
    let result = jwtToken.verifyToken(token);
    if(result === 'err') {
      console.log(result);
      res.send({meta: {status: 403, msg: '登录已过期，请重新登录'}});
    }else{
      next();
    }
  }
  next();
})
//使用login路由
app.use(login);

app.listen(3000, () => console.log("Server start"));
