/**
 * @description channel service
 * @author 双越
 */

const { Op } = require('sequelize')
const _ = require('lodash')
const ChannelModel = require('../models/ChannelModel')

/**
 * 创建渠道
 * @param {object} data 渠道数据
 */
async function createChannelService(data = {}) {
    const newChannel = await ChannelModel.create(data)
    return newChannel.dataValues
}

/**
 * 更新渠道
 * @param {object} data 要更新的数据
 * @param {object} whereOpt 查询条件
 */
async function updateChannelService(data = {}, whereOpt = {}) {
    if (_.isEmpty(whereOpt)) return false
    if (_.isEmpty(data)) return false

    const result = await ChannelModel.update(data, { where: whereOpt })

    return result[0] !== 0
}

/**
 * 查询渠道
 * @param {object} whereOpt 查询条件
 */
async function findChannelsService(whereOpt = {}) {
    // 屏蔽掉删除的
    if (whereOpt.status == null) {
        Object.assign(whereOpt, {
            status: {
                [Op.ne]: 0,
            },
        })
    }

    const result = await ChannelModel.findAndCountAll({
        order: [
            ['id', 'desc'], // 倒序
        ],
        where: whereOpt,
    })

    // result.count 总数，忽略了 limit 和 offset
    // result.rows 查询结果，数组
    const list = result.rows.map(row => row.dataValues)

    return {
        count: result.count,
        list,
    }
}

module.exports = {
    createChannelService,
    updateChannelService,
    findChannelsService,
}
