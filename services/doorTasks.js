const DoorTask = require("../models/doorTasks");
const User = require("../models/users");
const jsonwebtoken = require("jsonwebtoken");
const { secret } = require("../config");

class DoorTaskService {
  static async getUserId(ctx) {
    const { authorization } = ctx.header;
    const token = authorization.split(" ")[1];
    const { phone_number } = jsonwebtoken.verify(token, secret);
    const user = User.findOne({ where: { phone_number } });
    return (await user).toJSON().id;
  }

  async createAdminTask(ctx) {
    const {
      title,
      task_detail,
      price,
      surplus,
      task_catetory,
    } = ctx.request.body;
    const data = await DoorTask.create({
      title,
      task_detail,
      price,
      surplus,
      task_catetory,
    });
    return { info: { ...data.toJSON() } };
  }

  async getTask(ctx) {
    /**
     * @param limit 每页条目数
     * @param offset 页码
     * @param sort 排序字段
     * @param order ASC | DESC
     */
    let { limit, offset, sort, order, classify } = ctx.query;
    // 给定初始值
    !limit ? (limit = 10) : (limit = parseInt(limit));
    !offset ? (offset = 1) : (offset = parseInt(offset));
    !sort ? (sort = "created_at") : sort;
    !order ? (order = "DESC") : order;

    const total = await DoorTask.count();
    let sql;
    if (classify) {
      sql = {
        where: { task_catetory: classify },
        limit,
        offset: (offset - 1) * limit,
        order: [[sort, order]],
      };
    } else {
      sql = { limit, offset: (offset - 1) * limit, order: [[sort, order]] };
    }
    const data = await DoorTask.findAll(sql);
    return {
      total,
      isNext:
        data.length > limit * (offset - 1 === 0 ? 1 : offset - 1)
          ? true
          : false,
      rows: [...data],
    };
  }

  async getTaskById(ctx) {
    const { id } = ctx.params;
    const data = await DoorTask.findOne({ where: { id } });
    return { info: { ...data.toJSON() } };
  }

  async submitTask(ctx) {
    const userId = await DoorTaskService.getUserId(ctx);
    const { task_id: taskId, content, images } = ctx.request.body;
    // 查询出数据, 填充进关联表
    const task = await DoorTask.findOne({ where: { id: taskId } });
    const user = await User.findOne({ where: { id: userId } });
    // 如果想要添加除了关联之外的数据可以使用 { through: { content, images }
    let data = await task.addUsers(user, { through: { content, images } });
    if (!data) {
      ctx.throw(412, "不允许对一个任务重复提交");
    }
    // 任务提交后, 给DoorTask 对应的任务增加热度
    await DoorTask.update(
      { hot: ++task.toJSON().hot },
      { where: { id: taskId } }
    );
    data = data[Object.keys(data)[0]].dataValues;
    return { info: { ...data } };
  }
}

module.exports = new DoorTaskService();
