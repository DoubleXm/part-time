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
      isNext: total > (offset - 1 === 0 ? 1 : offset - 1) ? true : false,
      rows: [...data],
    };
  }
  async getCuorseById(ctx) {
    const { id } = ctx.params;
    const data = await Course.findOne({ where: { id } });
    return { info: { ...data.toJSON() } };
  }

  // admin
  async getAdminCuorse(ctx) {
    /**
     * @param limit 每页条目数
     * @param offset 页码
     * @param sort 排序字段
     * @param order ASC | DESC
     */
    let {
      limit,
      offset,
      sort,
      order,
      id,
      title,
      content,
      begin_time,
      end_time,
    } = ctx.query;
    // 给定初始值
    !limit ? (limit = 10) : (limit = parseInt(limit));
    !offset ? (offset = 1) : (offset = parseInt(offset));
    !sort ? (sort = "created_at") : sort;
    !order ? (order = "DESC") : order;

    let sql;
    const whereCondition = {};
    if (id || title || content || begin_time || end_time) {
      if (begin_time && end_time) {
        whereCondition.begin_time = { [Op.gte]: new Date(Number(begin_time)) };
        whereCondition.end_time = { [Op.lte]: new Date(Number(end_time)) };
      }
      try {
        whereCondition[id] = { [Op.eq]: id };
        whereCondition[title] = { [Op.eq]: title };
        whereCondition[content] = { [Op.eq]: content };
      } catch (e) {
        ctx.throw(412, "参数错误");
      }
      sql = {
        where: { ...whereCondition },
        limit,
        offset: (offset - 1) * limit,
        sort,
        order: [[sort, order]],
        paranoid: false // 获取已经被删除的行
      };
    } else {
      sql = {
        limit,
        offset: (offset - 1) * limit,
        sort,
        order: [[sort, order]],
        paranoid: false // 获取已经被删除的行
      };
    }

    const total = await Course.count({ paranoid: false });
    const data = await Course.findAll(sql);
    return {
      total,
      isNext: total.length > (offset - 1 === 0 ? 1 : offset - 1) ? true : false,
      rows: [...data],
    };
  }
  async setAdminCuorse(ctx) {
    const { id, title, content } = ctx.request.body;
    await Course.update({ title, content }, { where: { id } });
    const data = await Course.findOne({ where: { id } });
    return { info: { ...data.toJSON() } };
  }
  async delAdminCuorse(ctx) {
    const ids = ctx.params.id.split(",");
    for (let i = 0; i < ids.length; i++) {
      await Course.destroy({ where: { id: ids[i] } });
    }
  }
  async addAdminCuorse(ctx) {
    const { title, content } = ctx.request.body;
    const data = await Course.create({ title, content });
    return { info: { ...data.toJSON() } };
  }
}

module.exports = new CourseService();
