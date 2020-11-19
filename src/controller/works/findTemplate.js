/**
 * @description 查询模板
 * @author 双越
 */

const { findOneWorkService, findWorkListService } = require('../../service/works')
const { publicTemplatesCacheGet, publicTemplatesCacheSet } = require('../../cache/works/templates')
const {
    findOneWorkFailInfo,
    findOneWorkDbErrorFailInfo,
} = require('../../res-model/failInfo/index')
const { ErrorRes, SuccessRes } = require('../../res-model/index')
const { DEFAULT_PAGE_SIZE } = require('../../config/constant')

/**
 * 隐藏手机号
 * @param {string} number 手机号
 */
function hidePhoneNumber(number = '') {
    const n = number.toString()

    if (!n) return n

    const reg = /^1[3456789]\d{9}$/ // 手机号正则
    if (reg.test(n) === false) return n

    return n.slice(0, 3) + '****' + n.slice(-4) // eslint-disable-line
}

/**
 * 格式化公共的模板数据，隐藏一些信息
 * @param {object|Array} template 模板数据
 */
function formatTemplate(template = {}) {
    if (Array.isArray(template)) {
        // 传入了 list
        return template.map(t => formatTemplate(t))
    }

    // 传入了单个 template
    const result = template

    // 用户名若是手机号，则隐藏手机号
    result.author = hidePhoneNumber(result.author)
    if (result.user) {
        const user = result.user.dataValues
        user.userName = hidePhoneNumber(user.userName)
    }

    return result
}

/**
 * 查询公共模板
 * @param {object} queryInfo 查询条件
 * @param {object} pageInfo 分页
 */
async function findPublicTemplates(queryInfo = {}, pageInfo = {}) {
    // 试图从 cache 中获取
    const templatesFromCache = await publicTemplatesCacheGet(queryInfo, pageInfo)
    if (templatesFromCache != null) {
        // 从缓存中获取
        return new SuccessRes(templatesFromCache)
    }

    const { id, uuid, title } = queryInfo
    let { pageIndex, pageSize } = pageInfo
    pageIndex = parseInt(pageIndex, 10) || 0
    pageSize = parseInt(pageSize, 10) || DEFAULT_PAGE_SIZE

    // 缓存中没有，从数据库获取
    const { list, count } = await findWorkListService(
        {
            id,
            uuid,
            title,
            isTemplate: true,
            isPublic: true, // 公开的
        },
        {
            pageIndex,
            pageSize,
        }
    )

    // 格式化模板
    const formatList = formatTemplate(list)

    // 记录到缓存
    publicTemplatesCacheSet(queryInfo, pageInfo, { list: formatList, count })

    // 返回
    return new SuccessRes({ list: formatList, count })
}

/**
 * 查询单个作品
 * @param {string} id id
 */
async function findOneTemplate(id) {
    if (!id) return new ErrorRes(findOneWorkFailInfo, 'id 为空')

    let template
    try {
        template = await findOneWorkService({
            id,
            isTemplate: true,
            isPublic: true, // 公开的
        })
    } catch (ex) {
        console.error('查询单个模板', ex)
        return new ErrorRes(findOneWorkDbErrorFailInfo) // 数据库错误
    }

    // 查询失败
    if (template == null) return new ErrorRes(findOneWorkFailInfo)

    // 格式忽视
    template = formatTemplate(template)

    // 查询成功
    return new SuccessRes(template)
}

module.exports = {
    findPublicTemplates,
    findOneTemplate,
}
