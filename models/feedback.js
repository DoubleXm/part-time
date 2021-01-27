const { DataTypes, Model } = require("sequelize");
const sequelize = require("../lib/db");
const User = require("./users");

class FeedBack extends Model {}

FeedBack.init(
  {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true,
    },
    feed_image: DataTypes.STRING,
    feedback: {
      type: DataTypes.STRING,
      allowNull: false,
      comment: "反馈内容",
    },
  },
  {
    sequelize,
    modelName: "opinion",
    tableName: "opinions",
  }
);

User.hasMany(FeedBack, { foreignKey: "user_id", sourceKey: "id", as: "user" });
FeedBack.belongsTo(User, {
  foreignKey: "user_id",
  targetKey: "id",
  as: "opinion",
});

module.exports = FeedBack;
