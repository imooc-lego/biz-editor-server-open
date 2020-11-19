/**
 * @description controller channel
 * @author 双越老师
 */

const {
    createChannelService,
    updateChannelService,
    findChannelsService,
} = require('../../service/channel')
const {
    createChannelFailInfo,
    createChannelDbErrorFailInfo,
    updateChannelFailInfo,
    updateChannelDbErrorFailInfo,
    findChannelListFailInfo,
} = require('../../res-model/failInfo/index')
const { ErrorRes, SuccessRes } = require('../../res-model/index')

/**
 * 创建渠道
 * @param {object} data 渠道数据
 */
async function createChannel(data = {}) {
    const { workId, name } = data
    if (!workId || !name) return new ErrorRes(createChannelFailInfo, '标题和作品 id 不能为空')

    let result
    try {
        result = await createChannelService(data)
    } catch (ex) {
        console.error('创建渠道错误', ex)
        return new ErrorRes(createChannelDbErrorFailInfo)
    }

    if (result == null) return new ErrorRes(createChannelFailInfo)
    return new SuccessRes(result)
}

/**
 * 删除渠道
 * @param {string} id id
 */
async function deleteChannel(id) {
    if (!id) return new ErrorRes(updateChannelFailInfo, 'id 不能为空')

    let result
    try {
        result = await updateChannelService(
            {
                status: 0, // 假删除，实际更新 status
            },
            {
                id,
            }
        )
    } catch (ex) {
        console.error('删除渠道错误', ex)
        return new ErrorRes(updateChannelDbErrorFailInfo)
    }

    if (result) return new SuccessRes() // 成功
    return new ErrorRes(updateChannelFailInfo)
}

/**
 * 更新渠道
 * @param {string} id id
 * @param {string} name 名称
 */
async function updateChannelName(id, name) {
    if (!id || !name) return new ErrorRes(updateChannelFailInfo, 'id 和名称不能为空')

    let result
    try {
        result = await updateChannelService({ name }, { id })
    } catch (ex) {
        console.error('更新渠道错误', ex)
        return new ErrorRes(updateChannelDbErrorFailInfo)
    }

    if (result) return new SuccessRes() // 成功
    return new ErrorRes(updateChannelFailInfo)
}

/**
 * 获取作品的渠道列表
 * @param {string} workId 作品 id
 */
async function getWorkChannels(workId) {
    if (!workId) return new ErrorRes(findChannelListFailInfo, 'id 和名称不能为空')

    const result = await findChannelsService({
        workId,
    })

    return new SuccessRes(result)
}

module.exports = {
    createChannel,
    deleteChannel,
    updateChannelName,
    getWorkChannels,
}
