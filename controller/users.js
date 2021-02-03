const UserService = require("../services/users");
const JSONResolve = require("../lib/helper");
const { userValidate } = require("../lib/validator");

class UserCtrl {
  async register(ctx) {
    ctx.verifyParams({
      nick_name: userValidate.nick_name,
      phone_number: userValidate.phone_number,
      password: userValidate.password,
    });

    const v = await UserService.register(ctx);
    ctx.body = JSONResolve.json(v);
  }

  async login(ctx) {
    ctx.verifyParams({
      phone_number: userValidate.phone_number,
      password: userValidate.password,
    });

    const v = await UserService.login(ctx);
    ctx.body = JSONResolve.json(v);
  }

  async editUser(ctx) {
    ctx.verifyParams({
      avatar: userValidate.avatar,
      nick_name: userValidate.nick_name,
      real_name: userValidate.real_name,
      autograph: userValidate.autograph,
      age: userValidate.age,
      gender: userValidate.gender,
      height: userValidate.height,
      phone_number: userValidate.phone_number,
      school: userValidate.school,
      experience: userValidate.experience,
    });

    const v = await UserService.editUser(ctx);
    ctx.body = JSONResolve.json(v);
  }

  async getUser(ctx) {
    const v = await UserService.getUser(ctx);
    ctx.body = JSONResolve.json(v);
  }

  async getUserById(ctx) {
    const v = await UserService.getUserById(ctx);
    ctx.body = JSONResolve.json(v);
  }
  // 添加好友
  async addFriend(ctx) {
    await UserService.addFriend(ctx)
    ctx.body = JSONResolve.success()
  }
  // 删除好友
  async delFriend(ctx) {
    await UserService.delFriend(ctx)
    ctx.body = JSONResolve.success()
  }
  // 获取好友列表
  async getFriend(ctx) {
    const v = await UserService.getFriend(ctx)
    ctx.body = JSONResolve.json(v)
  }
}

module.exports = new UserCtrl();
