const Koa = require('koa')

const app = new Koa()
const views = require('koa-views')
const json = require('koa-json')
// const onerror = require('koa-onerror')
const bodyparser = require('koa-bodyparser')
const logger = require('koa-logger')
const helmet = require('koa-helmet')
const cors = require('./middlewares/cors')
const jwt = require('./middlewares/jwt')
const { onerror, onNotFound } = require('./middlewares/error')
const { isTest } = require('./utils/env')
const { mailAlarm } = require('./alarm/index')

// 路由
const index = require('./routes/index')
const users = require('./routes/users')
const works = require('./routes/works')
const utils = require('./routes/utils')
const channel = require('./routes/channel')
const templates = require('./routes/templates')

// 安装预防，设置必要的 http 头
app.use(helmet())

// error handler
// onerror(app) // 不好用，自己写一个中间
app.use(onerror)

// 支持跨域
app.use(cors)

// 配置 jwt
app.use(jwt)

// middlewares
app.use(
    bodyparser({
        enableTypes: ['json', 'form', 'text'],
    })
)
app.use(json())
if (!isTest) app.use(logger())
app.use(require('koa-static')(`${__dirname}/public`))

app.use(
    views(`${__dirname}/views`, {
        extension: 'pug',
    })
)

// // logger
// app.use(async (ctx, next) => {
//     const start = new Date()
//     await next()
//     const ms = new Date() - start
//     console.log(`${ctx.method} ${ctx.url} - ${ms}ms`)
// })

// routes
app.use(index.routes(), index.allowedMethods())
app.use(users.routes(), users.allowedMethods())
app.use(works.routes(), works.allowedMethods())
app.use(utils.routes(), utils.allowedMethods())
app.use(channel.routes(), channel.allowedMethods())
app.use(templates.routes(), templates.allowedMethods())
app.use(onNotFound) // 404 路由，注册在最后

// error-handling
app.on('error', (err, ctx) => {
    console.error('server error', err, ctx)

    // 报警
    mailAlarm(
        `app.on error - ${err.message}`, // 统一错误报警，标题中必须错误信息，因为报警会依据标题做缓存
        err
    )
})

module.exports = app
