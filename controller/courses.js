const CourseService = require("../services/courses");
const JSONResolve = require("../lib/helper");
const { courseValidate: validator } = require("../lib/validator");

class UserCtrl {
  async getCuorse(ctx) {
    const v = await CourseService.getCuorse(ctx);
    ctx.body = JSONResolve.json(v);
  }
  async getCuorseById(ctx) {
    const v = await CourseService.getCuorseById(ctx);
    ctx.body = JSONResolve.json(v);
  }
  // admin
  async getAdminCuorse(ctx) {
    const v = await CourseService.getAdminCuorse(ctx);
    ctx.body = JSONResolve.json(v);
  }
  async setAdminCuorse(ctx) {
    ctx.verifyParams({
      title: validator.title,
      content: validator.content
    })
    const v = await CourseService.setAdminCuorse(ctx);
    ctx.body = JSONResolve.json(v);
  }
  async delAdminCuorse(ctx) {
    await CourseService.delAdminCuorse(ctx);
    ctx.body = JSONResolve.success();
  }
  async addAdminCuorse(ctx) {
    ctx.verifyParams({
      title: validator.title,
      content: validator.content
    })
    const v = await CourseService.addAdminCuorse(ctx);
    ctx.body = JSONResolve.json(v);
  }
}

module.exports = new UserCtrl();
