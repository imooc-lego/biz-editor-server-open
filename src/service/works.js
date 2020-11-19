/**
 * @description 作品 数据操作
 * @author 双越
 */

const { Op } = require('sequelize')
const _ = require('lodash')
const { WorkContentModel, WorkPublishContentModel } = require('../models/WorkContentModel')
const WorksModel = require('../models/WorksModel')
const UserModel = require('../models/UserModel')

/**
 * 创建作品
 * @param {object} data 作品数据，按照 WorksModel 的属性规则
 * @param {object} content 作品内容
 */
async function createWorkService(data = {}, content = {}) {
    // 创建作品内容 - mongoose
    const { components = [], props = {}, setting = {} } = content
    const newContent = await WorkContentModel.create({
        // 符合 WorkContentModel 属性规则
        components,
        props,
        setting,
    })
    const { _id: contentId } = newContent

    // 创建作品记录 - mysql
    const newWork = await WorksModel.create({
        // 符合 WorksModel 属性规则
        ...data,
        contentId: contentId.toString(), // 需要转换为字符串
    })
    return newWork.dataValues
}

/**
 * 查询单个作品
 * @param {object} whereOpt 查询条件
 */
async function findOneWorkService(whereOpt = {}) {
    if (_.isEmpty(whereOpt)) return null // 无查询条件

    // 查询作品记录 - mysql
    const result = await WorksModel.findOne({
        // 符合 WorksModel 的属性规则
        where: whereOpt,
        include: [
            // 关联 User
            {
                model: UserModel,
                attributes: ['userName', 'nickName', 'gender', 'picture'],
            },
        ],
    })

    if (result == null) {
        // 未查到
        return result
    }
    const work = result.dataValues

    // 查询作品内容 - mongodb
    const { contentId } = work
    const content = await WorkContentModel.findById(contentId)

    // 返回查询结果
    return {
        ...work,
        content, // 拼接上作品内容
    }
}

/**
 * 更新作品数据
 * @param {object} data 要更新的数据
 * @param {object} whereOpt 查询提交件
 * @returns {boolean} true/false
 */
async function updateWorkService(data = {}, whereOpt = {}) {
    // 保证数据不为空
    if (_.isEmpty(data)) return false
    if (_.isEmpty(whereOpt)) return false

    // 判断要更新的数据，是否存在
    const work = await findOneWorkService(whereOpt)
    if (work == null) return false

    // 要更新的数据
    const updateData = data

    // 更新 content - mongodb
    const { content } = updateData
    if (content) {
        // 更新 content
        const { contentId } = work
        await WorkContentModel.findByIdAndUpdate(contentId, {
            // 属性符合 ContentModel 规定
            components: content.components || [],
            props: content.props || {},
            setting: content.setting || {},
        })
    }

    // 删除不需要更新的数据
    delete updateData.id
    delete updateData.uuid
    delete updateData.content
    delete updateData.contentId

    if (_.isEmpty(updateData)) {
        // 至此，更新数据为空。
        // 这也可能正常，例如用户只更新 content ，content 是存储到 mongodb 的，不会更新 mysql
        return true
    }

    // 更新作品数据 - mysql
    const result = await WorksModel.update(updateData, { where: whereOpt })

    return result[0] !== 0
}

/**
 * 查询 作品/模板 列表
 * @param {object} whereOpt 查询条件
 * @param {object} pageOpt 分页
 */
async function findWorkListService(whereOpt = {}, pageOpt = {}) {
    // ------------ 拼接查询条件 ------------
    const wheres = {}

    // 1. 处理特殊的查询条件
    const { title, isTemplate, status } = whereOpt
    if (title) {
        Object.assign(wheres, {
            title: {
                [Op.like]: `%${title}%`, // 模糊查询
            },
        })
    }
    delete whereOpt.title // eslint-disable-line
    if (isTemplate != null) {
        Object.assign(wheres, {
            isTemplate: !!isTemplate, // 转换为 boolean 类型
        })
        delete whereOpt.isTemplate // eslint-disable-line
    }
    const statusNum = parseInt(status, 10)
    // eslint-disable-next-line
    if (isNaN(statusNum)) {
        // status 无要求，则屏蔽掉删除的
        Object.assign(wheres, {
            status: {
                [Op.ne]: 0,
            },
        })
    } else {
        // status 有明确要求
        Object.assign(wheres, { status: statusNum })
    }
    delete whereOpt.status // eslint-disable-line

    // 2. 拼接其他查询条件
    _.forEach(whereOpt, (val, key) => {
        if (val == null) return
        wheres[key] = val
    })

    // ------------ 执行查询 ------------
    const { pageSize, pageIndex } = pageOpt
    const pageSizeNumber = parseInt(pageSize, 10) // 有可能传入进来是 string 类型的
    const pageIndexNumber = parseInt(pageIndex, 10)
    const result = await WorksModel.findAndCountAll({
        limit: pageSizeNumber, // 每页多少条
        offset: pageSizeNumber * pageIndexNumber, // 跳过多少条
        order: [
            ['orderIndex', 'desc'], // 倒序
            ['id', 'desc'], // 倒序。多个排序，按先后顺序确定优先级
        ],
        where: wheres,
        include: [
            // 关联 User
            {
                model: UserModel,
                attributes: ['userName', 'nickName', 'gender', 'picture'],
            },
        ],
    })
    // result.count 总数，忽略了 limit 和 offset
    // result.rows 查询结果，数组
    const list = result.rows.map(row => row.dataValues)

    return {
        count: result.count,
        list,
    }
}

/**
 * 更新发布内容
 * @param {object} content 作品内容
 * @param {string} publishContentId 发布内容 id
 * @returns {string | null} publishContentId
 */
async function updatePublishContentService(content, publishContentId) {
    if (!content) return null

    // 属性符合 WorkContentModel 规定
    const { components = [], props = {}, setting = {} } = content

    // 已有发布内容 id
    if (publishContentId) {
        await WorkPublishContentModel.findByIdAndUpdate(publishContentId, {
            components,
            props,
            setting,
        })
        return publishContentId
    }

    // 还没有发布内容 id ，即之前尚未发布过
    const newPublishContent = await WorkPublishContentModel.create({
        components,
        props,
        setting,
    })
    return newPublishContent._id.toString() // eslint-disable-line
}

module.exports = {
    createWorkService,
    findOneWorkService,
    updateWorkService,
    findWorkListService,
    updatePublishContentService,
}
