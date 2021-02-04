const CourseCtrl = require("../controller/courses");
const Route = require("koa-router");
const router = new Route({ prefix: "/course" });

router.get('/admin', CourseCtrl.getAdminCuorse); // 获取宝典列表
router.put('/admin', CourseCtrl.setAdminCuorse); // 修改宝典
router.delete('/admin/:id', CourseCtrl.delAdminCuorse); //删除宝典
router.post('/admin', CourseCtrl.addAdminCuorse); // 创建宝典

router.get("/", CourseCtrl.getCuorse); // 宝典列表
router.get("/:id", CourseCtrl.getCuorseById); // 宝典详情

module.exports = router;
