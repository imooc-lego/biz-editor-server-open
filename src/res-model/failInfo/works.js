/**
 * @description res 错误信息配置 works
 * @author 双越
 */

// errno: 1300x

module.exports = {
    // 创建作品失败，数据库错误
    createWorksDbErrorFailInfo: {
        errno: 13001,
        message: '创建作品失败 db error',
    },

    // 创建作品失败，数据库无错误
    createWorksFailInfo: {
        errno: 13002,
        message: '创建作品失败',
    },

    // 查询单个作品失败
    findOneWorkFailInfo: {
        errno: 13003,
        message: '查询单个作品失败',
    },

    // 查询单个作品失败，数据库错误
    findOneWorkDbErrorFailInfo: {
        errno: 13004,
        message: '查询单个作品失败 db error',
    },

    // 修改作品失败
    updateWorkFailInfo: {
        errno: 13005,
        message: '修改作品失败',
    },

    // 修改作品失败，数据库错误
    updateWorkDbErrorFailInfo: {
        errno: 13006,
        message: '修改作品失败 db error',
    },

    // 删除/恢复 作品失败
    deleteWorkFailInfo: {
        errno: 13007,
        message: '删除/恢复 作品失败',
    },

    // 删除作品失败，数据库错误
    deleteWorkDbErrorFailInfo: {
        errno: 13008,
        message: '删除/恢复 作品失败 db error',
    },

    // 转赠作品失败
    transferWorkFailInfo: {
        errno: 13009,
        message: '转赠作品失败',
    },

    // 查询 作品/模板 失败
    findWorkListFailInfo: {
        errno: 13010,
        message: '查询作品/模板失败',
    },

    // 发布作品失败
    publishWorkFailInfo: {
        errno: 13011,
        message: '发布作品失败',
    },

    // 发布作品失败，数据库错误
    publishWorkDbErrorFailInfo: {
        errno: 13012,
        message: '发布作品失败 db error',
    },

    // 强制下线
    forceOffLineFailInfo: {
        errno: 13013,
        message: '操作失败，该作品被管理员强制下线，请联系管理员',
    },
}
