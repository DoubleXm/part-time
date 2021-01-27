const Router = require('koa-router');
const router = new Router({ prefix: '/upload' });
const path = require('path');
const JSONResolve = require('../lib/helper');

// 文件上传
router.post('/', async (ctx) => {
  const files = ctx.request.files.name;
  const filePath = `${ctx.origin}/images/${path.basename(files.path)}`
  ctx.body = JSONResolve.json({ path: filePath });
}); 

module.exports = router;