const DoorTaskService = require('../services/doorTasks');
const JSONResolve = require('../lib/helper');
const { doorTaskValidate } = require('../lib/validator');

class DoorTaskCtrl {
  // admin
  async addAdminTask(ctx) {
    ctx.verifyParams({
      title: doorTaskValidate.title,
      task_detail: doorTaskValidate.task_detail,
      price: doorTaskValidate.price,
      surplus: doorTaskValidate.surplus,
      task_catetory: doorTaskValidate.task_catetory
    });
    const v = await DoorTaskService.addAdminTask(ctx);
    ctx.body = JSONResolve.json(v);
  }
  async setAdminTask(ctx) {
    ctx.verifyParams({
      title: doorTaskValidate.title,
      task_detail: doorTaskValidate.task_detail,
      price: doorTaskValidate.price,
      surplus: doorTaskValidate.surplus,
      task_catetory: doorTaskValidate.task_catetory
    });
    const v = await DoorTaskService.setAdminTask(ctx);
    ctx.body = JSONResolve.json(v);
  }
  async delAdminTask(ctx) {
    await DoorTaskService.delAdminTask(ctx);
    ctx.body = JSONResolve.json();
  }
  // app
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
      images: doorTaskValidate.images
    });

    const v = await DoorTaskService.submitTask(ctx);
    ctx.body = JSONResolve.json(v);
  }
  async getSubmitTask(ctx) {
    const v = await DoorTaskService.getSubmitTask(ctx);
    ctx.body = JSONResolve.json(v);
  }
  async delSubmitTask(ctx) {
    const v = await DoorTaskService.delSubmitTask(ctx);
    ctx.body = JSONResolve.json(v);
  }
  async verifySubmitTask(ctx) {
    await DoorTaskService.verifySubmitTask(ctx);
    ctx.body = JSONResolve.json();
  }
}

module.exports = new DoorTaskCtrl();
