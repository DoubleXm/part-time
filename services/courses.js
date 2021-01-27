const Course = require("../models/courses");

class CourseService {
  async getCuorse(ctx) {
    /**
     * @param limit 每页条目数
     * @param offset 页码
     * @param sort 排序字段
     * @param order ASC | DESC
     */
    let { limit, offset, sort, order } = ctx.query;
    // 给定初始值
    !limit ? (limit = 10) : (limit = parseInt(limit));
    !offset ? (offset = 1) : (offset = parseInt(offset));
    !sort ? (sort = "created_at") : sort;
    !order ? (order = "DESC") : order;

    const total = await Course.count();
    const data = await Course.findAll({
      limit,
      offset: (offset - 1) * limit,
      order: [[sort, order]],
    });
    return {
      total,
      isNext: data.length > (offset - 1 === 0 ? 1 : offset - 1) ? true : false,
      rows: [...data],
    };
  }
  async getCuorseById(ctx) {
    const { id } = ctx.params;
    const data = await Course.findOne({ where: { id } });
    return { info: { ...data.toJSON() } };
  }
}

module.exports = new CourseService();
