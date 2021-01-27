const DoorTaskService = require("../services/doorTasks");
const JSONResolve = require("../lib/helper");
const { doorTaskValidate } = require("../lib/validator");

class DoorTaskCtrl {
  async createAdminTask(ctx) {
    ctx.verifyParams({
      title: doorTaskValidate.title,
      task_detail: doorTaskValidate.task_detail,
      price: doorTaskValidate.price,
      surplus: doorTaskValidate.surplus,
      task_catetory: doorTaskValidate.task_catetory,
    });
    const v = await DoorTaskService.createAdminTask(ctx);
    ctx.body = JSONResolve.json(v);
  }

  async getTask(ctx) {
    const v = await DoorTaskService.getTask(ctx);
    ctx.body = JSONResolve.json(v);
  }

  async getTaskById(ctx) {
    const v = await DoorTaskService.getTaskById(ctx);
    ctx.body = JSONResolve.json(v);
  }

  async submitTask(ctx) {
    ctx.verifyParams({
      content: doorTaskValidate.content,
      images: doorTaskValidate.images,
    });

    const v = await DoorTaskService.submitTask(ctx);
    ctx.body = JSONResolve.json(v);
  }
}

module.exports = new DoorTaskCtrl();
