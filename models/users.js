const sequelize = require("../lib/db");
const { DataTypes, Model } = require("sequelize");
const moment = require("moment");
const crypto = require("crypto");

// 用户模型
class User extends Model {}

User.init(
  {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV1,
      primaryKey: true,
    },
    phone_number: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    password: {
      type: DataTypes.STRING,
      allowNull: false,
      set(val) {
        const hash = crypto.createHash("md5");
        hash.update(val); // 接受数据
        const pwd = hash.digest("hex"); // 输出的格式为 16 进制
        this.setDataValue("password", pwd);
      },
    },
    nick_name: {
      type: DataTypes.STRING,
    },
    avatar: DataTypes.STRING,
    description: DataTypes.STRING,
    real_name: {
      type: DataTypes.STRING,
      comment: "用户真实姓名",
    },
    age: {
      type: DataTypes.STRING,
    },
    gender: {
      type: DataTypes.ENUM,
      values: ["0", "1", "2"],
      comment: "0: 未知, 1: 男, 2: 女",
    },
    height: {
      type: DataTypes.STRING,
    },
    school: {
      type: DataTypes.STRING,
    },
    experience: {
      type: DataTypes.TEXT,
      comment: "个人经历",
    },
    autograph: {
      type: DataTypes.STRING,
      comment: "签名",
    },
    created_at: {
      type: DataTypes.DATE,
      allowNull: false,
      get() {
        return moment(this.getDataValue("created_at")).format("YYYY-MM-DD");
      },
    },
  },
  {
    sequelize,
    modelName: "user",
    tableName: "users",
  }
);

module.exports = User;
