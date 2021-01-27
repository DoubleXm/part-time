const CourseService = require("../services/courses");
const JSONResolve = require("../lib/helper");

class UserCtrl {
  async getCuorse(ctx) {
    const v = await CourseService.getCuorse(ctx);
    ctx.body = JSONResolve.json(v);
  }
  async getCuorseById(ctx) {
    const v = await CourseService.getCuorseById(ctx);
    ctx.body = JSONResolve.json(v);
  }
}

module.exports = new UserCtrl();
