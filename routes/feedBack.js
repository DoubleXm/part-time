const feedBackCtrl = require("../controller/feedBacks");
const Route = require("koa-router");
const router = new Route({ prefix: "/feedback" });
const { auth } = require("../middlewares/auth");

router.post("/", auth, feedBackCtrl.createFeedBack); // 创建反馈内容

router.get("/admin", auth, feedBackCtrl.getAdminFeedBack); // 获取反馈列表
router.delete("/admin/:id", auth, feedBackCtrl.delAdminFeedBack); // 删除反馈

module.exports = router;
