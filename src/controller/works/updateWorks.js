/**
 * @description 修改作品
 * @author 双越
 */

const _ = require('lodash')
const { updateWorkService } = require('../../service/works')
const { findOneUserService } = require('../../service/users')
const { ErrorRes, SuccessRes } = require('../../res-model/index')
const {
    updateWorkFailInfo,
    updateWorkDbErrorFailInfo,
    transferWorkFailInfo,
} = require('../../res-model/failInfo/index')
const { mailAlarm } = require('../../alarm/index')

/**
 * 修改作品
 * @param {string} id id
 * @param {string} author 作者 username （安全性，不允许修改他人作品）
 * @param {object} data 作品数据
 */
async function updateWorks(id, author, data = {}) {
    // 保证数据不为空
    if (!id || !author) return new ErrorRes(updateWorkFailInfo, 'id 或 author 不能为空')
    if (_.isEmpty(data)) return new ErrorRes(updateWorkFailInfo, '更新数据不能为空')

    let res
    try {
        res = await updateWorkService(data, { id, author })
    } catch (ex) {
        console.error('更新作品错误', id, ex)
        mailAlarm(`更新作品 ${id} 错误`, ex) // 报警。title 中要有作品 id ，报警会根据 title 缓存节流
        return new ErrorRes(updateWorkDbErrorFailInfo) // 数据库错误
    }

    // 更新成功
    if (res) return new SuccessRes()
    // 更新失败
    return new ErrorRes(updateWorkFailInfo, 'id 或 author 不匹配')
}

/**
 * 转赠作品
 * @param {string} id id
 * @param {string} author 作者 username
 * @param {string} receiverUsername 接收人 username
 */
async function transferWorks(id, author, receiverUsername) {
    // 两者一样
    if (author === receiverUsername) return new ErrorRes(transferWorkFailInfo, '作者和接收人相同')

    // 判断接收者是否存在
    const receiver = await findOneUserService({ username: receiverUsername })
    if (receiver == null) return new ErrorRes(transferWorkFailInfo, '接收人未找到')

    const res = await updateWorks(id, author, {
        author: receiverUsername,
    })
    return res
}

module.exports = {
    updateWorks,
    transferWorks,
}
