const router = require('koa-router')()
const { ENV } = require('../utils/env')
const { WorkContentModel } = require('../models/WorkContentModel')
const { cacheGet, cacheSet } = require('../cache/index')
const testMysqlConn = require('../db/mysql2')
const packageInfo = require('../../package.json')

// 测试数据库连接
router.get('/api/db-check', async (ctx, next) => {
    // 测试 mongodb 连接
    let mongodbConn
    try {
        mongodbConn = true
        await WorkContentModel.findOne()
    } catch (ex) {
        mongodbConn = false
    }

    // 测试 redis 连接
    cacheSet('name', 'biz editor sever OK - by redis')
    const redisTestVal = await cacheGet('name')

    // 测试 mysql 连接
    const mysqlRes = await testMysqlConn()

    ctx.body = {
        errno: 0,
        data: {
            name: 'biz editor sever',
            version: packageInfo.version,
            ENV,
            redisConn: redisTestVal != null,
            mysqlConn: mysqlRes.length > 0,
            mongodbConn,
        },
    }
})

module.exports = router
