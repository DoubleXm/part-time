const jwt = require("koa-jwt");
const { secret } = require("../config");
const auth = jwt({ secret });

module.exports = {
  auth,
};
