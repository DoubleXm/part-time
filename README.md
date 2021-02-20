## part-time

基于 Koa 相关技术栈的 兼职平台(前后端)接口

## 项目背景

前段时间写了一篇关于 `koa` 的各种中间件的应用文章 [传送门](https://juejin.cn/post/6914163421208412173) 想着具体应用一下, 自己能够做个小的项目, 也算是锻炼一下自己的动手能力, 另一方面也希望对于大家有些许帮助, 当然不满意还请轻轻的喷😂，现在已经基本完成了就分享给大家 ; 

项目的整体使用技术是围绕 `koa` 和 `mysql` 进行的 ; 其中加入了一些其他的周边库 ; 比如 `mysql` 的 `ORM` `sequelize` ; `koa` 的 `body` 解析中间件 `koa-body` 等等 .... 目前项目已经放到 `github` 了  [传送门](https://github.com/ShuQingX/part-time) 

## 项目安装

本项目依赖于 `mysql` 所以需要提前安装 ; 对于安装 win 系统推荐大家看一下这篇文章, 希望对你有帮助 [传送门](https://www.runoob.com/w3cnote/windows10-mysql-installer.html) 对于 mac 实在不好意思, 自己想想办法吧 ; 

关于 `mysql` 的一个重要的概念 , 强烈推荐不是很了解连接池的同学可以看一看 [传送门](https://juejin.cn/post/6844903850630086669) ; 

`ORM` 也一并提一下吧 , `Object-relational mapping` 文档对象模型 , 一句话概括 (可能会有误差) 就是不写 `sql` 操作数据库 , 把表当做对象来维护 ; 本项目中使用的 `sequelize` ORM 框架 [传送门](https://www.sequelize.com.cn/)

在安装并了解以上概念之后, clone 项目并且修改 `part-time/config/index.js` 下的数据库配置 ; 随后执行 `npm install` 安装相关的依赖 ; 

#### 项目启动 :  

```bash
npm run dev # 测试环境
```

```bash
npm run prd # 生产环境
```

#### 文档查看

项目的最初我还想着要不要弄 swagger , 无奈又是懒, 在项目的 `config` 下有个 `part-time.json` 是作者调试接口的时候存下来的, 大家可以使用 `postman` 接口调试工具导入这个文件, 就可以看到项目中所有的接口了, 不了解这个功能的话, 这里已经给大家准备好了 ; [传送门](https://www.cnblogs.com/syw20170419/p/8747675.html)

#### 接口概览

![![5](C:\Users\AiTeZu\Desktop\5.jpg)](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/550b8ccc92324794bb4f1548f05575d0~tplv-k3u1fbpfcp-watermark.image)
![](https://p9-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/9ff28428ce2a4adebb7215d59c328633~tplv-k3u1fbpfcp-watermark.image)


## 项目描述

#### 前言 :

不了解业务直接看代码 , 要么是大神, 要么是渣渣 , 所以我认为还是很有必要介绍一下这个项目的 ; 

这个项目也不算是拍脑袋就来了, 作者之前在某鱼上买了一套 `ui` 设计图 , 里面的业务场景, 都是根据设计图想出来的, 当然会有好多不合理的地方, 甚至有一些功能根本没有实现出来, 具体原因我就不说了 ; `psd` 放到文章末尾了, 后续我这边会把前端给做出来; 当然啦如果你们有兴趣也可以自己做做看 ; 如果涉及到版权可以联系我删除 ;

#### 业务 : 

项目是一个兼职 app 应用 , 目前实现的模块有, 宝典 , 门任务 , 用户反馈 , 实习 , 兼职 , 用户 , 其中个人认为实习和兼职的业务耦合程度比较高, 所以就统一处理了 , 业务场景也是比较简单, 比较适合做练手项目, 由于体量不大, 也可以作为新技术学习使用 ; 

#### 项目目录 :

```
├─bin                      项目启动文件
├─config                   项目配置文件(postman接口文档, 数据库配置等等)
├─controller               模块控制器(处理返回内容, 主要的参数校验)
├─lib
│  ├─db.js                 数据库二次封装
│  ├─helper.js             数据返回统一处理
│  ├─utils.js              工具函数
│  ├─validator.js          参数校验统一管理
├─middlewares              中间件(此项目中只是做了 auth)
├─models                   数据表模型
├─public                   静态文件, 比如上传的文件
│  └─images
├─routes                   路由统一管理
├─services                 具体接口逻辑的处理
├─views
├─app.js                   项目入口文件
└─package.json             npm依赖文件
```

#### 细节处理 :

- 返回数据处理

```bash
/lib/helper.js
```

```javascript
class JSONResolve {
  success(msg = "success", code = 200) {
    return {
      msg,
      code,
    };
  }

  json(data, msg = "success", code = 200) {
    return {
      msg,
      code,
      data,
    };
  }
}

module.exports = new JSONResolve();
```

通过调用 `success` 或者 `json` 方法返回可控的成功数据 ; 对于不可控的数据返回用错误处理中间件处理 ; 

```bash
/app.js
```

```javascript
app.use(
  jsonError({
    // 默认会把堆栈信息也给一起发给客户端, 这样很明显是不合理的所以做了一层简单的处理
    postFormat(e, { stack, ...rest }) {
      const customRet = {
        msg: rest.message,
        code: rest.status,
      };
      return process.env.NODE_ENV === "production"
        ? customRet
        : { stack, ...rest, e };
    },
  })
);
```

如果需要手动抛出异常, 则可以使用 `ctx.throw(500, '服务器处理错误');` 类似于这样的格式抛出自定义的错误 ; 

- 路由统一注册

```bash
/router/index.js
```

```javascript
const fs = require("fs");
const path = require("path");

module.exports = {
  routing(app) {
    const files = fs.readdirSync(__dirname);
    files.forEach((item) => {
      if (item === "index.js") return;
      const route = require(path.resolve(__dirname, item));
      app.use(route.routes()).use(route.allowedMethods());
    });
  },
};
```

在 `index.js` 中通过 `fs` `path` 模块读取其他路由统一注册 (其他文件不要忘记导出 `router`), 然后放到 `app.js` 中统一注册 ; 

## 设计图的部分展示

> 还是那句话, 作者之前在某鱼买的 , `psd` 我放到文章末尾了, 如果涉及到版权可以联系我删除 ; 
>
> 大家如果根据这个后端做前端项目的时候, 建议也留下明显的测试记号, 后续有空的话, 我也会推出 `vue` 或者 `react` 版本的前端项目 ;

![![](C:\Users\AiTeZu\Desktop\1.jpg)](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/c103051a2ca041b287ebbcf7924cb5f5~tplv-k3u1fbpfcp-watermark.image)
![![2](C:\Users\AiTeZu\Desktop\2.jpg)](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/3b2a45be208b4449984a9c4fac5c87be~tplv-k3u1fbpfcp-watermark.image)
![](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/14c86c67959d4b89a9e1989bf12d52d4~tplv-k3u1fbpfcp-watermark.image)
![](https://p6-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/814ac7702f824b10911331c4703cb194~tplv-k3u1fbpfcp-watermark.image)

## 最后

自己写项目可以说老早就想了 , 作者前端是自学的, 很菜 ; 之前看视频的时候 , 都是跟着视频走, 有点自己的想法得不到实践, 说是项目实战视频, 对我来说更像是**项目抄写**, 所以一直都想自己做一个项目 ; 现在的想法也很简单, 就是后面可以用自己学到的前端技术去做项目, 不再害怕没有接口, 没有设计图等等**借口**, 最后造成了所有的东西都是会语法, 然后长期得不到练习, 最后忘记😂 ;

把项目放出来也是希望像我这样的人, 都能得到一些成长, 如果对你有帮助还希望 [点个小星星](https://github.com/ShuQingX/part-time) 

[设计图传送门](https://pan.baidu.com/s/1__Minss6OsGA791gXnN1kw)  提取码：a9yo 