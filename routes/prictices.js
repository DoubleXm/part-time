const PricticeCtrl = require("../controller/prictices");
const Route = require("koa-router");
const router = new Route({ prefix: "/prictice" });
const { auth } = require("../middlewares/auth");

router.get("/classify", PricticeCtrl.pricticeClassify); // 返回分类(后端维护) 实习/兼职 共用
router.post("/admin", auth, PricticeCtrl.createPrictice); // 创建实习/兼职

router.get("/", PricticeCtrl.getPrictice); // 获取列表

module.exports = router;
