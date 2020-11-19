/**
 * @description 删除作品
 * @author 双越
 */

const { updateWorkService, findOneWorkService } = require('../../service/works')
const { ErrorRes, SuccessRes } = require('../../res-model/index')
const { deleteWorkFailInfo, deleteWorkDbErrorFailInfo } = require('../../res-model/failInfo/index')

/**
 * 删除作品
 * @param {string} id id
 * @param {string} author 作者 username
 * @param {boolean} putBack 恢复删除，默认 false
 */
async function deleteWork(id, author, putBack = false) {
    let res
    try {
        // 假删除，更新 status
        const status = putBack === true ? 1 : 0
        res = await updateWorkService(
            { status },
            { id, author } // 条件里加 author ，防止删除别人的项目
        )
    } catch (ex) {
        console.error('删除作品错误', ex)
        return new ErrorRes(deleteWorkDbErrorFailInfo)
    }

    // 删除成功
    if (res) return new SuccessRes()
    // 删除失败
    return new ErrorRes(deleteWorkFailInfo, 'id 或 author 不匹配')
}

/**
 * 恢复删除
 * @param {string} id id
 * @param {string} author 作者 username
 */
async function putBackWork(id, author) {
    const res = await deleteWork(id, author, true)
    return res
}

module.exports = {
    deleteWork,
    putBackWork,
}
