const { DataTypes, Model } = require("sequelize");
const sequelize = require("../lib/db");

class Friend extends Model {}

// 好友關係表
Friend.init(
  {
    id: {
      type: DataTypes.UUID,
      primaryKey: true,
      defaultValue: DataTypes.UUIDV1,
    },
    user_id: {
      type: DataTypes.STRING,
    },
    friend_id: {
      type: DataTypes.STRING,
    },
  },
  {
    modelName: "friend",
    tableName: "friend",
    sequelize,
  }
);

module.exports = Friend;
