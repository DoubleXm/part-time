const path = require('path');
const Koa = require('koa');
const app = new Koa();
const views = require('koa-views');
const bodyParser = require('koa-body');
const parameter = require('koa-parameter');
const cors = require('koa2-cors');
const jsonError = require('koa-json-error');
const staitc = require('koa-static');
const { routing } = require('./routes');

// middlewares
app.use(
  jsonError({
    // 默认会把堆栈信息也给一起发给客户端, 这样很明显是不合理的所以做了一层简单的处理
    postFormat(e, { stack, ...rest }) {
      const customRet = {
        msg: rest.message,
        code: rest.status
      };
      return process.env.NODE_ENV === 'production' ? customRet : { stack, ...rest, e };
    }
  })
);
app.use(
  cors({
    origin: function (ctx) {
      return '*';
    },
    maxAge: 5, //指定本次预检请求的有效期，单位为秒。
    credentials: true, //是否允许发送Cookie
    allowMethods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'], //设置所允许的HTTP请求方法
    allowHeaders: ['Content-Type', 'Authorization', 'Accept'], //设置服务器支持的所有头信息字段
    exposeHeaders: ['WWW-Authenticate', 'Server-Authorization'] //设置获取其他自定义字段
  })
);
app.use(staitc(path.join(__dirname, '/public')));
app.use(views(__dirname, '/views'));
app.use(
  bodyParser({
    multipart: true,
    formidable: {
      uploadDir: path.join(__dirname, '/public/images'),
      keepExtensions: true // 保留后缀名
    }
  })
);
parameter(app);

// routes
routing(app);

module.exports = app;
