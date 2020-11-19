/**
 * @description 统一错误处理 failInfo
 * @author 双越
 */

module.exports = {
    // 统一错误处理
    serverErrorFailInfo: {
        errno: -1,
        message: '运行错误',
    },
    // 404
    notFoundFailInfo: {
        errno: -2,
        message: '404 Not Found',
    },
}
