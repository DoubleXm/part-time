const User = require("../models/users");
const jsonwebtoken = require("jsonwebtoken");
const { secret } = require("../config");
const crypto = require("crypto");

class UserService {
  // 密码加密
  static secretPassword(pwd) {
    const hash = crypto.createHash("md5");
    hash.update(pwd);
    return hash.digest("hex");
  }

  async register(ctx) {
    const { nick_name, phone_number, password } = ctx.request.body;

    const hasUser = await User.findOne({ where: { phone_number } });
    if (hasUser) {
      ctx.throw(412, "用户已经存在");
    }
    const cryptoPwd = UserService.secretPassword(password);
    const data = await User.create({
      nick_name,
      phone_number,
      password: cryptoPwd,
    });

    // 生成 token
    const token = jsonwebtoken.sign({ phone_number, password }, secret, {
      expiresIn: "1d",
    });
    return { info: { ...data.toJSON() }, token };
  }

  async login(ctx) {
    const { phone_number, password } = ctx.request.body;

    const hasUser = await User.findOne({ where: { phone_number } });
    if (!hasUser) {
      ctx.throw(412, "用户不存在");
    }
    const cryptoPwd = UserService.secretPassword(password);
    if (hasUser.password !== cryptoPwd) {
      ctx.throw(412, "用户密码错误");
    }
    // 生成 token
    const token = jsonwebtoken.sign({ phone_number, password }, secret, {
      expiresIn: "1d",
    });
    return { info: { ...hasUser.toJSON() }, token };
  }

  async editUser(ctx) {
    const {
      avatar,
      nick_name,
      real_name,
      autograph,
      age,
      gender,
      height,
      phone_number,
      school,
      experience,
    } = ctx.request.body;
    const users = await User.findAll({ where: { phone_number } });
    if (users.length > 1) {
      ctx.throw(412, "手机号以被其他用户使用");
    }
    await User.update(
      {
        avatar,
        nick_name,
        real_name,
        autograph,
        age,
        gender,
        height,
        phone_number,
        school,
        experience,
      },
      { where: { phone_number } }
    );
    const data = await User.findOne({ where: { phone_number } });
    return { info: { ...data.toJSON() } };
  }

  async getUser(ctx) {
    const authorization = ctx.header.authorization.split(" ")[1];
    // 解密 token 然后根据手机号查询用户信息
    const { phone_number } = jsonwebtoken.verify(authorization, secret);
    const data = await User.findOne({ where: { phone_number } });
    return { info: { ...data.toJSON() } };
  }
}

module.exports = new UserService();
