/**
 * @description 公共模板 - 缓存
 * @author 双越
 */

const { cacheSet, cacheGet } = require('../index')
const { getSortedObjStr } = require('../../utils/util')

/**
 * 获取 key
 * @param {object} queryInfo 查询条件
 * @param {object} pageInfo 分页
 */
function getCacheKey(queryInfo = {}, pageInfo = {}) {
    const PREFIX = 'public-templates-'
    const queryInfoStr = getSortedObjStr(queryInfo)
    const pageInfoStr = getSortedObjStr(pageInfo)

    const key = `${PREFIX}${queryInfoStr}-${pageInfoStr}`
    return key
}

/**
 * 公共模板 - 缓存 get
 * @param {object} queryInfo 查询条件
 * @param {object} pageInfo 分页
 */
async function publicTemplatesCacheGet(queryInfo = {}, pageInfo = {}) {
    const key = getCacheKey(queryInfo, pageInfo)
    const templates = await cacheGet(key)
    if (!templates) return null // 无缓存
    return templates // cacheGet 中有 JSON.parse
}

/**
 * 公共模板 - 缓存 set
 * @param {object} queryInfo 查询条件
 * @param {object} pageInfo 分页
 * @param {object} templates 模板数据
 */
function publicTemplatesCacheSet(queryInfo = {}, pageInfo = {}, templates) {
    if (templates == null) return

    const key = getCacheKey(queryInfo, pageInfo)
    cacheSet(
        key,
        templates,
        60 // timeout 设置为 1min，单位是 s
    )
}

module.exports = {
    publicTemplatesCacheGet,
    publicTemplatesCacheSet,
}
