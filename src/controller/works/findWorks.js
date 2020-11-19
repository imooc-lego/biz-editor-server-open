/**
 * @description 查询作品
 * @author 双越
 */

const { findOneWorkService, findWorkListService } = require('../../service/works')
const { ErrorRes, SuccessRes } = require('../../res-model/index')
const {
    findOneWorkFailInfo,
    findOneWorkDbErrorFailInfo,
} = require('../../res-model/failInfo/index')
const { DEFAULT_PAGE_SIZE } = require('../../config/constant')

/**
 * 查询单个作品
 * @param {string} id id
 * @param {string} author 作者 username（保证安全性，避免查询他人作品）
 */
async function findOneWork(id, author) {
    if (!id || !author) return new ErrorRes(findOneWorkFailInfo, 'id 或 author 为空')

    let work
    try {
        work = await findOneWorkService({
            id,
            author,
        })
    } catch (ex) {
        console.error('查询单个作品', ex)
        return new ErrorRes(findOneWorkDbErrorFailInfo) // 数据库错误
    }

    // 查询失败
    if (work == null) return new ErrorRes(findOneWorkFailInfo, 'id 或 author 不匹配')

    // 查询成功
    return new SuccessRes(work)
}

/**
 * 获取自己的作品或模板
 * @param {string} author 作者
 * @param {object} queryInfo 查询条件
 * @param {object} pageInfo 分页
 */
async function findMyWorks(author, queryInfo = {}, pageInfo = {}) {
    const { id, uuid, title, status, isTemplate } = queryInfo

    let { pageIndex, pageSize } = pageInfo
    pageIndex = parseInt(pageIndex, 10) || 0
    pageSize = parseInt(pageSize, 10) || DEFAULT_PAGE_SIZE

    const { list, count } = await findWorkListService(
        {
            id,
            uuid,
            title,
            status,
            author,
            isTemplate: isTemplate === '1',
        },
        {
            pageIndex,
            pageSize,
        }
    )
    return new SuccessRes({ list, count })
}

module.exports = {
    findOneWork,
    findMyWorks,
}
