/**
 * @description 配置 sequelize ，连接 mysql
 * @author 双越
 */

const Sequelize = require('sequelize')
const { mysqlConf } = require('../../config/index')
const { isPrd, isTest } = require('../../utils/env')

// 连接配置
const { database, user, password, host, port } = mysqlConf
const conf = {
    host,
    port,
    dialect: 'mysql',
}

// 测试环境不打印日志
if (isTest) {
    conf.logging = () => {} // 默认是 console.log
}

// 线上环境用 链接池
if (isPrd) {
    conf.pool = {
        max: 5, // 连接池中最大连接数量
        min: 0, // 连接池中最小连接数量
        idle: 10000, // 如果一个线程 10 秒钟内没有被使用过的话，那么就释放线程
    }
}

// 创建连接
const seq = new Sequelize(database, user, password, conf)

module.exports = seq
