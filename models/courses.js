const sequelize = require("../lib/db");
const { DataTypes, Model } = require("sequelize");

class Course extends Model {}

Course.init(
  {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true,
    },
    image: DataTypes.STRING,
    title: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    content: {
      type: DataTypes.STRING,
      allowNull: false,
    },
  },
  {
    sequelize,
    tableName: "courses",
    modelName: "course",
  }
);

module.exports = Course;
