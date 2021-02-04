const FeedBackService = require("../services/feedBack");
const JSONResolve = require("../lib/helper");
const { feedBackValidate } = require("../lib/validator");

class FeedBack {
  async createFeedBack(ctx) {
    ctx.verifyParams({
      feed_image: feedBackValidate.image,
      feedback: feedBackValidate.feedback,
    });
    const v = await FeedBackService.createFeedBack(ctx);
    ctx.body = JSONResolve.json(v);
  }
  // 反馈列表
  async getAdminFeedBack(ctx) {
    const v = await FeedBackService.getAdminFeedBack(ctx);
    ctx.body = JSONResolve.json(v);
  }
  async delAdminFeedBack(ctx) {
    await FeedBackService.delAdminFeedBack(ctx);
    ctx.body = JSONResolve.success();
  }
}

module.exports = new FeedBack();
