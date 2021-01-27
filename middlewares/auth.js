const jwt = require('koa-jwt')
const { secret } = require('../config')

module.exports = {
  // 鉴权   
  async auth() {  
    return jwt({ secret })
  }
}