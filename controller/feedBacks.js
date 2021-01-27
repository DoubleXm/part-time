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
}

module.exports = new FeedBack();
