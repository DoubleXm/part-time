const PricticeService = require("../services/prictices");
const JSONResolve = require("../lib/helper");
// const { pricitceValidate: validate } = require('../lib/validator')

class PricticeCtrl {
  // 获取兼职列表
  async getPrictice(ctx) {
    const v = await PricticeService.getPrictice(ctx);
    ctx.body = JSONResolve.json(v);
  }
}

module.exports = new PricticeCtrl();
