const Route = require('koa-router');
const router = new Route({ prefix: '/door' });
const DoorTaskCtrl = require('../controller/doorTasks');
const { auth } = require('../middlewares/auth');

router.post('/admin', auth, DoorTaskCtrl.addAdminTask); // 创建门任务 admin
router.put('/admin', auth, DoorTaskCtrl.setAdminTask); // 修改门任务 admin
router.delete('/admin', auth, DoorTaskCtrl.delAdminTask); // 删除门任务 admin

router.get('/admin/submit', auth, DoorTaskCtrl.getSubmitTask); // 获取门任务提交记录列表
router.put('/admin/submit', auth, DoorTaskCtrl.verifySubmitTask); // 更改门任务提交的审核状态
router.delete('/admin/submit', auth, DoorTaskCtrl.delSubmitTask); // 删除门任务提交记录

router.get('/', DoorTaskCtrl.getTask); // 获取门任务列表
router.get('/:id', DoorTaskCtrl.getTaskById); // 获取指定门任务
router.post('/submit', auth, DoorTaskCtrl.submitTask); // 门任务提交

module.exports = router;
