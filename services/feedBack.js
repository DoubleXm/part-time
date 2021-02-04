const FeedBack = require("../models/feedback");
const User = require("../models/users");
const { Op } = require("sequelize");
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

  async getAdminFeedBack(ctx) {
    /**
     * @param limit 每页条目数
     * @param offset 页码
     * @param sort 排序字段
     * @param order ASC | DESC
     * @param begin_time  开始时间筛选
     * @param end_time  结束时间筛选
     */
    let {
      limit,
      offset,
      sort,
      order,
      begin_time,
      end_time,
      feedback,
      phone_number,
    } = ctx.query;
    // 给定初始值
    !limit ? (limit = 10) : (limit = parseInt(limit));
    !offset ? (offset = 1) : (offset = parseInt(offset));
    !sort ? (sort = "created_at") : sort;
    !order ? (order = "DESC") : order;
    // where 对象构建
    let sql;
    const whereCondition = {};
    if (begin_time || end_time || phone_number || feedback) {
      if (begin_time && end_time) {
        whereCondition.begin_time = { [Op.gte]: new Date(Number(begin_time)) };
        whereCondition.end_time = { [Op.lte]: new Date(Number(end_time)) };
      }
      if (phone_number) {
        try {
          const { id: user_id } = await (
            await User.findOne({ where: { phone_number } })
          ).toJSON();
          whereCondition.user_id = { [Op.eq]: user_id };
        } catch (e) {
          ctx.throw(412, "用户不存在");
        }
      }
      if (feedback) {
        whereCondition.feedback = { [Op.eq]: feedback };
      }
      // console.log({ ...whereCondition })
      sql = {
        where: { ...whereCondition },
        limit,
        offset: (offset - 1) * limit,
        order: [[sort, order]],
        paranoid: false // 获取已经被删除的行
      };
    } else {
      sql = {
        limit,
        offset: (offset - 1) * limit,
        sort,
        order: [[sort, order]],
        paranoid: false
      };
    }

    const total = await FeedBack.count();
    const data = await FeedBack.findAll({ ...sql });
    return {
      total,
      isNext:
        total > limit * (offset - 1 === 0 ? 1 : offset - 1) ? true : false,
      rows: [...data],
    };
  }
  async delAdminFeedBack(ctx) {
    const ids = ctx.params.id.split(",");
    for (let i = 0; i < ids.length; i++) {
      await FeedBack.destroy({ where: { id: ids[i] } });
    }
  }
}

module.exports = new FeedBackService();
