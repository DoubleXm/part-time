const Route = require("koa-router");
const router = new Route({ prefix: "/door" });
const DoorTaskCtrl = require("../controller/doorTasks");
const { auth } = require("../middlewares/auth");

router.post("/admin", auth, DoorTaskCtrl.createAdminTask); // 创建门任务 admin

router.get("/", DoorTaskCtrl.getTask); // 获取门任务列表
router.get("/:id", DoorTaskCtrl.getTaskById); // 获取指定门任务
router.post("/submit", auth, DoorTaskCtrl.submitTask); // 门任务提交

module.exports = router;
