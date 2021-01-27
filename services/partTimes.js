const Prictice = require("../models/prictices");
const { Op } = require("sequelize");

class PricticeService {
  async getPrictice(ctx) {
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
      category,
      salary,
      begin_time,
      end_time,
    } = ctx.query;
    // 给定初始值
    !limit ? (limit = 10) : (limit = parseInt(limit));
    !offset ? (offset = 1) : (offset = parseInt(offset));
    !sort ? (sort = "created_at") : sort;
    !order ? (order = "DESC") : order;
    // where 对象构建
    let sql;
    const whereCondition = {};
    if (begin_time || end_time || salary || category) {
      if (category && category.trim()) {
        whereCondition[Op.or] = [{ category }];
      }
      if (salary && salary.trim()) {
        const res = salary.split(",");
        whereCondition.salary = { [Op.between]: res.map((v) => Number(v)) };
      }
      if (begin_time && end_time) {
        whereCondition.begin_time = { [Op.gte]: new Date(Number(begin_time)) };
        whereCondition.end_time = { [Op.lte]: new Date(Number(end_time)) };
      }
      // console.log({ ...whereCondition })
      sql = {
        where: { ...whereCondition },
        limit,
        offset: (offset - 1) * limit,
        order: [[sort, order]],
      };
    } else {
      sql = { limit, offset: (offset - 1) * limit, order: [[sort, order]] };
    }

    const total = await Prictice.count();
    const data = await Prictice.findAll(sql);
    return {
      total,
      isNext:
        data.length > limit * (offset - 1 === 0 ? 1 : offset - 1)
          ? true
          : false,
      rows: [...data],
    };
  }
}

module.exports = new PricticeService();
