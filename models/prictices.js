const sequelize = require('../lib/db')
const { DataTypes, Model } = require('sequelize')

class Prictice extends Model { }

/**
 * 兼职模块(parttime), 实习模块(prictice) 共用一张表
 */
Prictice.init({
  id: {
    type: DataTypes.UUID,
    defaultValue: DataTypes.UUIDV1,
    primaryKey: true
  },
  category: {
    type: DataTypes.STRING,
    comment: '岗位分类'
  },
  salary: {
    type: DataTypes.STRING,
    comment: '薪资'
  },
  begin_time: {
    type: DataTypes.DATE(6),
    comment: '实习开始时间'
  },
  end_time: {
    type: DataTypes.DATE(6),
    comment: '实习结束时间'
  },
  shop_img: {
    type: DataTypes.STRING
  },
  shop_name: DataTypes.STRING,
  post: {
    type: DataTypes.STRING,
    comment: '岗位'
  },
  // 兼职模块需要的字段
  company_auth: {
    type: DataTypes.INTEGER,
    defaultValue: 0,
    comment: '企业认证 1: 认证; 0: 未认证'
  },
  address: DataTypes.STRING
}, {
  sequelize,
  modelName: 'prictice',
  tableName: 'prictice'
})

module.exports = Prictice