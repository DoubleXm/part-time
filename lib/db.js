const { Sequelize } = require("sequelize");
const { db } = require("../config");

const sequelize = new Sequelize({
  dialect: "mysql",
  host: db.host,
  port: db.port,
  database: db.database,
  username: db.username,
  password: db.password,
  define: {
    freezeTableName: true,
    paranoid: true, // 采取软删除措施, 如果查询的时候想要查询所有的内容 可以在语句后面加 { paranoid: false }
    timestamps: true,
    underscored: true, // 驼峰命名转换为下划线
    createdAt: "created_at",
    updatedAt: "update_at",
    deletedAt: "deleted_at",
  },
});

// 创建模型
sequelize.sync({ alter: true });

module.exports = sequelize;
