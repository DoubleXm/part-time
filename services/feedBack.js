const FeedBack = require("../models/feedback");
const User = require("../models/users");
const jsonwebtoken = require("jsonwebtoken");
const { secret } = require("../config");

class FeedBackService {
  static async getUserId(ctx) {
    const authorization = ctx.header.authorization.split(" ")[1];
    // 解密 token 然后根据手机号查询用户信息
    const { phone_number } = jsonwebtoken.verify(authorization, secret);
    const userInfo = await (
      await User.findOne({ where: { phone_number } })
    ).toJSON();
    return userInfo.id;
  }

  async createFeedBack(ctx) {
    const { feed_image, feedback } = ctx.request.body;
    const userId = await FeedBackService.getUserId(ctx);
    const data = await FeedBack.create({
      feed_image,
      feedback,
      user_id: userId,
    });
    return { info: { ...data.toJSON() } };
  }
}

module.exports = new FeedBackService();
