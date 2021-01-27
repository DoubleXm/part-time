const PricticeCtrl = require('../controller/prictices')
const Route = require('koa-router')
const router = new Route({ prefix: '/parttime' })
const { auth } = require('../middlewares/auth')


router.get('/', PricticeCtrl.getPrictice) // 获取列表

module.exports = router