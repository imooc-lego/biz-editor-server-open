/**
 * @description 生成 ctx.request.body 格式校验的中间件
 * @author 双越
 */

const Ajv = require('ajv')
const { ErrorRes } = require('../res-model/index')
const { validateFailInfo } = require('../res-model/failInfo/index')

const ajv = new Ajv({
    allErrors: true, // 输出所有错误
})

/**
 * json schema 校验
 * @param {Object} schema json schema 规则
 * @param {Object} data 待校验的数据
 * @returns {Array|undefined} 错误信息|undefined
 */
function validate(schema, data = {}) {
    const valid = ajv.validate(schema, data)
    if (!valid) {
        return ajv.errors
    }
    return undefined
}

/**
 * 生成校验中间件
 * @param {Object} schema schema 规则
 */
function genValidator(schema) {
    /**
     * ctx.request.body 格式校验中间件
     * @param {Object} ctx ctx
     * @param {Function} next next
     */
    async function validator(ctx, next) {
        const data = ctx.request.body

        const validateError = validate(schema, data)
        if (validateError) {
            // 检验失败，返回
            ctx.body = new ErrorRes({
                ...validateFailInfo, // 其中有 errno 和 message
                data: validateError, // 把失败信息也返回给前端
            })
            return
        }
        // 检验成功，继续
        await next()
    }
    return validator
}

module.exports = genValidator
