const User = require('../models/users');
const Friend = require('../models/friends');
const jsonwebtoken = require('jsonwebtoken');
const { Op } = require('sequelize');
const { secret } = require('../config');
const crypto = require('crypto');
class UserService {
  // 密码加密
  static secretPassword(pwd) {
    const hash = crypto.createHash('md5');
    hash.update(pwd);
    return hash.digest('hex');
  }

  async register(ctx) {
    const { nick_name, phone_number, password } = ctx.request.body;

    const hasUser = await User.findOne({ where: { phone_number } });
    if (hasUser) {
      ctx.throw(412, '用户已经存在');
    }
    const cryptoPwd = UserService.secretPassword(password);
    const data = await User.create({
      nick_name,
      phone_number,
      password: cryptoPwd
    });

    // 生成 token
    const token = jsonwebtoken.sign({ phone_number, password }, secret, {
      expiresIn: '1d'
    });
    return { info: { ...data.toJSON() }, token };
  }

  async login(ctx) {
    const { phone_number, password } = ctx.request.body;

    const hasUser = await User.findOne({ where: { phone_number } });
    if (!hasUser) {
      ctx.throw(412, '用户不存在');
    }
    // 由于存的时候又加密的一次， 取的时候也进行加密两次然后再对比
    const cryptoPwd = UserService.secretPassword(UserService.secretPassword(password));
    if (hasUser.password !== cryptoPwd) {
      ctx.throw(412, '用户密码错误');
    }
    // 生成 token
    const token = jsonwebtoken.sign({ phone_number, password }, secret, {
      expiresIn: '1d'
    });
    return { info: { ...hasUser.toJSON() }, token };
  }

  async editUser(ctx) {
    const {
      avatar,
      nick_name,
      real_name,
      autograph,
      age,
      gender,
      height,
      phone_number,
      school,
      experience
    } = ctx.request.body;
    const users = await User.findAll({ where: { phone_number } });
    if (users.length > 1) {
      ctx.throw(412, '手机号以被其他用户使用');
    }
    await User.update(
      {
        avatar,
        nick_name,
        real_name,
        autograph,
        age,
        gender,
        height,
        phone_number,
        school,
        experience
      },
      { where: { phone_number } }
    );
    const data = await User.findOne({ where: { phone_number } });
    return { info: { ...data.toJSON() } };
  }

  async getUser(ctx) {
    const authorization = ctx.header.authorization.split(' ')[1];
    // 解密 token 然后根据手机号查询用户信息
    const { phone_number } = jsonwebtoken.verify(authorization, secret);
    const data = await User.findOne({ where: { phone_number } });
    return { info: { ...data.toJSON() } };
  }

  async getUserById(ctx) {
    const authorization = ctx.header.authorization.split(' ')[1];
    // 解密 token 然后根据手机号查询用户信息
    const { phone_number } = jsonwebtoken.verify(authorization, secret);
    // 获取用户 id
    const user = await User.findOne({ where: { phone_number } });
    const { id: user_id } = (await user).toJSON();

    const { id: friend_id } = ctx.params;
    // 查询我们是不是好友
    // console.log(user_id, friend_id)
    const friend = await Friend.findOne({ where: { user_id, friend_id } });
    let isFriend;
    friend ? (isFriend = 1) : (isFriend = 0);
    return { info: { ...user.toJSON(), isFriend } };
  }

  async addFriend(ctx) {
    const authorization = ctx.header.authorization.split(' ')[1];
    // 解密 token 然后根据手机号查询用户信息
    const { phone_number } = jsonwebtoken.verify(authorization, secret);
    // 获取用户 id, 他人用户 id
    const user = await User.findOne({ where: { phone_number } });
    const { friend_id } = ctx.request.body;
    const { id: user_id } = (await user).toJSON();
    // 添加两条记录 代表这个两个人已经是好友状态了
    await Friend.create({ friend_id, user_id });
    await Friend.create({ user_id: friend_id, friend_id: user_id });
  }

  async delFriend(ctx) {
    const authorization = ctx.header.authorization.split(' ')[1];
    // 解密 token 然后根据手机号查询用户信息
    const { phone_number } = jsonwebtoken.verify(authorization, secret);
    // 获取用户 id, 他人用户 id
    const user = await User.findOne({ where: { phone_number } });
    const { id: friend_id } = ctx.params;
    const { id: user_id } = (await user).toJSON();
    //删除好友
    await Friend.destroy({ where: { friend_id, user_id } });
    await Friend.destroy({ where: { user_id: friend_id, friend_id: user_id } });
  }

  async getFriend(ctx) {
    const authorization = ctx.header.authorization.split(' ')[1];
    // 解密 token 然后根据手机号查询用户信息
    const { phone_number } = jsonwebtoken.verify(authorization, secret);
    // 获取用户 id,
    const { id } = await (await User.findOne({ where: { phone_number } })).toJSON();

    // 查询当前用户所有的好友id
    const friend_ids = JSON.parse(
      JSON.stringify(
        await Friend.findAll({
          attributes: ['friend_id'],
          where: { user_id: id }
        })
      )
    );
    /**
     * @param limit 每页条目数
     * @param offset 页码
     * @param sort 排序字段
     * @param order ASC | DESC
     * @param q 查询字段
     */
    let { limit, offset, sort, order, q } = ctx.query;
    // 给定初始值
    !limit ? (limit = 10) : (limit = parseInt(limit));
    !offset ? (offset = 1) : (offset = parseInt(offset));
    !sort ? (sort = 'created_at') : sort;
    !order ? (order = 'DESC') : order;
    const rows = [];
    // 由于没有做关联表 设计失败了; findOne一次只查询一个, 最后 push 之后无法再做分页逻辑
    for (let i = 0; i < friend_ids.length; i++) {
      let ret = JSON.parse(
        JSON.stringify(
          await User.findOne({
            where: { id: friend_ids[i].friend_id },
            limit,
            offset: (offset - 1) * limit,
            order: [[sort, order]]
          })
        )
      );
      ret.isFriend = 1;
      rows.push(ret);
    }
    const total = rows.length;
    return {
      total,
      isNext: total > limit * (offset - 1 === 0 ? 1 : offset - 1) ? true : false,
      rows
    };
  }

  // admin
  async getAdminUser(ctx) {
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
      phone_number,
      nick_name,
      description,
      gender,
      school
    } = ctx.query;
    // 给定初始值
    !limit ? (limit = 10) : (limit = parseInt(limit));
    !offset ? (offset = 1) : (offset = parseInt(offset));
    !sort ? (sort = 'created_at') : sort;
    !order ? (order = 'DESC') : order;
    // where 对象构建
    let sql;
    const whereCondition = {};
    if (begin_time || end_time || phone_number || nick_name || description || gender || school) {
      if (begin_time && end_time) {
        whereCondition.begin_time = { [Op.gte]: new Date(Number(begin_time)) };
        whereCondition.end_time = { [Op.lte]: new Date(Number(end_time)) };
      }
      if (phone_number) {
        whereCondition.phone_number = { [Op.eq]: phone_number };
      }
      if (nick_name) {
        whereCondition.nick_name = { [Op.eq]: nick_name };
      }
      if (description) {
        whereCondition.description = { [Op.like]: description };
      }
      if (gender) {
        whereCondition.gender = { [Op.eq]: gender };
      }
      if (school) {
        whereCondition.school = { [Op.eq]: school };
      }
      // console.log({ ...whereCondition })
      sql = {
        where: { ...whereCondition },
        limit,
        offset: (offset - 1) * limit,
        order: [[sort, order]],
        paranoid: false
      };
    } else {
      sql = {
        limit,
        offset: (offset - 1) * limit,
        order: [[sort, order]],
        paranoid: false
      };
    }

    const total = await User.count({ paranoid: false });
    const data = await User.findAll(sql);
    return {
      total,
      isNext: total > limit * (offset - 1 === 0 ? 1 : offset - 1) ? true : false,
      rows: [...data]
    };
  }
  async delAdminUser(ctx) {
    const ids = ctx.params.id.split(',');
    for (let i = 0; i < ids.length; i++) {
      await User.destroy({ where: { id: ids[i] } });
    }
  }
}

module.exports = new UserService();
