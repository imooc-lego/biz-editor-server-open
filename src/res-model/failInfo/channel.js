/**
 * @description res 错误信息配置 channel
 * @author 双越
 */

// errno: 1500x

module.exports = {
    // 创建渠道失败
    createChannelFailInfo: {
        errno: 15001,
        message: '创建渠道失败',
    },

    // 创建渠道失败 数据库错误
    createChannelDbErrorFailInfo: {
        errno: 15002,
        message: '创建渠道失败 db error',
    },

    // 更新/删除 渠道失败
    updateChannelFailInfo: {
        errno: 15003,
        message: '更新/删除 渠道失败',
    },

    // 更新/删除 渠道失败 数据库错误
    updateChannelDbErrorFailInfo: {
        errno: 15004,
        message: '更新/删除 渠道失败 db error',
    },

    // 获取渠道列表失败
    findChannelListFailInfo: {
        errno: 15005,
        message: '获取渠道列表失败',
    },
}
