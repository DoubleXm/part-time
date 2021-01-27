const feedBackCtrl = require("../controller/feedBacks");
const Route = require("koa-router");
const router = new Route({ prefix: "/feedback" });
const { auth } = require("../middlewares/auth");

router.post("/", auth, feedBackCtrl.createFeedBack); // 创建反馈内容

module.exports = router;
