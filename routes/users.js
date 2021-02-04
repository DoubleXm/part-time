const UserCtrl = require("../controller/users");
const Route = require("koa-router");
const router = new Route({ prefix: "/user" });
const { auth } = require("../middlewares/auth");

// common
router.post("/register", UserCtrl.register); // 注册
router.post("/login", UserCtrl.login); // 登录

router.post('/friend', auth, UserCtrl.addFriend); // 添加好友
router.get('/friend', auth, UserCtrl.getFriend); // 获取好友列表
router.delete('/friend/:id', auth, UserCtrl.delFriend); // 

// admin 
router.get('/admin', auth, UserCtrl.getAdminUser); // 获取用户列表
router.delete('/admin/:id', auth, UserCtrl.delAdminUser); // 删除用户

router.put("/", auth, UserCtrl.editUser); // 编辑个人资料
router.get("/", auth, UserCtrl.getUser); // 获取个人资料
router.get('/:id', auth, UserCtrl.getUserById); // 获取指定的用户信息

module.exports = router;
