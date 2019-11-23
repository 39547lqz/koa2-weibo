const Koa = require('koa');
const app = new Koa();
const views = require('koa-views');
const json = require('koa-json');
const onerror = require('koa-onerror');
const bodyparser = require('koa-bodyparser');
const logger = require('koa-logger');
const session = require('koa-generic-session');
const redisStore = require('koa-redis');

// 路由
const errorViewRouter = require('./routes/view/error');
const index = require('./routes/index');
const userViewRouter = require('./routes/view/user');

const { REDIS_CONF } = require('./conf/db');
const { isProd } = require('./utils/env');
const jwt = require('koa-jwt');

const { secret } = require("./conf/constants");
// error handler
 let onerrorConf = {};
 if (isProd) {
   onerrorConf = {
     redirect : "/error"
   };
 }
onerror(app, onerrorConf);

 // app.use(jwt({
 //   secret : secret
 // }).unless({
 //   path : [/^\/users\/login/]
 // }));

// middlewares
app.use(bodyparser({
  enableTypes:['json', 'form', 'text']
}));
app.use(json());
app.use(logger());
app.use(require('koa-static')(__dirname + '/public'));

app.use(views(__dirname + '/views', {
  extension: 'ejs'
}));

 // session 配置
app.keys = ['As$_=-+&'];
app.use(session({
  key : 'weibo.sid',
  prefix : 'weibo:sess:',
  cookie : {
    path : '/',
    httpOnly : true,
    maxAge : 24*60*60*1000
  },
  ttl : 24*60*60*1000,
  store : redisStore({
    all : `${REDIS_CONF.host}:${REDIS_CONF.port}`
  })
}));

// logger
// app.use(async (ctx, next) => {
//   const start = new Date()
//   await next()
//   const ms = new Date() - start
//   console.log(`${ctx.method} ${ctx.url} - ${ms}ms`)
// })

// routes
app.use(index.routes(), index.allowedMethods());
app.use(userViewRouter.routes(), userViewRouter.allowedMethods());
app.use(errorViewRouter.routes(), errorViewRouter.allowedMethods());

// error-handling
app.on('error', (err, ctx) => {
  console.error('server error', err, ctx)
});

module.exports = app;