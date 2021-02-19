const Prictice = require('../models/prictices');
const { Op } = require('sequelize');
const cityList = require('../config/addr.json');

class PricticeService {
  pricticeClassify() {
    return {
      rows: [
        '软件',
        '客服',
        '行政',
        '运营',
        '翻译',
        '销售',
        '人力',
        '导购',
        '传单',
        '礼仪',
        '仓管',
        '物流',
        '模特',
        '音乐',
        '咨询',
        '美术',
        '设计',
        '培训',
        '教育',
        '法律',
        '助理',
        '其他'
      ]
    };
  }
  // 获取兼职地址分类列表
  async parttimeClassify(ctx) {
    const { city_name } = ctx.query;

    if (!city_name) ctx.throw(412, '请输入城市名');
    for (let province = 0; province < cityList.length; province++) {
      const citys = cityList[province].mallCityList;
      for (let city = 0; city < citys.length; city++) {
        if (citys[city].cityName === city_name) {
          return { rows: citys[city].mallAreaList };
        }
      }
    }
  }
  async getPrictice(ctx) {
    /**
     * @param limit 每页条目数
     * @param offset 页码
     * @param sort 排序字段
     * @param order ASC | DESC
     * @param category 实习 根据 分类 查询
     * @param salary 实习 根据 工资查询
     * @param begin_time 实习 开始时间筛选
     * @param end_time 实习 结束时间筛选
     * @param area_name 兼职 区 筛选
     */
    let { limit, offset, sort, order, category, salary, begin_time, end_time, area_name, admin, post } = ctx.query;
    // 给定初始值
    !limit ? (limit = 10) : (limit = parseInt(limit));
    !offset ? (offset = 1) : (offset = parseInt(offset));
    !sort ? (sort = 'created_at') : sort;
    !order ? (order = 'DESC') : order;
    !post ? (post = '') : post;
    // where 对象构建
    let sql;
    const whereCondition = {};
    if (begin_time || end_time || salary || category || area_name) {
      if (category && category.trim()) {
        whereCondition[Op.or] = [{ category }];
      }
      if (salary && salary.trim()) {
        const res = salary.split(',');
        whereCondition.salary = { [Op.between]: res.map(v => Number(v)) };
      }
      if (begin_time && end_time) {
        whereCondition.begin_time = { [Op.gte]: new Date(Number(begin_time)) };
        whereCondition.end_time = { [Op.lte]: new Date(Number(end_time)) };
      }
      if (area_name && area_name.trim()) {
        whereCondition[Op.or] = [{ area_name }];
      }
      // console.log({ ...whereCondition })
      sql = {
        where: { ...whereCondition, post: { [Op.substring]: post } },
        limit,
        offset: (offset - 1) * limit,
        order: [[sort, order]]
      };
    } else {
      sql = { where: { post: { [Op.substring]: post } }, limit, offset: (offset - 1) * limit, order: [[sort, order]] };
    }
    // 如果传入了admin字段就代表是admin调用这个接口
    let total;
    if (admin) {
      total = await Prictice.count({ paranoid: false });
      sql.paranoid = false;
    } else {
      total = await Prictice.count();
    }
    const data = await Prictice.findAll(sql);
    return {
      total,
      isNext: total > limit * (offset - 1 === 0 ? 1 : offset - 1) ? true : false,
      rows: [...data]
    };
  }

  // admin
  async addAdminPrictice(ctx) {
    const {
      category,
      salary,
      begin_time,
      end_time,
      shop_img,
      shop_name,
      post,
      company_auth,
      cityName,
      areaName
    } = ctx.request.body;
    const data = await Prictice.create({
      category,
      salary,
      begin_time,
      end_time,
      shop_img,
      shop_name,
      post,
      company_auth,
      cityName,
      areaName
    });
    return { info: { ...data.toJSON() } };
  }
  async setAdminPrictice(ctx) {
    const {
      id,
      category,
      salary,
      begin_time,
      end_time,
      shop_img,
      shop_name,
      post,
      company_auth,
      cityName,
      areaName
    } = ctx.request.body;
    await Prictice.update(
      {
        category,
        salary,
        begin_time,
        end_time,
        shop_img,
        shop_name,
        post,
        company_auth,
        cityName,
        areaName
      },
      { where: { id } }
    );
    const data = await Prictice.findOne({ where: { id } });
    return { info: { ...data.toJSON() } };
  }
  async delAdminPrictice(ctx) {
    const ids = ctx.params.id.split(',');
    for (let i = 0; i < ids.length; i++) {
      await Prictice.destroy({ where: { id: ids[i] } });
    }
  }
}

module.exports = new PricticeService();
