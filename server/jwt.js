const jwt = require('jsonwebtoken')
const fs = require('fs')
const path = require('path')

const jwtToken = {
  //生成token
  generateToken(data) {
    let cert = fs.readFileSync(path.join(__dirname, './ras/private_key.pem'));
    let createdTime = Math.floor(Date.now() / 1000);
    let exp = createdTime + 60*60*24;
    let token = jwt.sign({data, exp}, cert, {algorithm: 'RS256'});
    return token;
  },

  //验证token
  verifyToken(token) {
    let cert = fs.readFileSync(path.join(__dirname, './ras/public_key.pem')) || {};
    let res;
    try{
      let result = jwt.verify(token, cert) || {};
      let {exp = 0} = result, currentTime = Math.floor(Date.now() / 1000);
      if(currentTime > exp) {
        res = result.data || {};
      }
    }catch(err) {
      res = 'err'
    }
    return res;
  }
}

module.exports = jwtToken;