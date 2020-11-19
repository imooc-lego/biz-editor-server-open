/**
 * @description res 错误信息配置 validate
 * @author 双越
 */

// errno: 1100x

module.exports = {
    // ctx.request.body 格式验证失败
    validateFailInfo: {
        errno: 11001,
        message: '输入数据的格式错误',
    },
}
