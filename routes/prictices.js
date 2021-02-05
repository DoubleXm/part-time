const PricticeCtrl = require("../controller/prictices");
const Route = require("koa-router");
const router = new Route({ prefix: "/prictice" });
const { auth } = require("../middlewares/auth");

router.get("/classify", PricticeCtrl.pricticeClassify); // 返回分类(后端维护) 实习/兼职 共用
router.get("/city/classify", PricticeCtrl.parttimeClassify); // 城市分类列表
router.post("/admin", auth, PricticeCtrl.addAdminPrictice); // 创建实习/兼职
router.put("/admin", auth, PricticeCtrl.setAdminPrictice); // 修改兼职/实习
router.delete("/admin/:id", auth, PricticeCtrl.delAdminPrictice); // 删除实习/兼职

router.get("/", PricticeCtrl.getPrictice); // 获取列表 可以通过 admin 参数来选择是admin列表还是app列表

module.exports = router;
