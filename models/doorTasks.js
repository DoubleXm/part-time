const sequelize = require('../lib/db');
const { DataTypes, Model } = require('sequelize');
const User = require('./users');

class DoorTask extends Model {}

DoorTask.init(
  {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV1,
      primaryKey: true
    },
    title: DataTypes.STRING,
    task_detail: DataTypes.TEXT,
    task_catetory: {
      type: DataTypes.INTEGER,
      comment: '任务分类: 1: 调查; 2: 关注 3: 分享; 4: 下载; 5: 其他'
    },
    price: {
      type: DataTypes.INTEGER,
      comment: '任务金额'
    },
    surplus: {
      type: DataTypes.INTEGER,
      comment: '任务剩余量'
    },
    hot: {
      type: DataTypes.INTEGER,
      defaultValue: 0,
      comment: '任务热度'
    }
  },
  {
    sequelize,
    tableName: 'door_tasks',
    modelName: 'door_tasks'
  }
);

// 关联表模型
class UserDoorTask extends Model {}

UserDoorTask.init(
  {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV1,
      primaryKey: true
    },
    content: DataTypes.STRING,
    images: DataTypes.STRING,
    status: {
      type: DataTypes.INTEGER,
      defaultValue: 2,
      comment: '任务状态: 1: 审核通过; 2: 待审核; 3: 审核失败'
    }
  },
  {
    sequelize,
    tableName: 'user_doortask',
    modelName: 'user_doortask'
  }
);

User.belongsToMany(DoorTask, {
  through: { model: UserDoorTask, unique: false },
  foreignKey: 'user_id',
  constraints: false
});
DoorTask.belongsToMany(User, {
  through: { model: UserDoorTask, unique: false },
  foreignKey: 'door_id',
  constraints: false
});

module.exports = {
  DoorTask,
  UserDoorTask
};
