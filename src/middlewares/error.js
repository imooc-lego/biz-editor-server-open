/**
 * @description 错误处理中间件
 * @author 双越
 */

const { ErrorRes } = require('../res-model/index')
const { serverErrorFailInfo, notFoundFailInfo } = require('../res-model/failInfo/index')
const { isPrd } = require('../utils/env')
const { mailAlarm } = require('../alarm/index')

/**
 * 统一错误处理
 * @param {object} ctx ctx
 * @param {Function} next next
 */
async function onerror(ctx, next) {
    try {
        await next()
    } catch (ex) {
        console.error('onerror middleware', ex)

        // 报警
        mailAlarm(
            `onerror 中间件 - ${ex.message}`, // 统一错误报警，标题中必须错误信息，因为报警会依据标题做缓存
            ex
        )

        const errInfo = serverErrorFailInfo
        if (!isPrd) {
            // 非线上环境，暴露错误信息
            errInfo.data = {
                message: ex.message,
                stack: ex.stack,
            }
        }
        ctx.body = new ErrorRes(errInfo)
    }
}

/**
 * 404
 * @param {object} ctx ctx
 */
async function onNotFound(ctx) {
    ctx.body = new ErrorRes(notFoundFailInfo)
}

module.exports = {
    onerror,
    onNotFound,
}
