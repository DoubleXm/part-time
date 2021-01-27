const CourseCtrl = require("../controller/courses");
const Route = require("koa-router");
const router = new Route({ prefix: "/course" });

router.get("/", CourseCtrl.getCuorse); // 宝典列表
router.get("/:id", CourseCtrl.getCuorseById); // 宝典详情

module.exports = router;
