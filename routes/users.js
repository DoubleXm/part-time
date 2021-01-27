const UserCtrl = require("../controller/users");
const Route = require("koa-router");
const router = new Route({ prefix: "/user" });
const { auth } = require("../middlewares/auth");

// common
router.post("/register", UserCtrl.register); // 注册
router.post("/login", UserCtrl.login); // 登录

router.put("/", auth, UserCtrl.editUser); // 编辑个人资料
router.get("/", auth, UserCtrl.getUser); // 获取个人资料

module.exports = router;
